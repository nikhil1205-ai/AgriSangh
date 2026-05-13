/**
 * Contribution and Revenue Data Transformation Utilities
 * Handles the new group-based backend structure
 */

/**
 * Flatten group-level contribution into individual farmer contributions
 * @param {Object} contribution - Group contribution object
 * @returns {Array} Array of individual farmer contributions
 */
export const flattenContribution = (contribution) => {
  if (!contribution) return [];

  const landContribs = contribution.landContribution || [];

  return landContribs.map((land) => {
    return {
      id: `${contribution.contributionId}-${land.farmerId}`,
      contributionId: contribution.contributionId,
      group: contribution.group,
      farmer: land.farmer,
      farmerId: land.farmerId,
      landSize: land.landSize,
      percentage: land.participationPercentage || 0,
      totalLand: contribution.totalLand || 0,
      season: contribution.season,
      createdAt: contribution.createdAt,
      updatedAt: contribution.updatedAt,
    };
  });
};

/**
 * Flatten multiple group contributions into a single array
 * @param {Array} contributions - Array of group contributions
 * @returns {Array} Flattened array of all farmer contributions
 */
export const flattenAllContributions = (contributions = []) => {
  if (!Array.isArray(contributions)) return [];

  return contributions.flatMap((contribution) => flattenContribution(contribution));
};

/**
 * Transform revenue distribution for display
 * @param {Object} revenue - Revenue object from backend
 * @returns {Object} Transformed revenue with display-ready fields
 */
export const transformRevenue = (revenue) => {
  if (!revenue) return null;

  const distribution = (revenue.distribution || []).map((dist) => ({
    ...dist,
    amountInQuintal: dist.amountInQuintal || dist.amount || 0,
  }));

  const percentages = (revenue.percentage || []).map((pct) => ({
    ...pct,
    percentage: pct.percentage || 0,
  }));

  return {
    ...revenue,
    distribution,
    percentage: percentages,
    totalRevenue: revenue.totalRevenue || 0,
    revenueId: revenue.revenueId,
    createdAt: revenue.createdAt,
  };
};

/**
 * Calculate total land from contributions
 * @param {Array} contributions - Flattened contributions array
 * @returns {Number} Total land in acres
 */
export const calculateTotalLand = (contributions = []) => {
  if (!Array.isArray(contributions)) return 0;

  return contributions.reduce((total, contrib) => {
    return total + Number(contrib.landSize || 0);
  }, 0);
};

/**
 * Calculate total revenue from revenue records
 * @param {Array} revenues - Array of revenue records
 * @returns {Number} Total revenue
 */
export const calculateTotalRevenue = (revenues = []) => {
  if (!Array.isArray(revenues)) return 0;

  return revenues.reduce((total, rev) => {
    return total + Number(rev.totalRevenue || 0);
  }, 0);
};

/**
 * Get unique farmers from flattened contributions
 * @param {Array} contributions - Flattened contributions array
 * @returns {Array} Unique farmer list
 */
export const getUniqueFarmers = (contributions = []) => {
  if (!Array.isArray(contributions)) return [];

  const seen = new Map();
  contributions.forEach((contrib) => {
    if (contrib.farmerId && !seen.has(contrib.farmerId)) {
      seen.set(contrib.farmerId, contrib);
    }
  });

  return Array.from(seen.values());
};