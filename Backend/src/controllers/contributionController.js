const { v4: uuidv4 } = require("uuid");
const store = require("../models/inMemoryStore");
const { success, error } = require("../utils/apiResponse");
const { addContributionHistory } = require("../models/userModel");

const addContribution = (req, res) => {
  try {
    const { groupId, landContribution, participationPercent, estimatedProduction } = req.body;
    const contribution = {
      id: uuidv4(),
      groupId,
      farmerUid: req.user.uid,
      farmerName: req.user.fullName,
      landContribution: Number(landContribution || 0),
      participationPercent: Number(participationPercent || 0),
      estimatedProduction: Number(estimatedProduction || 0),
      createdAt: new Date().toISOString(),
    };
    store.contributions.push(contribution);
    addContributionHistory(req.user.uid, {
      groupId,
      landContribution: contribution.landContribution,
      participationPercent: contribution.participationPercent,
      estimatedProduction: contribution.estimatedProduction,
      contributedAt: contribution.createdAt,
    });
    return success(res, contribution, "Contribution added", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const listContributions = (req, res) => {
  const contributions = store.contributions.filter((c) => c.groupId === req.params.groupId);
  return success(res, contributions, "Contributions fetched");
};

module.exports = { addContribution, listContributions };
