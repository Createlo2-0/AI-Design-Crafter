// src/services/posterService.js
// import { auth } from './firebase'; // Temporarily comment out auth for simplicity

// Use the complete URL from .env
const RAW_ENV_URL = import.meta.env.VITE_GCP_POSTER_FUNCTION_URL;

export const generatePoster = async (promptData) => {
  console.log(" posterService.js - RAW VITE_GCP_POSTER_FUNCTION_URL:", RAW_ENV_URL); // LOG THIS!

  if (!RAW_ENV_URL || typeof RAW_ENV_URL !== 'string' || !RAW_ENV_URL.startsWith('https://')) {
    console.error("❌ VITE_GCP_POSTER_FUNCTION_URL is not configured correctly:", RAW_ENV_URL);
    throw new Error("Poster generation service endpoint is not configured or invalid.");
  }

  const headers = {
    'Content-Type': 'application/json',
  };

  console.log(`📡 Attempting to POST to (this should be the full correct URL): ${RAW_ENV_URL}`);
  console.log("📦 Sending parameters:", promptData);

  try {
    // Directly use RAW_ENV_URL
    const response = await fetch(RAW_ENV_URL, { // This uses the VITE_GCP_POSTER_FUNCTION_URL directly
      method: 'POST',
      headers,
      body: JSON.stringify(promptData),
    });
    // ... rest of your response handling ...
    console.log("☁️ Cloud Function HTTP Response Status:", response.status, response.statusText);
    const responseData = await response.json(); // This might fail if response is not JSON (e.g. HTML for 404)
    console.log("☁️ Cloud Function Parsed Response Data:", responseData);

    if (!response.ok) {
      const errorInfo = responseData?.error || `Server error: ${response.status}. Actual URL called: ${RAW_ENV_URL}`;
      console.error("❌ Error received from Cloud Function:", errorInfo);
      throw new Error(errorInfo);
    }

    if (!responseData.imageUrl) {
      console.error("❌ Response from Cloud Function is OK, but missing imageUrl:", responseData);
      throw new Error("Invalid response from poster service: imageUrl is missing.");
    }
    return responseData;

  } catch (error) {
    console.error(`❌ Network/Parsing Error for URL ${RAW_ENV_URL}:`, error);
    throw new Error(error.message || `Network error for ${RAW_ENV_URL}`);
  }
};