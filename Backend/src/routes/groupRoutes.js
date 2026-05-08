const express = require("express");
const {
  createGroup,
  discoverGroups,
  getGroupById,
  joinGroup,
  getJoinRequests,
  decideJoinRequest,
  updateCropPlan,
  updateIrrigation,
  updateTechnologyAccess,
  updateGroup,
  removeMember,
} = require("../controllers/groupController");
const { protect, requireLeader } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/", protect, discoverGroups);
router.get("/:groupId", protect, getGroupById);
router.post("/", protect, createGroup);
router.post("/join", protect, joinGroup);
router.get("/:groupId/requests", protect, requireLeader, getJoinRequests);
router.patch("/:groupId/requests/decision", protect, requireLeader, decideJoinRequest);
router.patch("/:groupId", protect, requireLeader, updateGroup);
router.delete("/:groupId/members/:memberUid", protect, requireLeader, removeMember);
router.patch("/:groupId/crop-plan", protect, requireLeader, updateCropPlan);
router.patch("/:groupId/irrigation", protect, requireLeader, updateIrrigation);
router.patch("/:groupId/technology", protect, requireLeader, updateTechnologyAccess);

module.exports = router;
