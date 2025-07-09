const { db } = require("../config/firebase");
const logger = require("../utils/logger");

async function createUser(uid, data) {
  logger.info("[createUser] Creating user:", uid);
  try {
    await db
      .collection("users")
      .doc(uid)
      .set({
        email: data.email,
        displayName: data.displayName || "",
        role: data.role || "user",
        createdAt: new Date(),
        avatarUrl: data.avatarUrl || "",
        status: "active",
        lastLogin: new Date(),
      });
    logger.info("[createUser] User created:", uid);
  } catch (error) {
    logger.error("[createUser] Error:", error);
    throw error;
  }
}

async function createAsset(userId, data) {
  logger.info("[createAsset] Creating asset for user:", userId);
  try {
    await db.collection("assets").add({
      userId,
      imageUrl: data.imageUrl,
      prompt: data.prompt,
      negativePrompt: data.negativePrompt || "",
      style: data.style,
      aspectRatio: data.aspectRatio,
      seed: data.seed || null,
      dimensions: data.dimensions || "1024x1024",
      createdAt: new Date(),
      savedAt: new Date(),
      metadata: data.metadata || {},
    });
    logger.info("[createAsset] Asset created for user:", userId);
  } catch (error) {
    logger.error("[createAsset] Error:", error);
    throw error;
  }
}

async function createSession(userId) {
  logger.info("[createSession] Creating session for user:", userId);
  try {
    await db.collection("sessions").add({
      userId,
      startedAt: new Date(),
      active: true,
    });
    logger.info("[createSession] Session created for user:", userId);
  } catch (error) {
    logger.error("[createSession] Error:", error);
    throw error;
  }
}

async function createStats(docId, data) {
  logger.info("[createStats] Creating stats doc:", docId);
  try {
    await db
      .collection("stats")
      .doc(docId)
      .set({
        totalUsers: data.totalUsers || 0,
        totalAssets: data.totalAssets || 0,
        activeSessions: data.activeSessions || 0,
        month: data.month || "",
        createdAt: new Date(),
      });
    logger.info("[createStats] Stats created:", docId);
  } catch (error) {
    logger.error("[createStats] Error:", error);
    throw error;
  }
}

// If you have a createFeedback function, add logs similarly:
async function createFeedback(userId, data) {
  logger.info("[createFeedback] Creating feedback for user:", userId);
  try {
    await db.collection("feedback").add({
      userId,
      ...data,
      createdAt: new Date(),
    });
    logger.info("[createFeedback] Feedback created for user:", userId);
  } catch (error) {
    logger.error("[createFeedback] Error:", error);
    throw error;
  }
}

module.exports = {
  createUser,
  createAsset,
  createSession,
  createStats,
  createFeedback,
};
