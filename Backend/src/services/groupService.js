const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const Batch = require("../models/batchModel");
const { AppError } = require("../utils/errors");

function normalizeSeason(season = "") {
  return String(season || "").trim().toLowerCase();
}

function getGroupSeason(group) {
  return normalizeSeason(group.cropSeason || group.cropPlanning?.season || "");
}

async function hasActiveSeasonConflict(farmer, season) {
  if (!season) return false;
  const activeGroupIds = (farmer.activeGroups || []).map((id) => id);
  if (!activeGroupIds.length) return false;
  const activeGroups = await Group.find({ _id: { $in: activeGroupIds }, status: "active" });
  const normalizedSeason = normalizeSeason(season);
  return activeGroups.some((g) => getGroupSeason(g) === normalizedSeason);
}

async function createGroup({ auth, payload }) {
  const leader = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!leader) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const groupSeason = payload.cropSeason || payload.cropPlanning?.season;
  if (await hasActiveSeasonConflict(leader, groupSeason)) {
    throw new AppError(
      "You already have an active group in this season.",
      400,
      "VALIDATION_ERROR"
    );
  }

  const groupId = await Group.generateGroupId();
  const group = await Group.create({
    groupId,
    groupName: payload.groupName,
    leader: leader._id,
    members: [leader._id],
    cropFocus: payload.cropFocus,
    cropSeason: payload.cropSeason,
    totalOperationalLand: Number(payload.totalOperationalLand || payload.totalExpectedLand || 0),
    village: payload.village,
    district: payload.district,
    state: payload.state,
    cropPlanning: {
      cropType: payload.cropFocus,
      season: payload.cropSeason,
      timeline: payload.timeline || "",
    },
  });

  leader.role = "leader";
  if (!leader.activeGroups.some((id) => String(id) === String(group._id))) {
    leader.activeGroups.push(group._id);
  }
  leader.groupHistory.push({
    group: group._id,
    groupId: group.groupId,
    groupName: group.groupName,
    status: "active",
  });
  await leader.save();

  return group;
}

async function listGroups({ search, region, crop, season, status }) {
  const query = { status: status || "active" };
  if (crop) query.cropFocus = new RegExp(String(crop), "i");
  if (season) query.cropSeason = new RegExp(String(season), "i");
  if (region) {
    query.$or = [
      { state: new RegExp(String(region), "i") },
      { district: new RegExp(String(region), "i") },
      { village: new RegExp(String(region), "i") },
    ];
  }
  if (search) {
    query.$or = [
      { groupName: new RegExp(String(search), "i") },
      { state: new RegExp(String(search), "i") },
      { district: new RegExp(String(search), "i") },
      { village: new RegExp(String(search), "i") },
      { cropFocus: new RegExp(String(search), "i") },
    ];
  }

  const groups = await Group.find(query).sort({ createdAt: -1 }).limit(200);
  return groups;
}

async function getGroupDetails(groupId) {
  const group = await Group.findOne({ groupId })
    .populate("leader")
    .populate("members")
    .populate("activeBatch");
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  const contributions = await Contribution.find({ group: group._id })
    .populate("farmer")
    .sort({ createdAt: -1 })
    .limit(200);

  const batches = await Batch.find({ group: group._id }).sort({ createdAt: -1 }).limit(50);

  return { group, contributions, batches };
}

async function joinGroup({ auth, groupId, directJoin = false }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  if (group.status !== "active") {
    throw new AppError("Cannot join a non-active group.", 400, "VALIDATION_ERROR");
  }

  const groupSeason = getGroupSeason(group);
  if (await hasActiveSeasonConflict(farmer, groupSeason)) {
    throw new AppError(
      "You already have an active group in this season.",
      400,
      "VALIDATION_ERROR"
    );
  }

  if (!directJoin) {
    const alreadyRequested = (group.joinRequests || []).some(
      (r) => String(r.farmer) === String(farmer._id) && r.status === "pending"
    );
    const alreadyMember = group.members.some((m) => String(m) === String(farmer._id));
    if (!alreadyRequested && !alreadyMember) {
      group.joinRequests.push({ farmer: farmer._id, status: "pending" });
      await group.save();
    }
    return { requested: true };
  }

  const already = group.members.some((m) => String(m) === String(farmer._id));
  if (!already) {
    group.members.push(farmer._id);
    await group.save();
  }

  const alreadyActive = farmer.activeGroups.some((g) => String(g) === String(group._id));
  if (!alreadyActive) farmer.activeGroups.push(group._id);
  farmer.groupHistory.push({
    group: group._id,
    groupId: group.groupId,
    groupName: group.groupName,
    status: "active",
  });
  await farmer.save();

  return { group, farmer };
}

