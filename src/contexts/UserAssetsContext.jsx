// src/contexts/UserAssetsContext.jsx
import React, { createContext, useState, useContext } from 'react';

// 1. Create Context
const UserAssetsContext = createContext({
  userAssets: [],
  addAsset: () => {},
  // removeAsset: (assetId) => {} // Placeholder
});

// 2. Create Provider Component
export const UserAssetsProvider = ({ children }) => {
  const [userAssets, setUserAssets] = useState([]); // Start empty

  const addAsset = (newAssetData) => {
    const assetToAdd = {
      id: Date.now() + Math.random(), // Simple unique ID for demo
      savedAt: new Date().toISOString(),
      ...newAssetData
    };
    setUserAssets((prevAssets) => {
      if (prevAssets.some(asset => asset.src === assetToAdd.src)) {
        console.warn("Asset already exists in client-side archive:", assetToAdd.src);
        return prevAssets;
      }
      console.log("Adding asset to context:", assetToAdd);
      return [assetToAdd, ...prevAssets]; // Add to beginning
    });
  };

  // const removeAsset = (assetId) => { ... }; // Future implementation

  const value = {
    userAssets,
    addAsset,
    // removeAsset
  };

  return (
    <UserAssetsContext.Provider value={value}>
      {children}
    </UserAssetsContext.Provider>
  );
};

// 3. Create Custom Hook
export const useUserAssets = () => {
  const context = useContext(UserAssetsContext);
  if (context === undefined) {
    throw new Error('useUserAssets must be used within a UserAssetsProvider');
  }
  return context;
};