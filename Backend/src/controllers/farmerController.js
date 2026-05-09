const { ok } = require("../utils/apiResponse");
const {
  upsertFarmerProfile,
  getFarmerByFarmerId,
  updateFarmerByFarmerId,
} = require("../services/farmerService");
const Farmer = require("../models/farmerModel");
const { AppError } = require("../utils/errors");

async function createFarmer(req, res, next) {
  try {
    const farmer = await upsertFarmerProfile({ auth: req.auth, payload: req.body });
    return ok(res, farmer, "Farmer profile ready");
  } catch (err) {
    return next(err);
  }
}

async function getFarmer(req, res, next) {
  try {
    const farmer = await getFarmerByFarmerId(req.params.farmerId);
    return ok(res, farmer);
  } catch (err) {
    return next(err);
  }
}

async function updateFarmer(req, res, next) {
  try {
    const farmer = await updateFarmerByFarmerId({
      auth: req.auth,
      farmerId: req.params.farmerId,
      payload: req.body,
    });
    return ok(res, farmer, "Farmer profile updated");
  } catch (err) {
    return next(err);
  }
}

async function getDashboard(req, res, next) {
  try {
    const farmer = await Farmer.findOne({ farmerId: req.params.farmerId })
      .populate("activeGroups")
      .populate({ path: "contributionHistory", populate: [{ path: "group" }] });
    if (!farmer) throw new AppError("Farmer not found", 404, "NOT_FOUND");
    if (farmer.firebaseUid !== req.auth.firebaseUid) {
      throw new AppError("Forbidden", 403, "FORBIDDEN");
    }

    return ok(res, {
      activeGroups: farmer.activeGroups,
      contributionHistory: farmer.contributionHistory,
      groupHistory: farmer.groupHistory,
    });
  } catch (err) {
    return next(err);
  }
}

module.exports = { createFarmer, getFarmer, updateFarmer, getDashboard };

