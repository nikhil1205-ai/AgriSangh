const { ok } = require("../utils/apiResponse");
const { addContribution, getGroupContributions } = require("../services/contributionService");

async function create(req, res, next) {
  try {
    const contribution = await addContribution({ auth: req.auth, payload: req.body });
    return ok(res, contribution, "Contribution saved");
  } catch (err) {
    return next(err);
  }
}

async function listByGroup(req, res, next) {
  try {
    const contributions = await getGroupContributions({ groupId: req.params.groupId });
    return ok(res, contributions);
  } catch (err) {
    return next(err);
  }
}

module.exports = { create, listByGroup };

