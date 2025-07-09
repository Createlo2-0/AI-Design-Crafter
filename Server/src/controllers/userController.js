const { db, auth } = require("../config/firebase");
const UserModel = require("../models/userModel");
const logger = require("../utils/logger");

async function getAllUsers(req, res) {
  logger.info("[getAllUsers] Fetching all users");
  try {
    const snapshot = await db.collection("users").get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    logger.info("[getAllUsers] Total users fetched:", users.length);
    res.status(200).json(users);
  } catch (error) {
    logger.error("[getAllUsers] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  logger.info("[getUserById] Fetching user:", id);
  try {
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) {
      logger.warn("[getUserById] User not found:", id);
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    logger.error("[getUserById] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function editUserProfile(req, res) {
  const { id } = req.params;
  const { displayName, avatarUrl, status, role } = req.body;
  logger.info("[editUserProfile] Editing user:", id);
  try {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      logger.warn("[editUserProfile] User not found:", id);
      return res.status(404).json({ error: "User not found" });
    }
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (status !== undefined) updateData.status = status;
    if (role !== undefined) updateData.role = role;

    await userRef.update(updateData);
    const updatedDoc = await userRef.get();
    logger.info("[editUserProfile] User updated:", id);
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    logger.error("[editUserProfile] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function ttc(req, res) {
  logger.info("[ttc] Counting users");
  try {
    const snapshot = await db.collection("users").get();
    logger.info("[ttc] Total users:", snapshot.size);
    res.status(200).json({ totalUsers: snapshot.size });
  } catch (error) {
    logger.error("[ttc] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  logger.info("[deleteUser] Deleting user:", id);
  try {
    try {
      await auth.deleteUser(id);
      logger.info("[deleteUser] Firebase user deleted:", id);
    } catch (authErr) {
      if (authErr.code !== "auth/user-not-found") {
        logger.error("[deleteUser] Firebase error:", authErr);
        throw authErr;
      } else {
        logger.warn("[deleteUser] Firebase user not found:", id);
      }
    }
    await db.collection("users").doc(id).delete();
    logger.info("[deleteUser] Firestore user deleted:", id);
    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
    logger.error("[deleteUser] Error:", error);
    res.status(500).json({ error: error.message });
  }
}

module.exports = {
  getAllUsers,
  getUserById,
  editUserProfile,
  ttc,
  deleteUser,
};
