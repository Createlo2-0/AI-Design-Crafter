import React, { useState } from "react";
import TextInput from "../components/Forms/TextInput";
import Button from "../components/Common/Button";
import API_BASE_URL from "../utils/api";
import axios from "axios";

const ResetPasswordPage = () => {
  const [form, setForm] = useState({ email: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    if (!form.email) {
      setError("Email is required.");
      return;
    }
    setLoading(true);
    try {
      const response = await axios.post(
        `${API_BASE_URL}/auth/forgot-password`,
        { email: form.email },
        { headers: { "Content-Type": "application/json" } }
      );
      setSuccess(
        response.data.message ||
          "If this email is registered, a password reset link has been sent."
      );
    } catch (err) {
      if (err.response && err.response.data && err.response.data.error) {
        setError(err.response.data.error);
      } else {
        setError(err.message || "Reset failed");
      }
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-cyber-bg-darker/90 via-cyber-bg/80 to-cyber-bg/60">
      <div className="w-full max-w-md bg-cyber-bg/80 rounded-lg shadow-2xl border-2 border-neon-green p-8">
        <h2 className="text-3xl font-cyber text-center text-neon-green mb-8 tracking-wider uppercase">
          Reset Password
        </h2>
        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <TextInput
              label="Email"
              type="email"
              value={form.email}
              onChange={(e) => handleChange("email", e.target.value)}
              required
              className="w-full"
            />
          </div>
          {error && <p className="text-red-500 text-sm">{error}</p>}
          {success && <p className="text-green-500 text-sm">{success}</p>}
          <Button
            type="submit"
            className="w-full bg-neon-blue text-cyber-bg-darker font-bold py-2 px-6 border-2 border-neon-blue hover:bg-transparent hover:text-neon-blue transition-all duration-300 ease-in-out rounded-sm text-lg"
            disabled={loading}
          >
            {loading ? "Sending..." : "Send Reset Link"}
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordPage;
