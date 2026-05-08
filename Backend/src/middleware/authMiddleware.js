const jwt = require("jsonwebtoken");
const { findUserByUid } = require("../models/userModel");
const { error } = require("../utils/apiResponse");

const JWT_SECRET = process.env.JWT_SECRET || "agrisangh-dev-secret";

const protect = (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader?.startsWith("Bearer ")) return error(res, "Unauthorized", 401);

  try {
    const token = authHeader.split(" ")[1];
    const decoded = jwt.verify(token, JWT_SECRET);
    const user = findUserByUid(decoded.uid) || decoded;
    req.user = user;
    return next();
  } catch (_e) {
    return error(res, "Invalid or expired token", 401);
  }
};

const requireLeader = (req, res, next) => {
  if (req.user.role !== "leader") return error(res, "Leader role required", 403);
  return next();
};

module.exports = { protect, requireLeader };
