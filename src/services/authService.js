import {
    createUserWithEmailAndPassword,
    signInWithEmailAndPassword,
    signOut as firebaseSignOut, // Rename to avoid conflict if needed
    // sendPasswordResetEmail, // Example for future use
    // updateProfile // Example for future use
  } from "firebase/auth";
  import { auth } from "./firebase"; // Adjust path as necessary
  
  export const signup = (email, password) => {
    // Basic validation can be added here
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required"));
    }
    return createUserWithEmailAndPassword(auth, email, password);
  };
  
  export const login = (email, password) => {
    // Basic validation can be added here
    if (!email || !password) {
      return Promise.reject(new Error("Email and password are required"));
    }
    return signInWithEmailAndPassword(auth, email, password);
  };
  
  export const logout = () => {
    return firebaseSignOut(auth);
  };
  
  // Add other auth functions as needed (password reset, profile update, etc.)
  // export const resetPassword = (email) => {
  //   return sendPasswordResetEmail(auth, email);
  // };