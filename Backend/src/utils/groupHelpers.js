/**
 * Group and Contribution Helper Functions
 * Reusable utilities for group operations
 */

const { AppError } = require("./errors");

/**
 * Calculate total land from land contribution array
 * @param {Array} landContributions - Array of { landSize }
 * @returns {Number} Total land
 */
function calculateTotalLand(landContributions = []) {
  if (!Array.isArray(landContributions) || landContributions.length === 0) {
    return 0;
  }

  return landContributions.reduce((total, contrib) => {
    const landSize = Number(contrib.landSize || 0);
    return total + (landSize > 0 ? landSize : 0);
  }, 0);
}

/**
 * Calculate participation percentages for all farmers
 * Formula: (farmer_land / total_land) * 100
 * @param {Array} landContributions - Array of { farmer, farmerId, landSize }
 * @returns {Array} Updated array with participation percentages
 */
function calculateParticipationPercentages(landContributions = []) {
  if (!Array.isArray(landContributions) || landContributions.length === 0) {
    return [];
  }

  const totalLand = calculateTotalLand(landContributions);

  if (totalLand <= 0) {
    throw new AppError("Total land must be greater than 0", 400, "VALIDATION_ERROR");
  }

  return landContributions.map((contrib) => {
    const landSize = Number(contrib.landSize || 0);
    const percentage = (landSize / totalLand) * 100;

    return {
      ...contrib,
      participationPercentage: Number(percentage.toFixed(2)),
    };
  });
}

/**
 * Validate land contribution entry
 * @param {Object} entry - Land contribution entry
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateLandContributionEntry(entry) {
  if (!entry.farmer) {
    return { valid: false, error: "Farmer reference is required" };
  }

  if (!entry.farmerId) {
    return { valid: false, error: "Farmer ID is required" };
  }

  const landSize = Number(entry.landSize || 0);
  if (landSize <= 0) {
    return { valid: false, error: "Land size must be greater than 0" };
  }

  if (landSize < 0) {
    return { valid: false, error: "Land size cannot be negative" };
  }

  return { valid: true, error: null };
}

/**
 * Validate land contribution array
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

  landContributions.forEach((entry, index) => {
    const validation = validateLandContributionEntry(entry);
    if (!validation.valid) {
      errors.push(`Entry ${index + 1}: ${validation.error}`);
    }

    // Check for duplicate farmers
    if (entry.farmerId && farmerIds.has(entry.farmerId)) {
      errors.push(`Duplicate farmer entry: ${entry.farmerId}`);
    }
    farmerIds.add(entry.farmerId);
  });

  return {
    valid: errors.length === 0,
    errors,
  };
}

/**
 * Validate estimated crop size
 * @param {Number} estimatedCropSize - Estimated crop size
 * @returns {Object} { valid: boolean, error: string|null }
 */
function validateEstimatedCropSize(estimatedCropSize) {
  if (estimatedCropSize === undefined || estimatedCropSize === null) {
    return { valid: true, error: null }; // Optional field
  }

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
  validateLandContributionEntry,
  validateLandContributions,
  validateEstimatedCropSize,
};