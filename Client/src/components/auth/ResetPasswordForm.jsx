// E:\Createlo\AI-Design-Crafter\src\components\Auth\ResetPasswordForm.jsx
import React, { useState } from "react";
import { sendPasswordResetEmail } from "firebase/auth";
import { auth } from "@/firebase";
import TextInput from "../UI/TextInput";

const ResetPasswordForm = () => {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await sendPasswordResetEmail(auth, email);
      setSent(true);
    } catch (err) {
      setError("Unable to send reset email. Please check the email address.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <TextInput
        label="Email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />

      {error && <p className="text-red-500 text-sm">{error}</p>}
      {sent && <p className="text-green-600 text-sm">Password reset email sent!</p>}

      <button
        type="submit"
        className="w-full bg-black text-white py-2 rounded-md hover:bg-gray-800 disabled:opacity-50"
        disabled={loading}
      >
        {loading ? "Sending..." : "Send Reset Link"}
      </button>
    </form>
  );
};

export default ResetPasswordForm;
