const { auth } = require("../config/firebase");
const logger = require("../utils/logger");

const { admin } = require('../config/firebase');

const authMiddleware = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    logger.warn("[verifyFirebaseToken] No token provided");
    return res.status(401).json({ error: "No token provided" });
  }

  const idToken = authHeader.split('Bearer ')[1];

  try {
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    req.user = decodedToken;
    logger.info("[verifyFirebaseToken] Token verified for user:", decodedToken.uid);
    next();
  } catch (error) {
    logger.error("[verifyFirebaseToken] Invalid or expired token:", error);
    return res.status(401).json({ error: "Invalid or expired token" });
  }
};

module.exports = { verifyFirebaseToken };