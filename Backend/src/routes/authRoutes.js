const express = require("express");
const { upsertProfile, getMe } = require("../controllers/authController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/profile", upsertProfile);
router.get("/me", protect, getMe);

module.exports = router;
