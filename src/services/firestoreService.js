import { db } from "./firebase"; // Adjust path
import { collection, addDoc, getDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from "firebase/firestore";

// Example: Add a document to a 'posters' collection
export const addPosterData = (userId, posterInfo) => {
  if (!userId || !posterInfo) {
     return Promise.reject(new Error("User ID and poster info required"));
  }
  const postersColRef = collection(db, "users", userId, "posters"); // Example nested collection
  // Or a top-level collection: const postersColRef = collection(db, "posters");
  // Add userId to the posterInfo if storing in a top-level collection
  // posterInfo.userId = userId;
  return addDoc(postersColRef, {
    ...posterInfo,
    createdAt: new Date() // Add a timestamp
  });
};

// Example: Get all posters for a specific user
export const getUserPosters = async (userId) => {
  if (!userId) {
     return Promise.reject(new Error("User ID required"));
  }
  const postersColRef = collection(db, "users", userId, "posters"); // Example nested collection
  // Or query a top-level collection:
  // const q = query(collection(db, "posters"), where("userId", "==", userId));
  const querySnapshot = await getDocs(postersColRef); // Or getDocs(q)
  const posters = [];
  querySnapshot.forEach((doc) => {
    posters.push({ id: doc.id, ...doc.data() });
  });
  return posters;
};

// Add other Firestore functions (get single doc, update, delete) as needed