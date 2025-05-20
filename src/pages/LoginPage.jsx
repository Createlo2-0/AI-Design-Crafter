import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { motion } from "framer-motion";
import { playClickSound, playErrorSound } from "../utils/soundUtils";

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

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.96 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0.4 }}
      className="mx-auto mt-10 bg-cyber-primary/90 backdrop-blur-md p-6 sm:p-8 shadow-neon-sm-blue border border-cyber-border/50 rounded-sm"
    >
      <h2 className="text-3xl font-cyber mb-6 text-center text-neon-pink uppercase">
        Login
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
            className="w-full py-2 px-3 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-none shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent placeholder-gray-500 transition-all"
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
            placeholder="************"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={loading}
            className="w-full py-2 px-3 bg-cyber-bg text-gray-200 font-mono border border-cyber-border rounded-none shadow-inner leading-tight focus:outline-none focus:ring-2 focus:ring-neon-pink focus:border-transparent placeholder-gray-500 transition-all"
          />
        </div>
        <motion.button
          type="submit"
          disabled={loading}
          className={`w-full bg-transparent hover:bg-neon-pink text-neon-pink hover:text-cyber-bg font-bold py-2 px-4 border-2 border-neon-pink rounded-sm focus:outline-none focus:shadow-outline transition-all duration-300 ease-in-out ${
            loading
              ? "opacity-50 cursor-not-allowed animate-pulse"
              : "hover:shadow-neon-md-pink"
          }`}
          whileHover={!loading ? { scale: 1.03 } : {}}
          whileTap={!loading ? { scale: 0.97 } : {}}
        >
          {loading ? "AUTHENTICATING..." : "Login"}
        </motion.button>
        <p className="text-center text-cyber-border text-xs font-mono mt-6">
          New User Registration &gt;&gt;&gt;{" "}
          <Link
            to="/signup"
            className="text-neon-green hover:text-white font-bold"
          >
            Signup
          </Link>
        </p>
      </form>
    </motion.div>
  );
}

export default LoginPage;