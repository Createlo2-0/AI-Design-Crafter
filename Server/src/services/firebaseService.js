const { db } = require("../config/firebase");

async function createUser(uid, data) {
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
}

async function createAsset(userId, data) {
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
}

async function createSession(userId) {
  await db.collection("sessions").add({
    userId,
    startedAt: new Date(),
    active: true,
  });
}

async function createStats(docId, data) {
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
}

module.exports = {
  createUser,
  createAsset,
  createSession,
  createStats,
  createFeedback,
};
