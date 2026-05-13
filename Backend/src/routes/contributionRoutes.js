const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/contributionController");

// Create new contribution (group-based with multiple farmer contributions)
router.post("/create", requireFirebaseAuth, controller.create);
router.post("/", requireFirebaseAuth, controller.create);

// Update existing contribution
router.put("/:contributionId", requireFirebaseAuth, controller.update);

// Get all contributions for a group
router.get("/group/:groupId", requireFirebaseAuth, controller.listByGroup);
router.get("/:groupId", requireFirebaseAuth, controller.listByGroup);

// Get single contribution by ID
router.get("/id/:contributionId", requireFirebaseAuth, controller.getById);

// Delete contribution
router.delete("/:contributionId", requireFirebaseAuth, controller.remove);

module.exports = router;