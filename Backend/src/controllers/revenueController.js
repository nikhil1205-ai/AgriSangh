const { ok } = require("../utils/apiResponse");
const { calculateRevenueSplit } = require("../services/revenueService");

async function calculate(req, res, next) {
  try {
    const revenue = await calculateRevenueSplit({ auth: req.auth, payload: req.body });
    return ok(res, revenue, "Revenue calculated");
  } catch (err) {
    return next(err);
  }
}

module.exports = { calculate };

