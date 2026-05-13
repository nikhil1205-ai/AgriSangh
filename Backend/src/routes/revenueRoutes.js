const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const controller = require("../controllers/revenueController");

// Calculate and create revenue distribution based on participation percentages
router.post("/calculate", requireFirebaseAuth, controller.calculate);

// Create manual revenue distribution (custom amounts)
router.post("/create", requireFirebaseAuth, controller.create);

// Get all revenue records for a group
router.get("/group/:groupId", requireFirebaseAuth, controller.listByGroup);

// Get single revenue record by ID
router.get("/id/:revenueId", requireFirebaseAuth, controller.getById);

// Get revenue statistics for a group
router.get("/stats/:groupId", requireFirebaseAuth, controller.stats);

module.exports = router;