const express = require("express");
const { createBatch, listBatches, verifyBatch } = require("../controllers/batchController");
const { protect, requireLeader } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, requireLeader, createBatch);
router.get("/verify/:batchId", verifyBatch);
router.get("/:groupId", protect, listBatches);

module.exports = router;
