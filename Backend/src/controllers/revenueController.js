const { ok } = require("../utils/apiResponse");
const {
  calculateRevenueSplit,
  createRevenueDistribution,
  getGroupRevenues,
  getRevenueById,
  getRevenueStats,
} = require("../services/revenueService");

/**
 * Calculate and create revenue distribution based on participation percentages
 */
async function calculate(req, res, next) {
  try {
    const revenue = await calculateRevenueSplit({ auth: req.auth, payload: req.body });
    return ok(res, revenue, "Revenue calculated and distributed successfully");
  } catch (err) {
    return next(err);
  }
}

/**
 * Create manual revenue distribution (custom amounts)
 */
async function create(req, res, next) {
  try {
    const revenue = await createRevenueDistribution({ auth: req.auth, payload: req.body });
    return ok(res, revenue, "Revenue distribution created successfully");
  } catch (err) {
    return next(err);
  }
}

/**
 * Get all revenue records for a group
 */
async function listByGroup(req, res, next) {
  try {
    const revenues = await getGroupRevenues({ groupId: req.params.groupId });
    return ok(res, revenues);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single revenue record by ID
 */
async function getById(req, res, next) {
  try {
    const revenue = await getRevenueById({ revenueId: req.params.revenueId });
    return ok(res, revenue);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get revenue statistics for a group
 */
async function stats(req, res, next) {
  try {
    const stats = await getRevenueStats({ groupId: req.params.groupId });
    return ok(res, stats);
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  calculate,
  create,
  listByGroup,
  getById,
  stats,
};