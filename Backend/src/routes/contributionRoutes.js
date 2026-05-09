const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/contributionController");

// Prompt-style
router.post("/create", requireFirebaseAuth, controller.create);
router.get("/group/:groupId", requireFirebaseAuth, controller.listByGroup);

// Frontend compatibility
router.post("/", requireFirebaseAuth, controller.create);
router.get("/:groupId", requireFirebaseAuth, controller.listByGroup);

module.exports = router;

