const express = require("express");
const { leaderDashboard, farmerDashboard } = require("../controllers/dashboardController");
const { protect, requireLeader } = require("../middleware/authMiddleware");

const router = express.Router();

router.get("/leader/:groupId", protect, requireLeader, leaderDashboard);
router.get("/farmer", protect, farmerDashboard);

module.exports = router;
