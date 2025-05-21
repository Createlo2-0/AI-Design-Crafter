// src/utils/soundUtils.js

// Master volume control (0.0 to 1.0) - Adjust this to globally control sound effect volume
const MASTER_VOLUME = 0.6; // Example: 60% volume

const playSound = (soundFile, volume = 0.5) => {
  // Basic check if Audio API is available
  if (typeof Audio === "undefined") {
    console.warn("Audio API not available in this environment.");
    return;
  }

  try {
    // Assumes sound files are in the /public/sounds/ directory
    const audio = new Audio(`/sounds/${soundFile}`);
    // Apply master volume and specific volume, clamped between 0 and 1
    audio.volume = Math.max(0, Math.min(1, volume * MASTER_VOLUME));

    // Play the sound
    // Modern browsers return a Promise from play(), which can be rejected
    // if the user hasn't interacted with the page yet.
    const playPromise = audio.play();
    if (playPromise !== undefined) {
      playPromise.catch(error => {
        // Autoplay was prevented. This is common before user interaction.
        // Don't spam console for common interaction errors like NotAllowedError.
        if (error.name !== 'NotAllowedError' && error.name !== 'AbortError') {
          console.error(`Error playing sound ${soundFile}:`, error);
        }
      });
    }
  } catch (e) {
    console.error(`Could not create or play sound ${soundFile}:`, e);
  }
};

// --- Specific Sound Functions ---
// IMPORTANT: Replace 'your_click_sound.mp3', etc., with your actual sound file names!
// It's good practice to use consistent naming or have a small set of versatile sounds.

export const playClickSound = () => playSound('ui_click_1.mp3', 0.7);        // General UI click
export const playToggleSound = () => playSound('ui_toggle_1.mp3', 0.6);     // For toggles, accordions
export const playGenerateSound = () => playSound('generate_start_1.mp3', 0.8); // Starting generation
export const playModalOpenSound = () => playSound('modal_open_1.mp3', 0.7);   // Opening modal
export const playModalCloseSound = () => playSound('modal_close_1.mp3', 0.7); // Closing modal
export const playErrorSound = () => playSound('error_beep_1.mp3', 0.8);       // Error message appears
export const playSuccessSound = () => playSound('save_success_1.mp3', 0.8);   // E.g., "Save to Archive" success
// Add more as needed, e.g., playHoverSound (though use sparingly)