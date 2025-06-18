const { db } = require("../config/firebase");
const UserModel = require("../models/userModel");

async function getAllUsers(req, res) {
  try {
    const snapshot = await db.collection("users").get();
    const users = [];
    snapshot.forEach((doc) => {
      users.push({ id: doc.id, ...doc.data() });
    });
    res.status(200).json(users);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function getUserById(req, res) {
  const { id } = req.params;
  try {
    const doc = await db.collection("users").doc(id).get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    res.status(200).json({ id: doc.id, ...doc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function editUserProfile(req, res) {
  const { id } = req.params;
  const { displayName, avatarUrl, status, role } = req.body;
  try {
    const userRef = db.collection("users").doc(id);
    const doc = await userRef.get();
    if (!doc.exists) {
      return res.status(404).json({ error: "User not found" });
    }
    const updateData = {};
    if (displayName !== undefined) updateData.displayName = displayName;
    if (avatarUrl !== undefined) updateData.avatarUrl = avatarUrl;
    if (status !== undefined) updateData.status = status;
    if (role !== undefined) updateData.role = role;

    await userRef.update(updateData);
    const updatedDoc = await userRef.get();
    res.status(200).json({ id: updatedDoc.id, ...updatedDoc.data() });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function ttc(req, res) {
  try {
    const snapshot = await db.collection("users").get();
    res.status(200).json({ totalUsers: snapshot.size });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
}

async function deleteUser(req, res) {
  const { id } = req.params;
  try {
    await auth.deleteUser(id);
    await db.collection("users").doc(id).delete();

    res.status(200).json({ message: "User deleted successfully" });
  } catch (error) {
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