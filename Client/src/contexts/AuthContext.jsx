// src/contexts/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../services/firebase';
import {
    login as authServiceLogin,
    signup as authServiceSignup,
    logout as authServiceLogout
} from '../services/authService';

// Create the context (this is not exported as default)
const AuthContext = createContext(undefined); // Initialize with undefined or null

// Custom hook to use the auth context (DEFINED AND EXPORTED HERE)
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        // This error means useAuth was called outside of AuthProvider
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
        return unsubscribe; // Cleanup subscription
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

    const value = {
        currentUser,
        loadingAuth,
        login,
        signup,
        logout
    };

    return (
        <AuthContext.Provider value={value}>
            {!loadingAuth && children}
        </AuthContext.Provider>
    );
};

// DO NOT add "export default AuthContext;" if useAuth is defined and exported above.
// We are exporting AuthProvider and useAuth as named exports.