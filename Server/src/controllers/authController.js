const { auth, db } = require("../config/firebase");
const UserModel = require("../models/userModel");
const logger = require("../utils/logger");

async function signup(req, res) {
  const { email, password } = req.body;
  logger.info("[signup] Attempt for:", email);
  try {
    const userRecord = await auth.createUser({ email, password });
    logger.info("[signup] Firebase user created:", userRecord.uid);
    const user = new UserModel({
      id: userRecord.uid,
      email: userRecord.email,
      role: "user",
      avatarUrl: userRecord.photoURL || "",
      status: "active",
      createdAt: new Date(),
      lastLogin: new Date(),
    });
    await db
      .collection("users")
      .doc(user.id)
      .set({ ...user });
    logger.info("[signup] User saved to Firestore:", user.id);
    res.status(201).json({ message: "User created", user });
  } catch (error) {
    logger.error("[signup] Error:", error);
    res.status(400).json({ error: error.message });
  }
}

async function login(req, res) {
  const { idToken, email, password } = req.body;
  logger.info("[login] Attempt for:", email || "with idToken");
  try {
    let decoded;
    if (idToken) {
      decoded = await auth.verifyIdToken(idToken);
      logger.info("[login] Decoded idToken for:", decoded.uid);
    } else if (email) {
      const user = await auth.getUserByEmail(email);
      decoded = { uid: user.uid, email: user.email };
      logger.info("[login] Found user by email:", user.uid);
    } else {
      logger.warn("[login] No credentials provided");
      return res.status(400).json({ error: "No credentials provided" });
    }

    const userRef = db.collection("users").doc(decoded.uid);
    const doc = await userRef.get();

    const userData = {
      id: decoded.uid,
      email: decoded.email || email,
      displayName: decoded.name || "",
      avatarUrl: decoded.picture || "",
      phoneNumber: decoded.phone_number || "",
      role: "user",
      provider: decoded.firebase?.sign_in_provider || "password",
      status: "active",
      lastLogin: new Date(),
    };

    if (!doc.exists) {
      await userRef.set({ ...userData, createdAt: new Date() });
      logger.info("[login] New user created in Firestore:", decoded.uid);
      res.status(201).json({ message: "User created", user: userData });
    } else {
      await userRef.update({ lastLogin: new Date() });
      const updated = await userRef.get();
      logger.info("[login] User login successful:", decoded.uid);
      res
        .status(200)
        .json({ message: "Login successful", user: updated.data() });
    }
  } catch (error) {
    logger.error("[login] Error:", error);
    res.status(401).json({ error: error.message });
  }
}

async function forgotPassword(req, res) {
  const { email } = req.body;
  logger.info("[forgotPassword] Requested for:", email);
  try {
    const link = await auth.generatePasswordResetLink(email);
    logger.info("[forgotPassword] Link generated for:", email);
    res.status(200).json({ message: "Reset link sent", link });
  } catch (error) {
    logger.error("[forgotPassword] Error:", error);
    res.status(400).json({ error: error.message });
  }
}

module.exports = { signup, login, forgotPassword };
