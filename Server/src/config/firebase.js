// File: Server/src/config/firebase.js (Updated)

const admin = require('firebase-admin');
const { getFirestore } = require('firebase-admin/firestore');

// Use the path to your downloaded service account key
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

const db = getFirestore();

module.exports = { admin, db };