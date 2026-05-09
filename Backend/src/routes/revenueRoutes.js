const router = require("express").Router();
const { requireFirebaseAuth } = require("../middleware/firebaseAuth");
const { calculate } = require("../controllers/revenueController");

router.post("/calculate", requireFirebaseAuth, calculate);

module.exports = router;

