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

  const batchId = await Batch.generateBatchId({ cropType: payload.cropType });
  const batch = await Batch.create({
    batchId,
    group: group._id,
    cropType: payload.cropType,
    season: payload.season || group.cropSeason,
    estimatedProduction: Number(payload.estimatedProduction || 0),
    status: "active",
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

module.exports = { createBatch, getBatches, getBatchByBatchId };

