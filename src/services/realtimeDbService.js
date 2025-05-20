import { realtimeDB } from "./firebase"; // Adjust path
import { ref, set, get, child, update, remove, onValue, off } from "firebase/database";

// Example: Write user preferences to Realtime DB
export const setUserPreferences = (userId, prefs) => {
  if (!userId || !prefs) {
     return Promise.reject(new Error("User ID and preferences required"));
  }
  const userPrefsRef = ref(realtimeDB, `users/${userId}/preferences`);
  return set(userPrefsRef, prefs);
};

// Example: Get user preferences once
export const getUserPreferences = async (userId) => {
  if (!userId) {
     return Promise.reject(new Error("User ID required"));
  }
  const userPrefsRef = ref(realtimeDB, `users/${userId}/preferences`);
  try {
    const snapshot = await get(userPrefsRef);
    if (snapshot.exists()) {
      return snapshot.val();
    } else {
      console.log("No preferences found for user:", userId);
      return null; // Or return default preferences
    }
  } catch (error) {
    console.error("Error getting preferences:", error);
    throw error;
  }
};

// Example: Listen for real-time updates (e.g., notifications)
// Make sure to call the returned 'unsubscribe' function when the component unmounts
export const listenToUserNotifications = (userId, callback) => {
   if (!userId || typeof callback !== 'function') {
     console.error("User ID and callback function required for listener");
     return () => {}; // Return an empty function for cleanup
   }
   const notificationsRef = ref(realtimeDB, `users/${userId}/notifications`);
   const unsubscribe = onValue(notificationsRef, (snapshot) => {
     const data = snapshot.val();
     callback(data); // Pass data to the callback function provided by the component
   }, (error) => {
       console.error("Error listening to notifications:", error);
       // Handle error, maybe notify the user or retry
   });

   // Return the unsubscribe function so the component can clean up the listener
   return unsubscribe;
}


// Add other Realtime DB functions (update, delete) as needed