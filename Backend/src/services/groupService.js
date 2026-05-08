const store = require("../models/inMemoryStore");

const buildGroupAnalytics = (groupId) => {
  const group = store.groups.find((entry) => entry.id === groupId);
  const contributions = store.contributions.filter((entry) => entry.groupId === groupId);
  const batches = store.batches.filter((entry) => entry.groupId === groupId);

  const totalOperationalLand = contributions.reduce(
    (sum, contribution) => sum + Number(contribution.landContribution || 0),
    0
  );
  const totalProductionEstimate = contributions.reduce(
    (sum, contribution) => sum + Number(contribution.estimatedProduction || 0),
    0
  );
  const averageParticipation =
    contributions.length === 0
      ? 0
      : contributions.reduce((sum, contribution) => sum + Number(contribution.participationPercent || 0), 0) /
        contributions.length;

  return {
    group,
    batches,
    contributions,
    totalOperationalLand,
    totalProductionEstimate,
    participationPercent: Number(averageParticipation.toFixed(1)),
  };
};

module.exports = { buildGroupAnalytics };
