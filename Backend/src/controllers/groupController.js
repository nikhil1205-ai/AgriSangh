const { v4: uuidv4 } = require("uuid");
const store = require("../models/inMemoryStore");
const { success, error } = require("../utils/apiResponse");
const { findGroupById, listGroups, saveGroup } = require("../models/groupModel");
const { addGroupHistory, findUserByUid, upsertUser } = require("../models/userModel");

const createGroup = async (req, res) => {
  try {
    const {
      groupName,
      state,
      district,
      village,
      cropFocus,
      cropSeason,
      totalExpectedLand,
      description,
    } = req.body;
    if (!groupName || !state || !district || !village || !cropFocus || !cropSeason) {
      return error(res, "groupName, state, district, village, cropFocus and cropSeason are required", 400);
    }

    const group = {
      id: uuidv4(),
      name: groupName,
      location: { state, district, village },
      cropFocus,
      leaderUid: req.user.uid,
      members: [req.user.uid],
      memberProfiles: [{ uid: req.user.uid, role: "leader", name: req.user.fullName }],
      status: "active",
      createdAt: new Date().toISOString(),
      about: description || "",
      totalExpectedLand: Number(totalExpectedLand || 0),
      cropPlan: { crop: cropFocus, season: cropSeason, timeline: "Sowing to Harvest: 120 days" },
      irrigationPlan: { schedule: "Mon/Wed/Fri", reminder: "6:00 AM" },
      technologyAccess: ["Drone Spraying", "Soil Testing", "Equipment Sharing"],
      revenueSplit: [],
    };

    saveGroup(group);
    const user = findUserByUid(req.user.uid) || req.user;
    upsertUser({
      ...user,
      role: "leader",
      groupId: group.id,
      updatedAt: new Date().toISOString(),
    });
    addGroupHistory(req.user.uid, {
      groupId: group.id,
      groupName: group.name,
      joinedAt: new Date().toISOString(),
      status: "leader",
    });
    return success(res, group, "Group created and role upgraded to leader", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const discoverGroups = async (req, res) => {
  const search = (req.query.search || "").toLowerCase();
  const region = (req.query.region || "").toLowerCase();
  const crop = (req.query.crop || "").toLowerCase();
  const season = (req.query.season || "").toLowerCase();

  const filtered = listGroups().filter((group) => {
    const groupRegion = `${group.location?.state || ""} ${group.location?.district || ""} ${group.location?.village || ""}`.toLowerCase();
    const nameMatch = group.name.toLowerCase().includes(search);
    const regionMatch = region ? groupRegion.includes(region) : true;
    const cropMatch = crop ? (group.cropFocus || "").toLowerCase().includes(crop) : true;
    const seasonMatch = season
      ? (group.cropPlan?.season || "").toLowerCase().includes(season)
      : true;
    return (search ? nameMatch || groupRegion.includes(search) : true) && regionMatch && cropMatch && seasonMatch;
  });

  const groups = filtered.map((group) => {
    const leader = findUserByUid(group.leaderUid);
    return {
      ...group,
      leaderName: leader?.fullName || "Leader",
      totalMembers: group.members.length,
      totalLand: Number(group.totalExpectedLand || 0),
    };
  });
  return success(res, groups, "Groups fetched");
};

const getGroupById = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  const contributions = store.contributions.filter((item) => item.groupId === group.id);
  const batches = store.batches.filter((item) => item.groupId === group.id);
  return success(res, { group, contributions, batches }, "Group room loaded");
};

const joinGroup = async (req, res) => {
  try {
    const { groupId, directJoin } = req.body;
    const group = findGroupById(groupId);
    if (!group) return error(res, "Group not found", 404);

    if (directJoin) {
      if (!group.members.includes(req.user.uid)) {
        group.members.push(req.user.uid);
        group.memberProfiles.push({ uid: req.user.uid, role: "farmer", name: req.user.fullName });
      }
      addGroupHistory(req.user.uid, {
        groupId,
        groupName: group.name,
        joinedAt: new Date().toISOString(),
        status: "active",
      });
      return success(res, group, "Joined group successfully", 201);
    }

    const request = {
      id: uuidv4(),
      groupId,
      farmerUid: req.user.uid,
      farmerName: req.user.fullName,
      status: "pending",
      createdAt: new Date().toISOString(),
    };
    store.joinRequests.push(request);
    return success(res, request, "Join request submitted", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const getJoinRequests = async (req, res) => {
  const requests = store.joinRequests.filter(
    (r) => r.groupId === req.params.groupId && r.status === "pending"
  );
  return success(res, requests, "Join requests fetched");
};

const decideJoinRequest = async (req, res) => {
  try {
    const { requestId, action } = req.body;
    const request = store.joinRequests.find((r) => r.id === requestId);
    if (!request) return error(res, "Request not found", 404);
    request.status = action;

    if (action === "approved") {
      const group = findGroupById(request.groupId);
      if (group && !group.members.includes(request.farmerUid)) {
        group.members.push(request.farmerUid);
        group.memberProfiles.push({ uid: request.farmerUid, role: "farmer", name: request.farmerName });
      }
      addGroupHistory(request.farmerUid, {
        groupId: request.groupId,
        groupName: group?.name || "Group",
        joinedAt: new Date().toISOString(),
        status: "active",
      });
    }

    return success(res, request, `Request ${action}`);
  } catch (e) {
    return error(res, e.message);
  }
};

const updateCropPlan = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.cropPlan = {
    crop: req.body.crop || group.cropPlan.crop,
    season: req.body.season || group.cropPlan.season,
    timeline: req.body.timeline || group.cropPlan.timeline,
  };
  return success(res, group, "Crop plan updated");
};

const updateIrrigation = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.irrigationPlan = {
    schedule: req.body.schedule || group.irrigationPlan.schedule,
    reminder: req.body.reminder || group.irrigationPlan.reminder,
  };
  return success(res, group, "Irrigation plan updated");
};

const updateTechnologyAccess = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.technologyAccess = req.body.items || group.technologyAccess;
  return success(res, group, "Technology access updated");
};

const updateGroup = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);

  group.name = req.body.groupName || group.name;
  group.about = req.body.description || group.about;
  group.totalExpectedLand = Number(req.body.totalExpectedLand || group.totalExpectedLand || 0);
  group.location = {
    state: req.body.state || group.location.state,
    district: req.body.district || group.location.district,
    village: req.body.village || group.location.village,
  };
  return success(res, group, "Group updated");
};

const removeMember = async (req, res) => {
  const group = findGroupById(req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.members = group.members.filter((memberUid) => memberUid !== req.params.memberUid);
  group.memberProfiles = group.memberProfiles.filter((member) => member.uid !== req.params.memberUid);
  return success(res, group, "Member removed");
};

module.exports = {
  createGroup,
  discoverGroups,
  getGroupById,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  updateCropPlan,
  updateIrrigation,
  updateTechnologyAccess,
  updateGroup,
  removeMember,
};
