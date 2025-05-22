import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { playClickSound, playErrorSound } from "../utils/soundUtils";
import TextInput from "../components/Forms/TextInput";  // <-- Import here

function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    playClickSound();
    setError("");
    setLoading(true);

    try {
      await login(email, password);
      navigate("/generate");
    } catch (err) {
      playErrorSound();
      let message = "Failed to log in. Check credentials.";

      if (err.code) {
        switch (err.code) {
          case "auth/user-not-found":
          case "auth/wrong-password":
          case "auth/invalid-credential":
            message = "Error: Invalid Email or Password.";
            break;
          case "auth/too-many-requests":
            message = "Error: Access temporarily disabled [Too many attempts]. Try again later.";
            break;
          default:
            message = `Error: ${err.code.replace("auth/", "").replace(/-/g, " ")}`;
        }
      } else if (err.message) {
        message = err.message;
      }

      setError(message);
    } finally {
      setLoading(false);
    }
  };

  // Determine error messages for inputs if applicable
  const emailError = error.toLowerCase().includes("email") ? error : "";
  const passwordError = error.toLowerCase().includes("password") ? error : "";

  return (
    <div className="flex items-center justify-center px-4 py-12 sm:px-6 lg:px-8">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.3 }}
        className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl 
                   p-4 sm:p-6 md:p-8 w-full max-w-xs sm:max-w-sm md:max-w-md"
      >
        {/* Animated Gradient Border */}
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
          transition={{
            repeat: Infinity,
            duration: 4,
            ease: "linear",
          }}
          style={{
            backgroundImage: "linear-gradient(90deg, #ff00ff, #00ffff, #00ff00, #ff00ff)",
            backgroundSize: "400% 400%",
            mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
            maskComposite: "exclude",
            WebkitMaskComposite: "destination-out",
            boxShadow: "0px 30px 30px #00ffff",
            pointerEvents: "none",
          }}
        />

        <h2 className="text-2xl sm:text-3xl font-cyber text-center text-neon-blue mb-4 sm:mb-6 uppercase">
          LogIn
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

          {/* Email Input */}
          <TextInput
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            label="Email"
            error={emailError}
          />

          {/* Password Input */}
          <TextInput
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            label="Password"
            error={passwordError}
          />

          {/* Submit Button */}
          <motion.button
            type="submit"
            disabled={loading}
            className={`w-full bg-transparent border-2 border-neon-blue text-neon-blue font-bold py-2 px-4 rounded-sm transition-all duration-300 ease-in-out text-sm sm:text-base ${
              loading
                ? "opacity-50 cursor-not-allowed animate-pulse"
                : "hover:bg-neon-blue hover:text-cyber-bg hover:shadow-neon-md-blue"
            }`}
            whileHover={!loading ? { scale: 1.03 } : {}}
            whileTap={!loading ? { scale: 0.97 } : {}}
          >
            {loading ? "Signing in..." : "Sign In"}
          </motion.button>

          {/* Redirect to Signup */}
          <p className="text-center text-cyber-border text-sm sm:text-base font-mono mt-6">
            New User Registration &gt;&gt;&gt;{" "}
            <Link to="/signup" className="text-neon-pink hover:text-white font-bold">
              Signup
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default LoginPage;
