import React, { useState } from "react";
import TextInput from "../Forms/TextInput";
import Button from "../Common/Button";
import API_BASE_URL from "../../utils/api";
import { auth, googleProvider } from "../../firebase/firebase";
import { createUserWithEmailAndPassword, signInWithPopup } from "firebase/auth";

const SignupForm = () => {
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) =>
    setForm((prev) => ({ ...prev, [field]: value }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!form.email || !form.password || !form.confirmPassword)
      return setError("All fields are required.");
    if (form.password !== form.confirmPassword)
      return setError("Passwords do not match.");

    setLoading(true);
    try {
      const res = await createUserWithEmailAndPassword(
        auth,
        form.email,
        form.password
      );
      const idToken = await res.user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/signup`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Signup failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      if (err.code === "auth/email-already-in-use") {
        setError("This email is already registered. Please log in.");
      } else {
        setError(err.message);
      }
    }
    setLoading(false);
  };

  const handleGoogleSignup = async () => {
    setError("");
    try {
      const res = await signInWithPopup(auth, googleProvider);
      const idToken = await res.user.getIdToken();

      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${idToken}`,
        },
        body: JSON.stringify({ idToken }),
      });

      const data = await response.json();
      if (!response.ok) throw new Error(data.error || "Google signup failed");

      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("role", data.user.role);
      if (data.user.role === "admin") {
        window.location.href = "/admin";
      } else {
        window.location.href = "/profile";
      }
    } catch (err) {
      setError(err.message);
    }
  };

  const handlePhoneSignup = () => {
    window.location.href = "/login/phone";
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSubmit} className="space-y-4">
        <TextInput
          label="Email"
          type="email"
          value={form.email}
          onChange={(e) => handleChange("email", e.target.value)}
          required
        />
        <TextInput
          label="Password"
          type="password"
          value={form.password}
          onChange={(e) => handleChange("password", e.target.value)}
          required
        />
        <TextInput
          label="Confirm Password"
          type="password"
          value={form.confirmPassword}
          onChange={(e) => handleChange("confirmPassword", e.target.value)}
          required
        />
        {error && <p className="text-red-500 text-sm">{error}</p>}
        <Button
          type="submit"
          className="w-full text-gray-800 disabled:opacity-50"
          disabled={loading}
        >
          {loading ? "Signing up..." : "Sign Up"}
        </Button>
      </form>

      <div className="flex flex-col gap-2 mt-4">
        <Button
          type="button"
          className="w-full bg-white/5 backdrop-blur-lg border-2 border-primary text-white px-4 py-3 transition-all duration-300 flex items-center justify-center gap-2"
          onClick={handleGoogleSignup}
        >
          <img
            src="https://www.svgrepo.com/show/475656/google-color.svg"
            alt="Google"
            className="w-5 h-5"
          />
          Sign up with Google
        </Button>
      </div>
    </div>
  );
};

export default SignupForm;
