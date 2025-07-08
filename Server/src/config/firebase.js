<<<<<<< HEAD
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
=======
// File: Server/src/config/firebase.js (Updated)

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');
>>>>>>> 82aa9ff2abf2d2d2507077938a1b0bbec462b95c

// Use the path to your downloaded service account key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

module.exports = { admin, db };