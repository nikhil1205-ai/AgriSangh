const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const { farmerDashboard, leaderDashboard } = require("../controllers/dashboardController");

router.get("/", requireFirebaseAuth, farmerDashboard);
router.get("/leader/:groupId", requireFirebaseAuth, leaderDashboard);

module.exports = router;

