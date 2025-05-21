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
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Animated Border */}
        <motion.div
          className="absolute inset-0 z-0 rounded-tl-3xl rounded-br-3xl border-4 border-transparent"
          animate={{
            backgroundPosition: [
              "0% 0%",
              "100% 0%",
              "100% 100%",
              "0% 100%",
              "0% 0%",
            ],
          }}
          transition={{ repeat: Infinity, duration: 4, ease: "linear" }}
          style={{
            backgroundImage:
              "linear-gradient(90deg, #00ffff, #ff00ff, #00ff00, #00ffff)",
            backgroundSize: "400% 400%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask:
              "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "destination-out",
            boxShadow: "0px 30px 30px #ff00ff",
            pointerEvents: "none",
          }}
        />

        {/* Title */}
        <h2 className="text-3xl font-cyber mb-6 text-center text-neon-blue uppercase">
          Sign Up
        </h2>

        {/* Form */}
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

          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-neon-blue placeholder-gray-500"
            />
          </div>

          {/* Password */}
          <div>
            <label
              htmlFor="password"
              className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter a strong password"
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-neon-blue placeholder-gray-500"
            />
          </div>

          {/* Confirm Password */}
          <div>
            <label
              htmlFor="confirmPassword"
              className="block text-neon-green text-sm font-bold mb-1 tracking-wide"
            >
              Confirm Password
            </label>
            <input
              type="password"
              id="confirmPassword"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="Retype your password"
              required
              disabled={loading}
              className="w-full px-3 py-2 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-neon-blue placeholder-gray-500"
            />
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full bg-transparent border-2 border-neon-blue text-neon-blue font-bold py-2 px-4 rounded-sm transition-all duration-300 ease-in-out ${
              loading
                ? "opacity-50 cursor-not-allowed animate-pulse"
                : "hover:bg-neon-blue hover:text-cyber-bg hover:shadow-neon-md-blue"
            }`}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? "Signing up..." : "Sign Up"}
          </motion.button>

          {/* Sign In Link */}
          <p className="text-center text-cyber-border text-base font-mono mt-4">
            Already have an account?{" "}
            <Link
              to="/login"
              className="text-neon-pink hover:text-white font-bold"
            >
              Sign In
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default SignupPage;
