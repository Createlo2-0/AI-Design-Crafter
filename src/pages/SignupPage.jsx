import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { playClickSound, playErrorSound } from "../utils/soundUtils";

function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { signup } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();

    if (password !== confirmPassword) {
      playErrorSound();
      setError("Error: Passcodes do not compute. Re-verify.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      await signup(email, password);
      navigate("/generate");
    } catch (err) {
      playErrorSound();
      let message = "Failed to create account. System error.";
      if (err.code) {
        switch (err.code) {
          case "auth/email-already-in-use":
            message =
              "Error: Email already registered. Proceed to login or use different credentials.";
            break;
          case "auth/weak-password":
            message =
              "Error: Password too weak. Enhance security parameters (min 6 characters).";
            break;
          case "auth/invalid-email":
            message = "Error: Invalid Email ID.";
            break;
          default:
            message = `Error: ${err.code
              .replace("auth/", "")
              .replace(/-/g, " ")}`;
        }
      } else if (err.message) {
        message = err.message;
      }
      setError(message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="max-w-md mx-auto mt-10 bg-cyber-primary/90 backdrop-blur-md p-6 sm:p-8 shadow-neon-sm-blue border border-cyber-border/50 rounded-sm"
    >
      <h2 className="text-3xl font-cyber mb-6 text-center text-neon-blue uppercase">
        Registration
      </h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        {error && (
          <motion.p
            className="mb-2 text-red-300 bg-red-900/50 border border-red-500 p-3 text-xs font-mono text-center rounded-sm"
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
          >
            {error}
          </motion.p>
        )}
        <div>
          <label
            htmlFor="email"
            className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
          >
            Email
          </label>
          <input
            id="email"
            type="email"
            placeholder="id@domain.corp"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={loading}
            className="w-full py-2 px-3 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-none shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent placeholder-gray-500 transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="password"
            className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
          >
            Password
          </label>
          <input
            id="password"
            type="password"
            placeholder="Min. 6 Characters"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full py-2 px-3 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-none shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent placeholder-gray-500 transition-all"
          />
        </div>
        <div>
          <label
            htmlFor="confirm-password"
            className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
          >
            Confirm Password
          </label>
          <input
            id="confirm-password"
            type="password"
            placeholder="Retype Access Code"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full py-2 px-3 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-none shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-neon-blue focus:border-transparent placeholder-gray-500 transition-all"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full bg-neon-blue hover:bg-transparent text-cyber-bg-darker hover:text-neon-blue font-bold py-2 px-4 border-2 border-neon-blue rounded-sm focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out ${
            loading
              ? "opacity-50 cursor-not-allowed animate-pulse"
              : "hover:shadow-neon-sm-blue"
          }`}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
        >
          {loading ? "REGISTERING USER..." : "Signup"}
        </motion.button>
        <p className="text-center text-cyber-border text-xs font-mono mt-6">
          Existing Agent? &gt;&gt;&gt;{" "}
          <Link
            to="/login"
            className="text-neon-pink hover:text-white font-bold"
          >
            Login
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

export default SignupPage;
