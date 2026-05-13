const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Contribution = require("../models/contributionModel");
const Revenue = require("../models/revenueModel");
const { AppError } = require("../utils/errors");
const {
  calculateRevenueDistribution,
  calculateRevenuePercentages,
  validateRevenueDistribution,
  validateTotalRevenue,
} = require("../utils/contributionHelpers");

/**
 * Calculate and create revenue distribution for a group
 * Uses participation percentages from contributions to distribute revenue
 * @param {Object} params - { auth, payload }
 * @returns {Object} Created revenue record
 */
async function calculateRevenueSplit({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) {
    throw new AppError("Farmer profile not found", 404, "NOT_FOUND");
  }

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  // Only group leader can create revenue distribution
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Only group leader can create revenue distribution", 403, "FORBIDDEN");
  }

  // Validate total revenue
  const revenueValidation = validateTotalRevenue(payload.totalRevenue);
  if (!revenueValidation.valid) {
    throw new AppError(revenueValidation.error, 400, "VALIDATION_ERROR");
  }

  const totalRevenue = Number(payload.totalRevenue);

  // Get all contributions for the group
  const contributions = await Contribution.find({ group: group._id })
    .populate("landContribution.farmer")
    .populate("participationPercentage.farmer");

  if (!contributions.length) {
    throw new AppError("No contributions found for group", 400, "VALIDATION_ERROR");
  }

  // Extract participation percentages from contributions
  // Build a map of farmer to their participation percentage
  const participationMap = new Map();

  for (const contrib of contributions) {
    if (contrib.participationPercentage && contrib.participationPercentage.length > 0) {
      for (const pct of contrib.participationPercentage) {
        const farmerId = pct.farmerId || (pct.farmer?.farmerId);
        if (farmerId) {
          // Aggregate percentages if farmer appears in multiple contributions
          const existing = participationMap.get(farmerId) || 0;
          participationMap.set(farmerId, existing + Number(pct.percentage || 0));
        }
      }
    }
  }

  if (participationMap.size === 0) {
    throw new AppError("No participation percentages found in contributions", 400, "VALIDATION_ERROR");
  }

  // Normalize percentages to ensure they total 100%
  let totalPct = 0;
  const normalizedPercentages = [];

  for (const [farmerId, percentage] of participationMap) {
    totalPct += percentage;
  }

  if (totalPct === 0) {
    throw new AppError("Total participation percentage is 0", 400, "VALIDATION_ERROR");
  }

  // Normalize and build distribution array
  const distribution = [];
  const percentageArray = [];

  for (const [farmerId, percentage] of participationMap) {
    // Find the farmer document
    const farmerDoc = await Farmer.findOne({ farmerId });

    const normalizedPct = (percentage / totalPct) * 100;
    const amountInQuintal = (normalizedPct / 100) * totalRevenue;

    distribution.push({
      farmer: farmerDoc?._id || null,
      farmerId,
      amountInQuintal: Number(amountInQuintal.toFixed(2)),
    });

    percentageArray.push({
      farmer: farmerDoc?._id || null,
      farmerId,
      percentage: Number(normalizedPct.toFixed(2)),
    });
  }

  // Generate revenue ID
  const revenueId = await Revenue.generateRevenueId();

  // Create revenue record
  const revenue = await Revenue.create({
    revenueId,
    group: group._id,
    totalRevenue,
    distribution,
    percentage: percentageArray,
  });

  // Update group with revenue information
  group.revenue = group.revenue || {};
  group.revenue.totalRevenue = totalRevenue;
  group.revenue.lastDistribution = revenue._id;
  await group.save();

  return revenue;
}

/**
 * Create custom revenue distribution (for manual distribution)
 * @param {Object} params - { auth, payload }
 * @returns {Object} Created revenue record
 */
async function createRevenueDistribution({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) {
    throw new AppError("Farmer profile not found", 404, "NOT_FOUND");
  }

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  // Only group leader can create revenue distribution
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Only group leader can create revenue distribution", 403, "FORBIDDEN");
  }

  // Validate total revenue
  const revenueValidation = validateTotalRevenue(payload.totalRevenue);
  if (!revenueValidation.valid) {
    throw new AppError(revenueValidation.error, 400, "VALIDATION_ERROR");
  }

  // Validate distribution array
  const distValidation = validateRevenueDistribution(payload.distribution);
  if (!distValidation.valid) {
    throw new AppError(distValidation.errors.join(", "), 400, "VALIDATION_ERROR");
  }

  const totalRevenue = Number(payload.totalRevenue);
  const distribution = payload.distribution;

  // Calculate percentages based on actual amounts
  const percentages = calculateRevenuePercentages(distribution, totalRevenue);

  // Generate revenue ID
  const revenueId = await Revenue.generateRevenueId();

  // Create revenue record
  const revenue = await Revenue.create({
    revenueId,
    group: group._id,
    totalRevenue,
    distribution,
    percentage: percentages,
  });

  // Update group with revenue information
  group.revenue = group.revenue || {};
  group.revenue.totalRevenue = totalRevenue;
  group.revenue.lastDistribution = revenue._id;
  await group.save();

  return revenue;
}

/**
 * Get all revenue records for a group
 * @param {Object} params - { groupId }
 * @returns {Array} List of revenue records
 */
async function getGroupRevenues({ groupId }) {
  const group = await Group.findOne({ groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  const revenues = await Revenue.find({ group: group._id })
    .populate("distribution.farmer")
    .populate("percentage.farmer")
    .sort({ createdAt: -1 })
    .limit(100);

  return revenues;
}

/**
 * Get a single revenue record by ID
 * @param {Object} params - { revenueId }
 * @returns {Object} Revenue record
 */
async function getRevenueById({ revenueId }) {
  const revenue = await Revenue.findOne({ revenueId })
    .populate("distribution.farmer")
    .populate("percentage.farmer")
    .populate("group");

  if (!revenue) {
    throw new AppError("Revenue record not found", 404, "NOT_FOUND");
  }

  return revenue;
}

/**
 * Get revenue statistics for a group
 * @param {Object} params - { groupId }
 * @returns {Object} Revenue statistics
 */
async function getRevenueStats({ groupId }) {
  const group = await Group.findOne({ groupId });
  if (!group) {
    throw new AppError("Group not found", 404, "NOT_FOUND");
  }

  const revenues = await Revenue.find({ group: group._id });

  const totalRevenue = revenues.reduce((sum, r) => sum + Number(r.totalRevenue || 0), 0);
  const totalDistributions = revenues.length;

  // Calculate average distribution per farmer
  const farmerRevenueMap = new Map();
  for (const revenue of revenues) {
    if (revenue.distribution && revenue.distribution.length > 0) {
      for (const dist of revenue.distribution) {
        const current = farmerRevenueMap.get(dist.farmerId) || 0;
        farmerRevenueMap.set(dist.farmerId, current + Number(dist.amountInQuintal || 0));
      }
    }
  }

  return {
    totalRevenue,
    totalDistributions,
    uniqueFarmers: farmerRevenueMap.size,
    averagePerDistribution: totalDistributions > 0 ? totalRevenue / totalDistributions : 0,
    farmerTotals: Object.fromEntries(farmerRevenueMap),
  };
}

module.exports = {
  calculateRevenueSplit,
  createRevenueDistribution,
  getGroupRevenues,
  getRevenueById,
  getRevenueStats,
};