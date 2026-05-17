const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/batchController");

// Public buyer verification
router.get("/verify/:batchId", controller.verify);

// List available batches for buyers (public)
router.get("/available", controller.listAvailable);

// Express buyer interest (public)
router.post("/:batchId/interest", controller.expressInterest);

// Leader-only actions
router.post("/create", requireFirebaseAuth, controller.create);
router.put("/:batchId/stage", requireFirebaseAuth, controller.updateStage);

// Frontend compatibility
router.post("/", requireFirebaseAuth, controller.create);
router.get("/group/:groupId", requireFirebaseAuth, controller.listByGroup);
router.get("/:batchId", controller.getOne);

module.exports = router;

