const store = require("../models/inMemoryStore");
const { success } = require("../utils/apiResponse");

const leaderDashboard = (req, res) => {
  const group = store.groups.find((g) => g.id === req.params.groupId);
  const contributions = store.contributions.filter((c) => c.groupId === req.params.groupId);
  const batches = store.batches.filter((b) => b.groupId === req.params.groupId);
  const totalLand = contributions.reduce((sum, c) => sum + c.landContribution, 0);

  return success(res, {
    group,
    totalFarmers: group?.members?.length || 0,
    totalOperationalLand: totalLand,
    activeCrop: group?.cropPlan?.crop || "-",
    contributionCount: contributions.length,
    batches,
    irrigationPlan: group?.irrigationPlan || {},
    technologyAccess: group?.technologyAccess || [],
  });
};

const farmerDashboard = (req, res) => {
  const myContributions = store.contributions.filter((c) => c.farmerUid === req.user.uid);
  const myGroups = store.groups.filter((g) => g.members.includes(req.user.uid));
  return success(res, {
    profile: req.user,
    groups: myGroups,
    contributions: myContributions,
  });
};

module.exports = { leaderDashboard, farmerDashboard };
