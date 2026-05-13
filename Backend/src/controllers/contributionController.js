const { ok } = require("../utils/apiResponse");
const {
  addContribution,
  updateContribution,
  getGroupContributions,
  getContributionById,
  deleteContribution,
} = require("../services/contributionService");

/**
 * Create a new group contribution
 */
async function create(req, res, next) {
  try {
    const contribution = await addContribution({ auth: req.auth, payload: req.body });
    return ok(res, contribution, "Contribution saved successfully");
  } catch (err) {
    return next(err);
  }
}

/**
 * Update an existing contribution
 */
async function update(req, res, next) {
  try {
    const contribution = await updateContribution({
      contributionId: req.params.contributionId,
      payload: req.body,
    });
    return ok(res, contribution, "Contribution updated successfully");
  } catch (err) {
    return next(err);
  }
}

/**
 * Get all contributions for a group
 */
async function listByGroup(req, res, next) {
  try {
    const contributions = await getGroupContributions({ groupId: req.params.groupId });
    return ok(res, contributions);
  } catch (err) {
    return next(err);
  }
}

/**
 * Get a single contribution by ID
 */
async function getById(req, res, next) {
  try {
    const contribution = await getContributionById({
      contributionId: req.params.contributionId,
    });
    return ok(res, contribution);
  } catch (err) {
    return next(err);
  }
}

/**
 * Delete a contribution
 */
async function remove(req, res, next) {
  try {
    const result = await deleteContribution({
      contributionId: req.params.contributionId,
    });
    return ok(res, result, "Contribution deleted successfully");
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  update,
  listByGroup,
  getById,
  remove,
};