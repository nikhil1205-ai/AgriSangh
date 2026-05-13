const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const Batch = require("../models/batchModel");
const { AppError } = require("../utils/errors");
const {
  calculateTotalLand,
  calculateParticipationPercentages,
  validateLandContributions,
  validateEstimatedCropSize,
} = require("../utils/groupHelpers");

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

/**
 * Create a new group and automatically create corresponding Contribution
 */
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

  // Validate estimated crop size if provided
  if (payload.estimatedCropSize !== undefined) {
    const cropValidation = validateEstimatedCropSize(payload.estimatedCropSize);
    if (!cropValidation.valid) {
      throw new AppError(cropValidation.error, 400, "VALIDATION_ERROR");
    }
  }

  const groupId = await Group.generateGroupId();
  const contributionId = await Contribution.generateContributionId();

  const group = await Group.create({
    groupId,
    groupName: payload.groupName,
    leader: leader._id,
    members: [leader._id],
    cropFocus: payload.cropFocus,
    cropSeason: payload.cropSeason,
    estimatedCropSize: Number(payload.estimatedCropSize || 0),
    contributionId: contributionId,
    village: payload.village,
    district: payload.district,
    state: payload.state,
    cropPlanning: {
      cropType: payload.cropFocus,
      season: payload.cropSeason,
      timeline: payload.timeline || "",
    },
  });

  // Create corresponding Contribution with leader's land
  const leaderLandSize = Number(payload.leaderLandSize || payload.totalExpectedLand || 0);

  const landContribution = [
    {
      farmer: leader._id,
      farmerId: leader.farmerId,
      landSize: leaderLandSize,
    },
  ];

  const contribution = await Contribution.create({
    contributionId,
    group: group._id,
    landContribution: calculateParticipationPercentages(landContribution),
    season: payload.cropSeason,
  });

  // Update group analytics
  group.analytics = group.analytics || {};
  group.analytics.totalContributedLand = leaderLandSize;
  await group.save();

  // Update leader profile
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
    .populate("landContribution.farmer")
    .sort({ createdAt: -1 })
    .limit(200);

  const batches = await Batch.find({ group: group._id }).sort({ createdAt: -1 }).limit(50);

  return { group, contributions, batches };
}

/**
 * Join group and automatically update Contribution
 */
