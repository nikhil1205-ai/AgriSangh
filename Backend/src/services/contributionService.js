const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const { AppError } = require("../utils/errors");
const {
  calculateTotalLand,
  calculateParticipationPercentages,
  validateLandContributions,
  validateEstimatedCropSize,
} = require("../utils/contributionHelpers");

/**
 * Add a new group contribution with multiple farmer contributions
 * @param {Object} params - { auth, payload }
 * @returns {Object} Created contribution
 */
async function addContribution({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) {
    throw new AppError("Farmer profile not found", 404, "NOT_FOUND");
  }

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  // Validate land contributions array
  const landContributions = payload.landContribution || [];
  const validation = validateLandContributions(landContributions);
  if (!validation.valid) {
    throw new AppError(validation.errors.join(", "), 400, "VALIDATION_ERROR");
  }

  // Validate estimated crop size if provided
  if (payload.estimatedCropSize !== undefined) {
    const cropValidation = validateEstimatedCropSize(payload.estimatedCropSize);
    if (!cropValidation.valid) {
      throw new AppError(cropValidation.error, 400, "VALIDATION_ERROR");
    }
  }

  // Convert land contributions to proper format with ObjectIds
  const formattedLandContributions = landContributions.map((contrib) => {
    const contributingFarmer = contrib.farmer || contrib.farmerId;
    // If farmerId provided, find the farmer document
    if (!contrib.farmer && contrib.farmerId) {
      return {
        farmer: null, // Will be populated after validation
        farmerId: contrib.farmerId,
        landSize: Number(contrib.landSize),
      };
    }
    return {
      farmer: contrib.farmer,
      farmerId: contrib.farmerId,
      landSize: Number(contrib.landSize),
    };
  });

  // Validate that all farmers are members of the group
  for (const contrib of formattedLandContributions) {
    if (contrib.farmer) {
      const isMember = group.members.some(
        (m) => String(m) === String(contrib.farmer)
      );
      if (!isMember) {
        throw new AppError(
          `Farmer ${contrib.farmerId} is not a member of this group`,
          403,
          "FORBIDDEN"
        );
      }
    }
  }

  // Calculate total land
  const totalLand = calculateTotalLand(formattedLandContributions);
  if (totalLand <= 0) {
    throw new AppError("Total land must be greater than 0", 400, "VALIDATION_ERROR");
  }

  // Calculate participation percentages using the formula: (farmer_land / total_group_land) * 100
  const participationPercentages = calculateParticipationPercentages(formattedLandContributions);

  // Generate contribution ID
  const contributionId = await Contribution.generateContributionId();

  // Create contribution
  const created = await Contribution.create({
    contributionId,
    group: group._id,
    landContribution: formattedLandContributions,
    estimatedCropSize: Number(payload.estimatedCropSize || 0),
    participationPercentage: participationPercentages,
    season: payload.season || group.cropSeason,
  });

  // Update group analytics
  group.analytics = group.analytics || {};
  group.analytics.totalContributedLand =
    Number(group.analytics?.totalContributedLand || 0) + totalLand;
  group.totalOperationalLand =
    Number(group.totalOperationalLand || 0) + totalLand;
  await group.save();

  return created;
}

/**
 * Update an existing contribution
 * @param {Object} params - { contributionId, payload }
 * @returns {Object} Updated contribution
 */
async function updateContribution({ contributionId, payload }) {
  const contribution = await Contribution.findOne({ contributionId });
  if (!contribution) {
    throw new AppError("Contribution not found", 404, "NOT_FOUND");
  }

  // Validate and update land contributions if provided
  if (payload.landContribution) {
    const validation = validateLandContributions(payload.landContribution);
    if (!validation.valid) {
      throw new AppError(validation.errors.join(", "), 400, "VALIDATION_ERROR");
    }

    contribution.landContribution = payload.landContribution;

    // Recalculate participation percentages
    const totalLand = calculateTotalLand(payload.landContribution);
    if (totalLand > 0) {
      contribution.participationPercentage = calculateParticipationPercentages(
        payload.landContribution
      );
    }
  }

  // Update estimated crop size if provided
  if (payload.estimatedCropSize !== undefined) {
    const cropValidation = validateEstimatedCropSize(payload.estimatedCropSize);
    if (!cropValidation.valid) {
      throw new AppError(cropValidation.error, 400, "VALIDATION_ERROR");
    }
    contribution.estimatedCropSize = Number(payload.estimatedCropSize);
  }

  // Update season if provided
  if (payload.season) {
    contribution.season = payload.season;
  }

  await contribution.save();
  return contribution;
}

/**
 * Get all contributions for a group
 * @param {Object} params - { groupId }
 * @returns {Array} List of contributions
 */
async function getGroupContributions({ groupId }) {
  const group = await Group.findOne({ groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  const items = await Contribution.find({ group: group._id })
    .populate("landContribution.farmer")
    .populate("participationPercentage.farmer")
    .sort({ createdAt: -1 })
    .limit(300);

  return items;
}

/**
 * Get a single contribution by ID
 * @param {Object} params - { contributionId }
 * @returns {Object} Contribution
 */
async function getContributionById({ contributionId }) {
  const contribution = await Contribution.findOne({ contributionId })
    .populate("landContribution.farmer")
    .populate("participationPercentage.farmer")
    .populate("group");

  if (!contribution) {
    throw new AppError("Contribution not found", 404, "NOT_FOUND");
  }

  return contribution;
}

/**
 * Delete a contribution
 * @param {Object} params - { contributionId }
 * @returns {Object} Deletion result
 */
async function deleteContribution({ contributionId }) {
  const contribution = await Contribution.findOne({ contributionId });
  if (!contribution) {
    throw new AppError("Contribution not found", 404, "NOT_FOUND");
  }

  // Update group analytics
  const totalLand = calculateTotalLand(contribution.landContribution);
  const group = await Group.findById(contribution.group);
  if (group) {
    group.analytics = group.analytics || {};
    group.analytics.totalContributedLand = Math.max(
      0,
      Number(group.analytics?.totalContributedLand || 0) - totalLand
    );
    group.totalOperationalLand = Math.max(
      0,
      Number(group.totalOperationalLand || 0) - totalLand
    );
    await group.save();
  }

  await contribution.deleteOne();
  return { deleted: true, contributionId };
}

module.exports = {
  addContribution,
  updateContribution,
  getGroupContributions,
  getContributionById,
  deleteContribution,
  calculateTotalLand,
  calculateParticipationPercentages,
};