async function getJoinRequests({ auth, groupId }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId }).populate({ path: "joinRequests.farmer" });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  return (group.joinRequests || [])
    .filter((r) => r.status === "pending")
    .map((r) => ({
      id: String(r._id),
      farmerUid: r.farmer?.firebaseUid,
      farmerName: r.farmer?.fullName || "Farmer",
      requestedAt: r.requestedAt,
      status: r.status,
    }));
}

async function decideJoinRequest({ auth, groupId, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  const reqEntry = (group.joinRequests || []).id(payload.requestId);
  if (!reqEntry) throw new AppError("Request not found", 404, "NOT_FOUND");

  const action = payload.action;
  if (!["approved", "rejected"].includes(action)) {
    throw new AppError("Invalid action", 400, "VALIDATION_ERROR");
  }

  reqEntry.status = action;
  await group.save();

  if (action === "approved") {
    const targetFarmer = await Farmer.findById(reqEntry.farmer);
    if (targetFarmer) {
      const groupSeason = getGroupSeason(group);
      if (await hasActiveSeasonConflict(targetFarmer, groupSeason)) {
        throw new AppError(
          "Target farmer already has an active group in this season.",
          400,
          "VALIDATION_ERROR"
        );
      }
      const already = group.members.some((m) => String(m) === String(targetFarmer._id));
      if (!already) {
        group.members.push(targetFarmer._id);
        await group.save();
      }
      const alreadyActive = targetFarmer.activeGroups.some((g) => String(g) === String(group._id));
      if (!alreadyActive) targetFarmer.activeGroups.push(group._id);
      targetFarmer.groupHistory.push({
        group: group._id,
        groupId: group.groupId,
        groupName: group.groupName,
        status: "active",
      });
      await targetFarmer.save();
    }
  }

  return true;
}

async function removeMember({ auth, groupId, memberUid }) {
  const leader = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!leader) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(leader._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  const member = await Farmer.findOne({ firebaseUid: memberUid });
  if (!member) throw new AppError("Member not found", 404, "NOT_FOUND");
  if (String(member._id) === String(group.leader)) {
    throw new AppError("Cannot remove leader", 400, "VALIDATION_ERROR");
  }

  group.members = (group.members || []).filter((m) => String(m) !== String(member._id));
  await group.save();

  member.activeGroups = (member.activeGroups || []).filter((g) => String(g) !== String(group._id));
  await member.save();

  return true;
}

async function leaveGroup({ auth, groupId }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) === String(farmer._id)) {
    throw new AppError(
      "Leaders cannot leave directly. Please transfer leadership or archive the group.",
      400,
      "VALIDATION_ERROR"
    );
  }

  group.members = (group.members || []).filter((m) => String(m) !== String(farmer._id));
  await group.save();

  farmer.activeGroups = (farmer.activeGroups || []).filter((g) => String(g) !== String(group._id));
  const historyItem = (farmer.groupHistory || []).find(
    (entry) => String(entry.group) === String(group._id) && entry.status === "active"
  );
  if (historyItem) {
    historyItem.status = "left";
    historyItem.leftAt = new Date();
  }
  await farmer.save();

  return true;
}

async function archiveGroup({ auth, groupId }) {
  const leader = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!leader) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(leader._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  group.status = "archived";
  await group.save();

  const members = await Farmer.find({ activeGroups: group._id });
  for (const member of members) {
    member.activeGroups = (member.activeGroups || []).filter((g) => String(g) !== String(group._id));
    const historyItem = (member.groupHistory || []).find(
      (entry) => String(entry.group) === String(group._id) && entry.status === "active"
    );
    if (historyItem) {
      historyItem.status = "archived";
      historyItem.leftAt = new Date();
    }
    await member.save();
  }

  return group;
}

async function updateGroup({ auth, groupId, payload }) {
  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  const map = {
    groupName: "groupName",
    state: "state",
    district: "district",
    village: "village",
    cropFocus: "cropFocus",
    cropSeason: "cropSeason",
  };
  for (const [from, to] of Object.entries(map)) {
    if (payload[from] !== undefined) group[to] = payload[from];
  }
  if (payload.totalOperationalLand !== undefined || payload.totalExpectedLand !== undefined) {
    group.totalOperationalLand = Number(payload.totalOperationalLand || payload.totalExpectedLand || 0);
  }

  await group.save();
  return group;
}

async function updateCropPlan({ auth, groupId, payload }) {
  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  group.cropPlanning = {
    cropType: payload.crop || payload.cropType || group.cropPlanning?.cropType,
    season: payload.season || group.cropPlanning?.season,
    timeline: payload.timeline || group.cropPlanning?.timeline,
  };
  await group.save();
  return group;
}

module.exports = {
  createGroup,
  listGroups,
  getGroupDetails,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  removeMember,
  leaveGroup,
  archiveGroup,
  updateGroup,
  updateCropPlan,
};

