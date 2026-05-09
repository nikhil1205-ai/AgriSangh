const { initFirebaseAdmin } = require("../config/firebaseAdmin");
const { AppError } = require("../utils/errors");

async function requireFirebaseAuth(req, _res, next) {
  try {
    const header = req.headers.authorization || "";
    const match = header.match(/^Bearer\s+(.+)$/i);
    if (!match) throw new AppError("Missing Authorization Bearer token", 401, "UNAUTHORIZED");

    const token = match[1];
    const admin = initFirebaseAdmin();
    const decoded = await admin.auth().verifyIdToken(token);

    req.auth = {
      firebaseUid: decoded.uid,
      email: decoded.email,
      name: decoded.name,
      claims: decoded,
    };
    next();
  } catch (err) {
    if (err instanceof AppError) return next(err);
    return next(new AppError("Invalid or expired Firebase token", 401, "UNAUTHORIZED"));
  }
}

module.exports = { requireFirebaseAuth };

