const express = require("express");
const { addContribution, listContributions } = require("../controllers/contributionController");
const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addContribution);
router.get("/:groupId", protect, listContributions);

module.exports = router;
