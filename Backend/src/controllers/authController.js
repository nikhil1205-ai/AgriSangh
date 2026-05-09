const { ok } = require("../utils/apiResponse");
const { upsertFarmerProfile } = require("../services/farmerService");

async function saveProfile(req, res, next) {
  try {
    const farmer = await upsertFarmerProfile({ auth: req.auth, payload: req.body });
    return ok(res, { user: farmer }, "Profile synced");
  } catch (err) {
    return next(err);
  }
}

module.exports = { saveProfile };

