const { v4: uuidv4 } = require("uuid");
const { firestore } = require("../config/firebaseAdmin");
const store = require("../models/inMemoryStore");
const { success, error } = require("../utils/apiResponse");

const createGroup = async (req, res) => {
  try {
    const { name, region, cropFocus } = req.body;
    if (!name || !region || !cropFocus) {
      return error(res, "name, region and cropFocus are required", 400);
    }

    const group = {
      id: uuidv4(),
      name,
      region,
      cropFocus,
      leaderUid: req.user.uid,
      members: [req.user.uid],
      cropPlan: { crop: cropFocus, season: "Kharif" },
      irrigationPlan: { schedule: "Mon/Wed/Fri", reminder: "6:00 AM" },
      technologyAccess: ["Drone Spraying", "Soil Testing"],
      createdAt: new Date().toISOString(),
    };

    store.groups.push(group);
    return success(res, group, "Group created", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const listGroups = async (_req, res) => success(res, store.groups, "Groups fetched");

const joinGroup = async (req, res) => {
  try {
    const { groupId } = req.body;
    const group = store.groups.find((g) => g.id === groupId);
    if (!group) return error(res, "Group not found", 404);

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
      const group = store.groups.find((g) => g.id === request.groupId);
      if (group && !group.members.includes(request.farmerUid)) {
        group.members.push(request.farmerUid);
      }
    }

    return success(res, request, `Request ${action}`);
  } catch (e) {
    return error(res, e.message);
  }
};

const updateCropPlan = async (req, res) => {
  const group = store.groups.find((g) => g.id === req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.cropPlan = {
    crop: req.body.crop || group.cropPlan.crop,
    season: req.body.season || group.cropPlan.season,
  };
  return success(res, group, "Crop plan updated");
};

const updateIrrigation = async (req, res) => {
  const group = store.groups.find((g) => g.id === req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.irrigationPlan = {
    schedule: req.body.schedule || group.irrigationPlan.schedule,
    reminder: req.body.reminder || group.irrigationPlan.reminder,
  };
  return success(res, group, "Irrigation plan updated");
};

const updateTechnologyAccess = async (req, res) => {
  const group = store.groups.find((g) => g.id === req.params.groupId);
  if (!group) return error(res, "Group not found", 404);
  group.technologyAccess = req.body.items || group.technologyAccess;
  return success(res, group, "Technology access updated");
};

module.exports = {
  createGroup,
  listGroups,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  updateCropPlan,
  updateIrrigation,
  updateTechnologyAccess,
};
