const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/batchController");

// Public buyer verification
router.get("/verify/:batchId", controller.verify);

// Prompt-style
router.post("/create", requireFirebaseAuth, controller.create);

// Frontend compatibility
router.post("/", requireFirebaseAuth, controller.create);
router.get("/group/:groupId", requireFirebaseAuth, controller.listByGroup);
router.get("/:batchId", controller.getOne);

module.exports = router;

