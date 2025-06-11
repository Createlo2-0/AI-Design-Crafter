import React, { useState } from "react";
<<<<<<< HEAD
import { useNavigate } from "react-router-dom";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../services/firebase";
=======
>>>>>>> e123ec11d746b1c2884e39586c1cd9f139a68477
import TextInput from "../Forms/TextInput";
import Button from "../Common/Button";

const SignupForm = () => {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setLoading(true);
<<<<<<< HEAD

    try {
      await createUserWithEmailAndPassword(auth, form.email, form.password);
      navigate("/"); // redirect to homepage
    } catch (err) {
      setError("Signup failed. Please try again.");
    } finally {
      setLoading(false);
    }
=======
    // Signup logic goes here
    setLoading(false);
>>>>>>> e123ec11d746b1c2884e39586c1cd9f139a68477
  };

  return (
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
  );
};

export default SignupForm;
