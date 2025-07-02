import React, { useState, useEffect } from "react";
import {
  auth,
  RecaptchaVerifier,
  signInWithPhoneNumber,
} from "../../firebase/firebase";
import Button from "../Common/Button";
import TextInput from "../Forms/TextInput";

const PhoneAuth = () => {
  const [phone, setPhone] = useState("");
  const [otp, setOtp] = useState("");
  const [confirmationResult, setConfirmationResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Initialize reCAPTCHA once
  useEffect(() => {
    if (!window.recaptchaVerifier) {
      window.recaptchaVerifier = new RecaptchaVerifier(
        "recaptcha-container",
        {
          size: "invisible",
          callback: () => {
            console.log("reCAPTCHA solved");
          },
        },
        auth
      );
    }
  }, []);

  const sendOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!phone) return setError("Please enter your phone number.");

    setLoading(true);
    try {
      const appVerifier = window.recaptchaVerifier;
      const confirmation = await signInWithPhoneNumber(auth, phone, appVerifier);
      setConfirmationResult(confirmation);
      setSuccess("OTP sent! Please check your phone.");
      setStep(2);
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  const verifyOtp = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!otp) return setError("Please enter the OTP.");

    setLoading(true);
    try {
      const res = await confirmationResult.confirm(otp);
      const idToken = await res.user.getIdToken();

      const response = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Login failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      setSuccess("Login successful! Redirecting...");
      setTimeout(() => (window.location.href = "/profile"), 1000);
    } catch (err) {
      setError(err.message);
    }

    setLoading(false);
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-primary/10 to-white px-2">
      <div className="w-full max-w-md bg-white/5 backdrop-blur-lg border-2 border-primary rounded-xl shadow-lg p-8 space-y-6">
        <h2 className="text-2xl font-bold text-center text-primary mb-2">
          Login with Phone
        </h2>

        <form onSubmit={step === 1 ? sendOtp : verifyOtp} className="space-y-4">
          <TextInput
            label="Phone Number"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            required
            disabled={step === 2}
            placeholder="+91xxxxxxxxxx"
          />

          {step === 2 && (
            <TextInput
              label="OTP"
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              placeholder="Enter OTP"
            />
          )}

          {error && <p className="text-red-500 text-sm text-center">{error}</p>}
          {success && (
            <p className="text-green-500 text-sm text-center">{success}</p>
          )}

          <Button
            type="submit"
            className="w-full bg-white/5 backdrop-blur-lg border-2 border-primary text-white px-4 py-3"
            disabled={loading}
          >
            {loading
              ? "Processing..."
              : step === 1
              ? "Send OTP"
              : "Verify OTP & Login"}
          </Button>
        </form>

        <div className="text-center mt-2">
          <a
            href="/login"
            className="text-primary underline text-sm hover:text-primary/80 transition"
          >
            Back to Login
          </a>
        </div>

        <div id="recaptcha-container"></div>
      </div>
    </div>
  );
};

export default PhoneAuth;
