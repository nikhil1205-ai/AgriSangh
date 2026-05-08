const express = require("express");
const {
  createGroup,
  listGroups,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  updateCropPlan,
  updateIrrigation,
  updateTechnologyAccess,
} = require("../controllers/groupController");
const { protect, requireLeader } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, listGroups);
router.post("/", protect, requireLeader, createGroup);
router.post("/join", protect, joinGroup);
router.get("/:groupId/requests", protect, requireLeader, getJoinRequests);
router.patch("/:groupId/requests/decision", protect, requireLeader, decideJoinRequest);
router.patch("/:groupId/crop-plan", protect, requireLeader, updateCropPlan);
router.patch("/:groupId/irrigation", protect, requireLeader, updateIrrigation);
router.patch("/:groupId/technology", protect, requireLeader, updateTechnologyAccess);

module.exports = router;
