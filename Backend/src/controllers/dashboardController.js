const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const Batch = require("../models/batchModel");
const { ok } = require("../utils/apiResponse");
const { AppError } = require("../utils/errors");

async function farmerDashboard(req, res, next) {
  try {
    const farmer = await Farmer.findOne({ firebaseUid: req.auth.firebaseUid })
      .populate("activeGroups")
      .populate({ path: "contributionHistory", populate: [{ path: "group" }] });
    if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

    const currentGroups = (farmer.groupHistory || [])
      .filter((g) => g.status === "active")
      .map((g) => ({
        groupId: g.groupId,
        groupName: g.groupName,
        joinedAt: g.joinedAt,
        status: g.status,
      }));

    const contributionHistory = (farmer.contributionHistory || []).map((c) => ({
      groupId: c.group?.groupId,
      landContribution: c.landContribution,
      participationPercent: c.participationPercentage,
      estimatedProduction: c.estimatedYield,
      createdAt: c.createdAt,
    }));

    return ok(res, {
      profile: farmer,
      groups: (farmer.activeGroups || []).map((g) => ({
        id: g.groupId,
        name: g.groupName,
        status: g.status,
        cropSeason: g.cropSeason,
        cropFocus: g.cropFocus,
      })),
      contributions: contributionHistory.slice(0, 20),
      currentGroups,
      previousGroups: [],
      contributionHistory,
    });
  } catch (err) {
    return next(err);
  }
}

async function leaderDashboard(req, res, next) {
  try {
    const group = await Group.findOne({ groupId: req.params.groupId }).populate("members");
    if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

    const leader = await Farmer.findOne({ firebaseUid: req.auth.firebaseUid });
    if (!leader) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");
    if (String(group.leader) !== String(leader._id)) {
      throw new AppError("Leader-only action", 403, "FORBIDDEN");
    }

    const batches = await Batch.find({ group: group._id }).sort({ createdAt: -1 }).limit(20);
    const contributions = await Contribution.find({ group: group._id });
    const totalOperationalLand = contributions.reduce((sum, c) => sum + Number(c.landContribution || 0), 0);

    return ok(res, {
      totalFarmers: group.members.length,
      totalOperationalLand,
      activeCrop: group.cropPlanning?.cropType || group.cropFocus || "-",
      batches: batches.map((b) => ({
        id: b._id,
        batchId: b.batchId,
        cropType: b.cropType,
        authenticity: "Verified",
      })),
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { farmerDashboard, leaderDashboard };

