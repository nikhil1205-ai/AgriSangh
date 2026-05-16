/**
 * Contribution and Revenue Helper Functions
 * Reusable utilities for calculating participation percentages and revenue distribution
 */

const { AppError } = require("./errors");

/**
 * Calculate total land from an array of land contributions
 * @param {Array} landContributions - Array of { farmer, farmerId, landSize }
 * @returns {Number} Total land size
 */
function calculateTotalLand(landContributions = []) {
  if (!Array.isArray(landContributions) || landContributions.length === 0) {
    return 0;
  }

  return landContributions.reduce((total, contribution) => {
    const landSize = Number(contribution.landSize || 0);
    return total + (landSize > 0 ? landSize : 0);
  }, 0);
}

/**
 * Calculate participation percentages for all farmers in a group
 * Formula: (farmer_land / total_group_land) * 100
 * @param {Array} landContributions - Array of { farmer, farmerId, landSize }
 * @returns {Array} Array of { farmer, farmerId, percentage }
 */
function calculateParticipationPercentages(landContributions = []) {
  if (!Array.isArray(landContributions) || landContributions.length === 0) {
    return [];
  }

  const totalLand = calculateTotalLand(landContributions);

  if (totalLand === 0) {
    throw new AppError("Total land cannot be zero", 400, "VALIDATION_ERROR");
  }

  // Prevent division by zero
  if (totalLand <= 0) {
    return [];
  }

  return landContributions.map((contribution) => {
    const landSize = Number(contribution.landSize || 0);
    const percentage = (landSize / totalLand) * 100;

    return {
      farmer: contribution.farmer,
      farmerId: contribution.farmerId,
      percentage: Number(percentage.toFixed(2)),
    };
  });
}

/**
 * Calculate revenue distribution based on participation percentages
 * @param {Array} participationPercentages - Array of { farmer, farmerId, percentage }
 * @param {Number} totalRevenue - Total revenue to distribute
 * @returns {Array} Array of { farmer, farmerId, amountInQuintal, percentage }
 */
function calculateRevenueDistribution(participationPercentages = [], totalRevenue = 0) {
  if (!Array.isArray(participationPercentages) || participationPercentages.length === 0) {
    return [];
  }

  const revenue = Number(totalRevenue);

  if (revenue < 0) {
    throw new AppError("Revenue cannot be negative", 400, "VALIDATION_ERROR");
  }

  return participationPercentages.map((entry) => {
    const percentage = Number(entry.percentage || 0);
    const amountInQuintal = (percentage / 100) * revenue;

    return {
      farmer: entry.farmer,
      farmerId: entry.farmerId,
      amountInQuintal: Number(amountInQuintal.toFixed(2)),
      percentage,
    };
  });
}

/**
 * Calculate revenue percentages from actual amounts
 * Formula: (farmer_revenue / totalRevenue) * 100
 * @param {Array} distribution - Array of { farmer, farmerId, amountInQuintal }
 * @param {Number} totalRevenue - Total revenue
 * @returns {Array} Array of { farmer, farmerId, percentage }
 */
function calculateRevenuePercentages(distribution = [], totalRevenue = 0) {
  if (!Array.isArray(distribution) || distribution.length === 0) {
    return [];
  }

  const revenue = Number(totalRevenue);

  if (revenue <= 0) {
    throw new AppError("Total revenue must be greater than zero", 400, "VALIDATION_ERROR");
  }

  return distribution.map((entry) => {
    const amountInQuintal = Number(entry.amountInQuintal || 0);
    const percentage = (amountInQuintal / revenue) * 100;

    return {
      farmer: entry.farmer,
      farmerId: entry.farmerId,
      percentage: Number(percentage.toFixed(2)),
    };
  });
}

/**
 * Validate land contribution entries
 * @param {Array} landContributions - Array of land contributions
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateLandContributions(landContributions = []) {
  const errors = [];

  if (!Array.isArray(landContributions)) {
    return { valid: false, errors: ["landContribution must be an array"] };
  }

  if (landContributions.length === 0) {
    return { valid: false, errors: ["At least one land contribution is required"] };
  }

  const farmerIds = new Set();

  landContributions.forEach((contribution, index) => {
    if (!contribution.farmer) {
      errors.push(`Entry ${index + 1}: farmer reference is required`);
    }

    if (!contribution.farmerId) {
      errors.push(`Entry ${index + 1}: farmerId is required`);
    }

    const landSize = Number(contribution.landSize || 0);
    if (landSize <= 0) {
      errors.push(`Entry ${index + 1}: landSize must be greater than 0`);
    }

    if (landSize < 0) {
      errors.push(`Entry ${index + 1}: landSize cannot be negative`);
    }

    // Check for duplicate farmer entries
    if (contribution.farmerId && farmerIds.has(contribution.farmerId)) {
      errors.push(`Duplicate farmer entry: ${contribution.farmerId}`);
    }
    farmerIds.add(contribution.farmerId);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate revenue distribution entries
 * @param {Array} distribution - Array of revenue distribution entries
 * @returns {Object} { valid: boolean, errors: string[] }
 */
function validateRevenueDistribution(distribution = []) {
  const errors = [];

  if (!Array.isArray(distribution)) {
    return { valid: false, errors: ["distribution must be an array"] };
  }

  if (distribution.length === 0) {
    return { valid: false, errors: ["At least one distribution entry is required"] };
  }

  distribution.forEach((entry, index) => {
    // At least farmerId is required (farmer ObjectId is optional, can be null)
    if (!entry.farmerId) {
      errors.push(`Entry ${index + 1}: farmerId is required`);
    }

    // Validate amounts if provided (allow 0, negative not allowed)
    const amountRupee = Number(entry.amountInRupee || 0);
    const amountQuintal = Number(entry.amountInQuintal || 0);

    if (amountRupee < 0) {
      errors.push(`Entry ${index + 1}: amountInRupee cannot be negative`);
    }
    if (amountQuintal < 0) {
      errors.push(`Entry ${index + 1}: amountInQuintal cannot be negative`);
    }
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate total revenue value
 * @param {Number} totalRevenue - Total revenue value
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateTotalRevenue(totalRevenue) {
  const revenue = Number(totalRevenue);

  if (isNaN(revenue)) {
    return { valid: false, error: "Total revenue must be a valid number" };
  }

  if (revenue < 0) {
    return { valid: false, error: "Total revenue cannot be negative" };
  }

  return { valid: true, error: null };
}

/**
 * Validate estimated crop size
 * @param {Number} estimatedCropSize - Estimated crop size value
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateEstimatedCropSize(estimatedCropSize) {
  const size = Number(estimatedCropSize);

  if (isNaN(size)) {
    return { valid: false, error: "Estimated crop size must be a valid number" };
  }

  if (size < 0) {
    return { valid: false, error: "Estimated crop size cannot be negative" };
  }

  return { valid: true, error: null };
}

module.exports = {
  calculateTotalLand,
  calculateParticipationPercentages,
  calculateRevenueDistribution,
  calculateRevenuePercentages,
  validateLandContributions,
  validateRevenueDistribution,
  validateTotalRevenue,
  validateEstimatedCropSize,
};