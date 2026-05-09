const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/groupController");

// Prompt-style
router.post("/create", requireFirebaseAuth, controller.create);
router.get("/search", controller.search);

// Frontend compatibility
router.get("/", controller.list);
router.post("/", requireFirebaseAuth, controller.create);
router.post("/join", requireFirebaseAuth, controller.join);
router.get("/:groupId", controller.details);
router.patch("/:groupId", requireFirebaseAuth, controller.patchGroup);
router.patch("/:groupId/crop-plan", requireFirebaseAuth, controller.patchCropPlan);
router.get("/:groupId/requests", requireFirebaseAuth, controller.getRequests);
router.patch("/:groupId/requests/decision", requireFirebaseAuth, controller.decideRequest);
router.delete("/:groupId/members/:memberUid", requireFirebaseAuth, controller.deleteMember);

module.exports = router;

