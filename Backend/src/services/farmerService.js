const Farmer = require("../models/farmerModel");
const { AppError } = require("../utils/errors");

async function upsertFarmerProfile({ auth, payload }) {
  if (!auth?.firebaseUid) throw new AppError("Missing auth context", 401, "UNAUTHORIZED");

  const farmer = await Farmer.upsertFromFirebase(auth, payload);
  return farmer;
}

async function getFarmerByFarmerId(farmerId) {
  const farmer = await Farmer.findOne({ farmerId })
    .populate("activeGroups")
    .populate({
      path: "contributionHistory",
      populate: [{ path: "group" }],
    });
  if (!farmer) throw new AppError("Farmer not found", 404, "NOT_FOUND");
  return farmer;
}

async function updateFarmerByFarmerId({ auth, farmerId, payload }) {
  const farmer = await Farmer.findOne({ farmerId });
  if (!farmer) throw new AppError("Farmer not found", 404, "NOT_FOUND");
  if (farmer.firebaseUid !== auth.firebaseUid) {
    throw new AppError("Forbidden", 403, "FORBIDDEN");
  }

  const updatable = [
    "fullName",
    "phone",
    "state",
    "district",
    "village",
    "landSize",
    "cropInterest",
  ];
  for (const key of updatable) {
    if (payload[key] !== undefined) farmer[key] = payload[key];
  }
  await farmer.save();
  return farmer;
}

module.exports = { upsertFarmerProfile, getFarmerByFarmerId, updateFarmerByFarmerId };

