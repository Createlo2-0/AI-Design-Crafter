import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { playClickSound, playErrorSound } from "../../utils/soundUtils";
import {
  updatePassword,
  EmailAuthProvider,
  reauthenticateWithCredential,
} from "firebase/auth";
import TextInput from "../Forms/TextInput";
import Button from "../Common/Button";
import { useNavigate } from "react-router-dom";

const ResetPasswordForm = () => {
  const { currentUser } = useAuth();
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    playClickSound();

    if (newPassword !== confirmPassword) {
      playErrorSound();
      setMessage("Passwords do not match.");
      return;
    }

    setLoading(true);
    setMessage("");
    try {
      // Step 1: Reauthenticate
      const credential = EmailAuthProvider.credential(
        currentUser.email,
        currentPassword
      );
      await reauthenticateWithCredential(currentUser, credential);

      // Step 2: Update password
      await updatePassword(currentUser, newPassword);
      setMessage("Password successfully updated.");

      setTimeout(() => navigate("/profile"), 2000);
    } catch (error) {
      playErrorSound();
      setMessage(`Error: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handlePasswordUpdate} className="space-y-4">
      <TextInput
        type="password"
        label="Current Password"
        placeholder="Current Password"
        value={currentPassword}
        onChange={(e) => setCurrentPassword(e.target.value)}
        required
      />
      <TextInput
        type="password"
        label="New Password"
        placeholder="New Password"
        value={newPassword}
        onChange={(e) => setNewPassword(e.target.value)}
        required
      />
      <TextInput
        type="password"
        label="Confirm New Password"
        placeholder="Confirm New Password"
        value={confirmPassword}
        onChange={(e) => setConfirmPassword(e.target.value)}
        required
      />
      <Button
        type="submit"
        className="w-full"
        disabled={loading}
      >
        {loading ? "Updating..." : "UPDATE PASSWORD"}
      </Button>
      {message && (
        <p className="mt-4 text-sm text-center font-mono text-neon-pink">
          {message}
        </p>
      )}
    </form>
  );
};

export default ResetPasswordForm;
