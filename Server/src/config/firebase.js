require("dotenv").config(); // Load .env variables
const admin = require("firebase-admin");

try {
  if (!admin.apps.length) {
    admin.initializeApp({
      credential: admin.credential.cert({
        projectId: process.env.FIREBASE_PROJECT_ID,
        clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
        privateKey: process.env.FIREBASE_PRIVATE_KEY.replace(/\\n/g, "\n"),
      }),
    });
    console.log("Firebase Admin Initialized");
  }
} catch (error) {
  console.error("Firebase Admin Init Error:", error);
  throw new Error("Failed to initialize Firebase Admin SDK: " + error.message);
}

const db = admin.firestore();
const auth = admin.auth();

module.exports = { db, auth };
