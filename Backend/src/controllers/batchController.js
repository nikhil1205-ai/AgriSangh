const { v4: uuidv4 } = require("uuid");
const store = require("../models/inMemoryStore");
const { success, error } = require("../utils/apiResponse");
const { generateBatchId } = require("../utils/batchId");

const createBatch = (req, res) => {
  try {
    const { groupId, cropType, membersInvolved, estimatedProduction, harvestTimeline } = req.body;
    const group = store.groups.find((g) => g.id === groupId);
    if (!group) return error(res, "Group not found", 404);

    const existingCount = store.batches.filter((b) => b.groupId === groupId).length;
    const batchId = generateBatchId(cropType, existingCount + 1);

    const batch = {
      id: uuidv4(),
      batchId,
      groupId,
      groupName: group.name,
      cropType,
      membersInvolved,
      estimatedProduction: Number(estimatedProduction || 0),
      harvestTimeline,
      authenticity: "verified",
      createdAt: new Date().toISOString(),
    };

    store.batches.push(batch);
    return success(res, batch, "Batch created", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const listBatches = (req, res) => {
  const batches = store.batches.filter((b) => b.groupId === req.params.groupId);
  return success(res, batches, "Batches fetched");
};

const verifyBatch = (req, res) => {
  const batch = store.batches.find((b) => b.batchId === req.params.batchId);
  if (!batch) return error(res, "Batch not found", 404);
  return success(res, batch, "Batch verified");
};

module.exports = { createBatch, listBatches, verifyBatch };
