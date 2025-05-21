// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged, EmailAuthProvider, reauthenticateWithCredential, updatePassword } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
  login as authServiceLogin,
  signup as authServiceSignup,
  logout as authServiceLogout
} from '../services/authService';

// Create the context
const AuthContext = createContext(undefined);

// Custom hook to use the auth context
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loadingAuth, setLoadingAuth] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoadingAuth(false);
    }, (error) => {
      console.error("AuthProvider: Error in onAuthStateChanged listener:", error);
      setCurrentUser(null);
      setLoadingAuth(false);
    });

    return unsubscribe;
  }, []);

  const login = async (email, password) => {
    return authServiceLogin(email, password);
  };

  const signup = async (email, password) => {
    return authServiceSignup(email, password);
  };

  const logout = async () => {
    return authServiceLogout();
  };

  const updateUserPassword = async (currentPassword, newPassword) => {
    if (!currentUser?.email) throw new Error("No authenticated user");

    const credential = EmailAuthProvider.credential(
      currentUser.email,
      currentPassword
    );

    await reauthenticateWithCredential(currentUser, credential);
    await updatePassword(currentUser, newPassword);
  };

  const value = {
    currentUser,
    loadingAuth,
    login,
    signup,
    logout,
    updateUserPassword
  };

  return (
    <AuthContext.Provider value={value}>
      {!loadingAuth && children}
    </AuthContext.Provider>
  );
};
