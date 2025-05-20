import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getDatabase } from "firebase/database";

import { getPerformance } from "firebase/performance";

// 🧪 Load Firebase config from environment variables
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  // Optional: Uncomment below if using Realtime DB
 databaseURL: import.meta.env.VITE_FIREBASE_DATABASE_URL
};

// 🚨 Safety Check: Warn if essential values are missing
if (!firebaseConfig.apiKey || !firebaseConfig.projectId) {
  console.warn("[Firebase Config] Missing values in .env");
  throw new Error("Firebase configuration is incomplete. Check your .env file.");
}


// 🚀 Initialize Firebase App
const app = initializeApp(firebaseConfig);

// Initialize Performance Monitoring and get a reference to the service
const perf = getPerformance(app);

// 🔐 Auth Service
export const auth = getAuth(app);

// 📄 Firestore DB (used for poster metadata, user profiles, etc.)
export const db = getFirestore(app);

// 🔄 Realtime DB (Optional: for live interactions, status, logs)
export const realtimeDB = getDatabase(app);

export default app;


