const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const { AppError } = require("../utils/errors");

async function addContribution({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  const isMember = group.members.some((m) => String(m) === String(farmer._id));
  if (!isMember) throw new AppError("You are not a member of this group", 403, "FORBIDDEN");

  const landContribution = Number(payload.landContribution || 0);
  const participationPercentage = Number(payload.participationPercent ?? payload.participationPercentage ?? 0);
  if (!landContribution || landContribution < 0) {
    throw new AppError("Invalid landContribution", 400, "VALIDATION_ERROR");
  }
  if (participationPercentage < 0 || participationPercentage > 100) {
    throw new AppError("Invalid participationPercentage", 400, "VALIDATION_ERROR");
  }

  const contributionId = await Contribution.generateContributionId();
  const created = await Contribution.create({
    contributionId,
    farmer: farmer._id,
    group: group._id,
    landContribution,
    estimatedYield: Number(payload.estimatedYield || payload.estimatedProduction || 0),
    participationPercentage,
    season: payload.season || group.cropSeason,
  });

  farmer.contributionHistory.push(created._id);
  await farmer.save();

  group.analytics.totalContributedLand =
    Number(group.analytics?.totalContributedLand || 0) + Number(created.landContribution || 0);
  await group.save();

  return created;
}

async function getGroupContributions({ groupId }) {
  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");

  const items = await Contribution.find({ group: group._id })
    .populate("farmer")
    .sort({ createdAt: -1 })
    .limit(300);
  return items;
}

module.exports = { addContribution, getGroupContributions };

