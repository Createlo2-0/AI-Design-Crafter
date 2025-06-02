const express = require("express");
const { db } = require("../config/firebase");

const router = express.Router();

router.get("/firebase", async (req, res) => {
  try {
    // Try to read a collection (e.g., users)
    const snapshot = await db.collection("users").limit(1).get();
    res.json({
      status: "success",
      message: "Connected to Firestore!",
      usersFound: snapshot.size,
    });
  } catch (error) {
    res.status(500).json({
      status: "error",
      message: "Failed to connect to Firestore",
      error: error.message,
    });
  }
});

module.exports = router;