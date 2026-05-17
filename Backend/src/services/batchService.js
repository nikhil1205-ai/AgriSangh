const Farmer = require("../models/farmerModel");
const Group = require("../models/groupModel");
const Batch = require("../models/batchModel");
const { AppError } = require("../utils/errors");

async function createBatch({ auth, payload }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const group = await Group.findOne({ groupId: payload.groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  if (String(group.leader) !== String(farmer._id)) {
    throw new AppError("Leader-only action", 403, "FORBIDDEN");
  }

  if (!payload.cropType) throw new AppError("Missing cropType", 400, "VALIDATION_ERROR");

  // Check if batch already exists for this group
  const existingBatch = await Batch.findOne({ group: group._id });

  if (existingBatch) {
    // Update existing batch instead of creating new one
    existingBatch.cropType = payload.cropType;
    existingBatch.season = payload.season || group.cropSeason;
    existingBatch.estimatedProduction = Number(payload.estimatedProduction || 0);
    existingBatch.status = payload.status || existingBatch.status;
    existingBatch.farmersInvolved = group.members;
    await existingBatch.save();
    return existingBatch;
  }

  // Create new batch if doesn't exist
  const batchId = await Batch.generateBatchId({ cropType: payload.cropType });
  const batch = await Batch.create({
    batchId,
    group: group._id,
    cropType: payload.cropType,
    season: payload.season || group.cropSeason,
    estimatedProduction: Number(payload.estimatedProduction || 0),
    status: payload.status || "active",
    farmersInvolved: group.members,
  });

  group.activeBatch = batch._id;
  await group.save();

  return batch;
}

async function getBatches({ groupId }) {
  const group = await Group.findOne({ groupId });
  if (!group) throw new AppError("Group not found", 404, "NOT_FOUND");
  return await Batch.find({ group: group._id }).sort({ createdAt: -1 }).limit(100);
}

async function getBatchByBatchId({ batchId }) {
  const batch = await Batch.findOne({ batchId }).populate({
    path: "group",
    populate: [{ path: "leader" }],
  });
  if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");
  return batch;
}

async function updateBatchStage({ auth, batchId, stageName, progressStatus, fromDate, endDate }) {
  const farmer = await Farmer.findOne({ firebaseUid: auth.firebaseUid });
  if (!farmer) throw new AppError("Farmer profile not found", 404, "NOT_FOUND");

  const batch = await Batch.findOne({ batchId });
  if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

  // Check if user is group leader
  const group = await Group.findById(batch.group).populate("leader");
  if (String(group.leader._id) !== String(farmer._id)) {
    throw new AppError("Only group leader can update batch stages", 403, "FORBIDDEN");
  }

  const stageIndex = batch.statusTimeline.findIndex((s) => s.stage === stageName);
  if (stageIndex === -1) throw new AppError("Invalid stage", 400, "VALIDATION_ERROR");

  batch.statusTimeline[stageIndex].progressStatus = progressStatus;
  if (fromDate) batch.statusTimeline[stageIndex].fromDate = new Date(fromDate);
  if (endDate) batch.statusTimeline[stageIndex].endDate = new Date(endDate);

  await batch.save();
  return batch;
}

async function addBuyerInterest({ batchId, buyerData }) {
  const batch = await Batch.findOne({ batchId });
  if (!batch) throw new AppError("Batch not found", 404, "NOT_FOUND");

  batch.buyers.push({
    buyerName: buyerData.buyerName,
    businessName: buyerData.businessName,
    phone: buyerData.phone,
    email: buyerData.email,
    quantity: Number(buyerData.quantity) || 0,
    message: buyerData.message || "",
    paymentMethod: buyerData.paymentMethod || "Pending",
    interestedAt: new Date(),
  });

  await batch.save();
  return batch;
}

async function getAllAvailableBatches() {
  return await Batch.find({
    $or: [{ status: "active" }, { status: "harvested" }],
  })
    .populate({
      path: "group",
      select: "groupId groupName leader",
      populate: { path: "leader", select: "name" },
    })
    .sort({ createdAt: -1 })
    .limit(100);
}

module.exports = {
  createBatch,
  getBatches,
  getBatchByBatchId,
  updateBatchStage,
  addBuyerInterest,
  getAllAvailableBatches,
};

