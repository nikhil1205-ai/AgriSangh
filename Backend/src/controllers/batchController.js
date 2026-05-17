const { ok } = require("../utils/apiResponse");
const {
  createBatch,
  getBatches,
  getBatchByBatchId,
  updateBatchStage,
  addBuyerInterest,
  getAllAvailableBatches,
} = require("../services/batchService");

async function create(req, res, next) {
  try {
    const batch = await createBatch({ auth: req.auth, payload: req.body });
    return ok(res, batch, "Batch created");
  } catch (err) {
    return next(err);
  }
}

async function listByGroup(req, res, next) {
  try {
    const batches = await getBatches({ groupId: req.params.groupId });
    return ok(res, batches);
  } catch (err) {
    return next(err);
  }
}

async function verify(req, res, next) {
  try {
    const batch = await getBatchByBatchId({ batchId: req.params.batchId });
    return ok(res, {
      batchId: batch.batchId,
      cropType: batch.cropType,
      estimatedProduction: batch.estimatedProduction,
      groupId: batch.group.groupId,
      groupName: batch.group.groupName,
      authenticity: "Verified",
    });
  } catch (err) {
    return next(err);
  }
}

async function getOne(req, res, next) {
  try {
    const batch = await getBatchByBatchId({ batchId: req.params.batchId });
    return ok(res, batch);
  } catch (err) {
    return next(err);
  }
}

async function updateStage(req, res, next) {
  try {
    const { stageName, progressStatus, fromDate, endDate } = req.body;

    const batch = await updateBatchStage({
      auth: req.auth,
      batchId: req.params.batchId,
      stageName,
      progressStatus,
      fromDate,
      endDate,
    });
    return ok(res, batch, "Stage updated");
  } catch (err) {
    return next(err);
  }
}

async function listAvailable(req, res, next) {
  try {
    const batches = await getAllAvailableBatches();
    return ok(res, batches);
  } catch (err) {
    return next(err);
  }
}

async function expressInterest(req, res, next) {
  try {
    const batch = await addBuyerInterest({
      batchId: req.params.batchId,
      buyerData: req.body,
    });
    return ok(res, batch, "Interest recorded");
  } catch (err) {
    return next(err);
  }
}

module.exports = {
  create,
  listByGroup,
  verify,
  getOne,
  updateStage,
  listAvailable,
  expressInterest,
};

