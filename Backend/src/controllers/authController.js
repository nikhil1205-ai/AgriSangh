const jwt = require("jsonwebtoken");
const { firestore } = require("../config/firebaseAdmin");
const { upsertUser } = require("../models/userModel");
const { success, error } = require("../utils/apiResponse");

const JWT_SECRET = process.env.JWT_SECRET || "agrisangh-dev-secret";

const usersCollection = () => firestore.collection("users");

const issueJwt = (user) =>
  jwt.sign(
    {
      uid: user.uid,
      email: user.email,
      role: user.role || "farmer",
      groupId: user.groupId || null,
    },
    JWT_SECRET,
    { expiresIn: "7d" }
  );

const upsertProfile = async (req, res) => {
  try {
    const payload = req.body;
    if (!payload.uid || !payload.email || !payload.fullName) {
      return error(res, "uid, email and fullName are required", 400);
    }

    const userPayload = {
      uid: payload.uid,
      fullName: payload.fullName,
      email: payload.email,
      phone: payload.phone || "",
      state: payload.state || "",
      district: payload.district || "",
      village: payload.village || "",
      landSize: Number(payload.landSize || 0),
      cropInterest: payload.cropInterest || "",
      role: payload.role || "farmer",
      groupId: payload.groupId || null,
      groupHistory: payload.groupHistory || [],
      contributionHistory: payload.contributionHistory || [],
      updatedAt: new Date().toISOString(),
    };
    const user = upsertUser(userPayload);

    if (firestore) {
      await usersCollection().doc(user.uid).set(user, { merge: true });
    }

    return success(res, { user, token: issueJwt(user) }, "Profile saved", 201);
  } catch (e) {
    return error(res, e.message);
  }
};

const getMe = async (req, res) => {
  try {
    return success(res, req.user, "Profile fetched");
  } catch (e) {
    return error(res, e.message);
  }
};

module.exports = { upsertProfile, getMe };
