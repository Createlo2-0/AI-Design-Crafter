import React, { useState } from "react";
import { useAuth } from "../contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { playClickSound, playErrorSound } from "../utils/soundUtils";
import { updatePassword, EmailAuthProvider, reauthenticateWithCredential } from "firebase/auth";

function ResetPasswordPage() {
  const { currentUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handlePasswordUpdate = async () => {
    playClickSound();

    if (newPassword !== confirmPassword) {
      playErrorSound();
      return setMessage("Passwords do not match.");
    }

    try {
      // ✅ Step 1: Reauthenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // ✅ Step 2: Update password
      await updatePassword(currentUser, newPassword);
      setMessage("Password successfully updated.");

      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      playErrorSound();
      setMessage(`Error: ${error.message}`);
    }
  };

  return (
    <div className="flex items-center justify-center p-6">
      <div className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-cyber text-neon-green mb-4">
          Reset Password
        </h2>
        <input
          type="password"
          placeholder="Current Password"
          value={currentPassword}
          onChange={(e) => setCurrentPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-cyber-border bg-cyber-bg-darker text-white rounded-sm"
        />
        <input
          type="password"
          placeholder="New Password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          className="w-full mb-3 px-4 py-2 border border-cyber-border bg-cyber-bg-darker text-white rounded-sm"
        />
        <input
          type="password"
          placeholder="Confirm New Password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          className="w-full mb-4 px-4 py-2 border border-cyber-border bg-cyber-bg-darker text-white rounded-sm"
        />
        <button
          onClick={handlePasswordUpdate}
          className="w-full text-black bg-neon-green hover:bg-transparent hover:text-neon-green border border-neon-green py-2 rounded-sm transition-all"
        >
          UPDATE PASSWORD
        </button>
        {message && (
          <p className="mt-4 text-sm text-center font-mono text-neon-pink">
            {message}
          </p>
        )}
      </div>
    </div>
  );
}

export default ResetPasswordPage;
