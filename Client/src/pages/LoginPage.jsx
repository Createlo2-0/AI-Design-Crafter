import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { playClickSound, playErrorSound } from "../utils/soundUtils";
import Button from "../components/Common/Button";

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
            message =
              "Error: Access temporarily disabled [Too many attempts]. Try again later.";
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
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0 }}
      className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl p-8 w-full max-w-md mx-auto"
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
          backgroundImage:
            "linear-gradient(90deg, #ff00ff, #00ffff, #00ff00, #ff00ff)",
          backgroundSize: "400% 400%",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMask:
            "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "exclude",
          WebkitMaskComposite: "destination-out",
          boxShadow: "0px 30px 30px #00ffff",
          pointerEvents: "none",
        }}
      />

      <h2 className="text-3xl font-cyber text-center text-neon-blue mb-6 uppercase">
        Sign In
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
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Enter your email"
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-neon-pink placeholder-gray-500"
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
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Enter your password"
            required
            disabled={loading}
            className="w-full px-3 py-2 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-sm shadow-inner focus:outline-none focus:ring-2 focus:ring-neon-pink placeholder-gray-500"
          />
        </div>

        <Button
          type="submit"
          disabled={loading}
          variant="primary"
          size="large"
          className="w-full font-bold"
        >
          {loading ? "Signing in..." : "Sign In"}
        </Button>

        <div className="flex flex-col gap-2 mt-6">
          <p className="text-center text-cyber-border text-base font-mono">
            New User Registration &gt;&gt;&gt;{" "}
            <Link
              to="/signup"
              className="text-neon-pink hover:text-white font-bold"
            >
              Signup
            </Link>
          </p>
        </div>
      </form>
    </motion.div>
  );
}

export default LoginPage;
