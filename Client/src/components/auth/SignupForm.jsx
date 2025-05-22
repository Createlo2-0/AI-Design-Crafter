import React, { useState } from "react";
import TextInput from "../components/Forms/TextInput";
import SelectInput from "../components/Forms/SelectInput";
import CheckboxInput from "../components/Forms/CheckboxInput";

function SignupForm() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // example dropdown
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [error, setError] = useState("");

  const roles = [
    { value: "user", label: "User" },
    { value: "admin", label: "Admin" },
  ];

  const handleSubmit = (e) => {
    e.preventDefault();
    // Your signup logic
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <TextInput
        label="Email"
        id="signup-email"
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Enter your email"
        error={error}
      />

      <TextInput
        label="Password"
        id="signup-password"
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Enter your password"
        error={error}
      />

      <SelectInput
        label="Role"
        id="signup-role"
        value={role}
        onChange={(e) => setRole(e.target.value)}
        options={roles}
        error={error}
      />

      <CheckboxInput
        id="terms"
        checked={termsAccepted}
        onChange={(e) => setTermsAccepted(e.target.checked)}
        label="I accept the terms and conditions"
        error={error}
      />

      <button
        type="submit"
        className="w-full bg-neon-pink text-cyber-bg py-2 rounded-sm font-bold"
      >
        Sign Up
      </button>
    </form>
  );
}

export default SignupForm;
