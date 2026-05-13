const { ok } = require("../utils/apiResponse");
const {
  createGroup,
  listGroups,
  getGroupDetails,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  removeMember,
  leaveGroup: leaveGroupService,
  archiveGroup: archiveGroupService,
  updateGroup,
  updateCropPlan,
} = require("../services/groupService");

function toGroupCard(group) {
  return {
    id: group.groupId,
    groupId: group.groupId,
    name: group.groupName,
    groupName: group.groupName,
    cropFocus: group.cropFocus,
    cropSeason: group.cropSeason,
    status: group.status,
    estimatedCropSize: group.estimatedCropSize,
    contributionId: group.contributionId,
    totalExpectedLand: group.estimatedCropSize,
    location: { state: group.state, district: group.district, village: group.village },
    cropPlan: {
      season: group.cropSeason || group.cropPlanning?.season,
      crop: group.cropFocus || group.cropPlanning?.cropType,
      timeline: group.cropPlanning?.timeline,
    },
    state: group.state,
    district: group.district,
    village: group.village,
    createdAt: group.createdAt,
  };
}

async function create(req, res, next) {
  try {
    const group = await createGroup({ auth: req.auth, payload: req.body });
    return ok(res, toGroupCard(group), "Group created");
  } catch (err) {
    return next(err);
  }
}

async function list(req, res, next) {
  try {
    const groups = await listGroups(req.query || {});
    return ok(res, groups.map(toGroupCard));
  } catch (err) {
    return next(err);
  }
}

async function search(req, res, next) {
  try {
    const groups = await listGroups(req.query || {});
    return ok(res, groups.map(toGroupCard));
  } catch (err) {
    return next(err);
  }
}

async function details(req, res, next) {
  try {
    const { group, contributions, batches } = await getGroupDetails(req.params.groupId);
    const memberProfiles = (group.members || []).map((m) => ({
      uid: m.firebaseUid,
      farmerId: m.farmerId,
      name: m.fullName,
      role: m.role,
    }));

    return ok(res, {
      group: {
        ...toGroupCard(group),
        status: group.status,
        leader: group.leader
          ? {
              uid: group.leader.firebaseUid,
              farmerId: group.leader.farmerId,
              name: group.leader.fullName,
              email: group.leader.email,
            }
          : null,
        members: memberProfiles,
        memberProfiles,
        cropPlan: group.cropPlanning
          ? {
              crop: group.cropPlanning.cropType,
              season: group.cropPlanning.season,
              timeline: group.cropPlanning.timeline,
            }
          : null,
        irrigationPlan: group.irrigationPlanning || null,
        technologyAccess: group.technologyAccess || [],
        contributionId: group.contributionId,
        estimatedCropSize: group.estimatedCropSize,
      },
      contributions: (contributions || []).map((c) => ({
        id: c.contributionId,
        contributionId: c.contributionId,
        totalLand: c.totalLand,
        landContribution: c.landContribution,
        season: c.season,
        createdAt: c.createdAt,
      })),
      batches: (batches || []).map((b) => ({
        id: b._id,
        batchId: b.batchId,
        cropType: b.cropType,
        season: b.season,
        estimatedProduction: b.estimatedProduction,
        status: b.status,
        authenticity: "Verified",
        createdAt: b.createdAt,
      })),
    });
  } catch (err) {
    return next(err);
  }
}

async function join(req, res, next) {
  try {
    const result = await joinGroup({
      auth: req.auth,
      groupId: req.body.groupId,
      directJoin: Boolean(req.body.directJoin),
    });
    return ok(res, result, "Joined group");
  } catch (err) {
    return next(err);
  }
}

async function patchGroup(req, res, next) {
  try {
    const group = await updateGroup({ auth: req.auth, groupId: req.params.groupId, payload: req.body });
    return ok(res, group, "Group updated");
  } catch (err) {
    return next(err);
  }
}

async function patchCropPlan(req, res, next) {
  try {
    const group = await updateCropPlan({ auth: req.auth, groupId: req.params.groupId, payload: req.body });
    return ok(res, group, "Crop plan updated");
  } catch (err) {
    return next(err);
  }
}

async function getRequests(req, res, next) {
  try {
    const requests = await getJoinRequests({ auth: req.auth, groupId: req.params.groupId });
    return ok(res, requests);
  } catch (err) {
    return next(err);
  }
}

async function decideRequest(req, res, next) {
  try {
    await decideJoinRequest({ auth: req.auth, groupId: req.params.groupId, payload: req.body });
    return ok(res, true, "Decision saved");
  } catch (err) {
    return next(err);
  }
}

async function deleteMember(req, res, next) {
  try {
    await removeMember({
      auth: req.auth,
      groupId: req.params.groupId,
      memberUid: req.params.memberUid,
    });
    return ok(res, true, "Member removed");
  } catch (err) {
    return next(err);
  }
}

async function leaveGroup(req, res, next) {
  try {
    await leaveGroupService({ auth: req.auth, groupId: req.params.groupId });
    return ok(res, true, "Left group successfully");
  } catch (err) {
    return next(err);
  }
}

async function archiveGroup(req, res, next) {
  try {
    const group = await archiveGroupService({ auth: req.auth, groupId: req.params.groupId });
    return ok(res, group, "Group archived");
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  list,
  search,
  details,
  join,
  getRequests,
  decideRequest,
  deleteMember,
  leaveGroup,
  archiveGroup,
  patchGroup,
  patchCropPlan,
};