async function joinGroup({ auth, groupId, directJoin = false, landSize = 0 }) {
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
    // Add farmer to group
    group.members.push(farmer._id);

    // Update Contribution - add new farmer and recalculate all percentages
    if (group.contributionId) {
      const contribution = await Contribution.findOne({ contributionId: group.contributionId });

      if (contribution) {
        // Check if farmer already in contribution
        const farmerExists = contribution.landContribution.some(
          (c) => String(c.farmer) === String(farmer._id)
        );

        if (!farmerExists) {
          // Add new farmer's land contribution
          const newLandEntry = {
            farmer: farmer._id,
            farmerId: farmer.farmerId,
            landSize: Number(landSize || 0),
          };

          contribution.landContribution.push(newLandEntry);

          // Recalculate total land and all participation percentages
          const totalLand = calculateTotalLand(contribution.landContribution);
          contribution.totalLand = totalLand;

          if (totalLand > 0) {
            // Recalculate all participation percentages
            contribution.landContribution = calculateParticipationPercentages(
              contribution.landContribution
            );
          }

          await contribution.save();
        }
      }
    }

    // Update group analytics
    group.analytics = group.analytics || {};
    group.analytics.totalContributedLand = Number(group.analytics.totalContributedLand || 0) + Number(landSize || 0);

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

  const reqEntry = (group.joinRequests || []).find((r) => String(r._id) === String(payload.requestId));
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

      const landSize = Number(payload.landSize || 0);

      const already = group.members.some((m) => String(m) === String(targetFarmer._id));
      if (!already) {
        group.members.push(targetFarmer._id);

        // Update Contribution
        if (group.contributionId) {
          const contribution = await Contribution.findOne({ contributionId: group.contributionId });

          if (contribution) {
            const farmerExists = contribution.landContribution.some(
              (c) => String(c.farmer) === String(targetFarmer._id)
            );

            if (!farmerExists) {
              const newLandEntry = {
                farmer: targetFarmer._id,
                farmerId: targetFarmer.farmerId,
                landSize: landSize,
              };

              contribution.landContribution.push(newLandEntry);

              const totalLand = calculateTotalLand(contribution.landContribution);
              contribution.totalLand = totalLand;

              if (totalLand > 0) {
                contribution.landContribution = calculateParticipationPercentages(
                  contribution.landContribution
                );
              }

              await contribution.save();
            }
          }
        }

        // Update group analytics
        group.analytics = group.analytics || {};
        group.analytics.totalContributedLand = Number(group.analytics.totalContributedLand || 0) + landSize;

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

  // Remove from group
  group.members = (group.members || []).filter((m) => String(m) !== String(member._id));

  // Update Contribution - remove member and recalculate percentages
  if (group.contributionId) {
    const contribution = await Contribution.findOne({ contributionId: group.contributionId });

    if (contribution) {
      // Find and remove the member's land contribution
      const memberContribution = contribution.landContribution.find(
        (c) => String(c.farmer) === String(member._id)
      );
      const removedLandSize = memberContribution ? memberContribution.landSize : 0;

      contribution.landContribution = contribution.landContribution.filter(
        (c) => String(c.farmer) !== String(member._id)
      );

      // Recalculate total land and percentages
      const totalLand = calculateTotalLand(contribution.landContribution);
      contribution.totalLand = totalLand;

      if (totalLand > 0) {
        contribution.landContribution = calculateParticipationPercentages(
          contribution.landContribution
        );
      } else {
        contribution.landContribution = [];
      }

      await contribution.save();

      // Update group analytics
      group.analytics = group.analytics || {};
      group.analytics.totalContributedLand = Math.max(
        0,
        Number(group.analytics.totalContributedLand || 0) - removedLandSize
      );
    }
  }

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

  // Find member's contribution before removing
  let memberContribution = null;
  if (group.contributionId) {
    const contribution = await Contribution.findOne({ contributionId: group.contributionId });
    if (contribution) {
      memberContribution = contribution.landContribution.find(
        (c) => String(c.farmer) === String(farmer._id)
      );
    }
  }

  const removedLandSize = memberContribution ? memberContribution.landSize : 0;

  // Remove from group
  group.members = (group.members || []).filter((m) => String(m) !== String(farmer._id));

  // Update Contribution
  if (group.contributionId) {
    const contribution = await Contribution.findOne({ contributionId: group.contributionId });

    if (contribution) {
      contribution.landContribution = contribution.landContribution.filter(
        (c) => String(c.farmer) !== String(farmer._id)
      );

      const totalLand = calculateTotalLand(contribution.landContribution);
      contribution.totalLand = totalLand;

      if (totalLand > 0) {
        contribution.landContribution = calculateParticipationPercentages(
          contribution.landContribution
        );
      } else {
        contribution.landContribution = [];
      }

      await contribution.save();

      // Update group analytics
      group.analytics = group.analytics || {};
      group.analytics.totalContributedLand = Math.max(
        0,
        Number(group.analytics.totalContributedLand || 0) - removedLandSize
      );
    }
  }

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

  // Handle estimatedCropSize instead of totalOperationalLand
  if (payload.estimatedCropSize !== undefined) {
    const cropValidation = validateEstimatedCropSize(payload.estimatedCropSize);
    if (!cropValidation.valid) {
      throw new AppError(cropValidation.error, 400, "VALIDATION_ERROR");
    }
    group.estimatedCropSize = Number(payload.estimatedCropSize || 0);
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

