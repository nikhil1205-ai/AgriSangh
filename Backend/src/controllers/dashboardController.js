const store = require("../models/inMemoryStore");
const { success } = require("../utils/apiResponse");
const { buildGroupAnalytics } = require("../services/groupService");
const { findUserByUid } = require("../models/userModel");

const leaderDashboard = (req, res) => {
  const analytics = buildGroupAnalytics(req.params.groupId);
  const group = analytics.group;

  return success(res, {
    group,
    totalFarmers: group?.memberProfiles?.length || group?.members?.length || 0,
    totalOperationalLand: analytics.totalOperationalLand,
    activeCrop: group?.cropPlan?.crop || "-",
    contributionCount: analytics.contributions.length,
    batches: analytics.batches,
    irrigationPlan: group?.irrigationPlan || {},
    technologyAccess: group?.technologyAccess || [],
    totalProductionEstimate: analytics.totalProductionEstimate,
    participationPercent: analytics.participationPercent,
  });
};

const farmerDashboard = (req, res) => {
  const profile = findUserByUid(req.user.uid) || req.user;
  const myContributions = store.contributions.filter((c) => c.farmerUid === req.user.uid);
  const myGroups = store.groups.filter((g) => g.members.includes(req.user.uid));
  const currentGroups = (profile.groupHistory || []).filter((entry) => entry.status !== "left");
  const previousGroups = (profile.groupHistory || []).filter((entry) => entry.status === "left");
  return success(res, {
    profile,
    groups: myGroups,
    contributions: myContributions,
    currentGroups,
    previousGroups,
    contributionHistory: profile.contributionHistory || [],
  });
};

module.exports = { leaderDashboard, farmerDashboard };
