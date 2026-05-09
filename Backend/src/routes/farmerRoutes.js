const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const { createFarmer, getFarmer, updateFarmer, getDashboard } = require("../controllers/farmerController");

router.post("/create", requireFirebaseAuth, createFarmer);
router.get("/dashboard/:farmerId", requireFirebaseAuth, getDashboard);
router.get("/:farmerId", requireFirebaseAuth, getFarmer);
router.put("/:farmerId", requireFirebaseAuth, updateFarmer);

module.exports = router;

