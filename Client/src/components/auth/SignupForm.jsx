import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import SignupForm from "../components/Auth/SignupForm";

function SignupPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0 }}
      className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl p-8 w-full max-w-md mx-auto"
    >
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
        Sign Up
      </h2>

      <SignupForm />

      <div className="flex flex-col gap-2 mt-6">
        <p className="text-center text-cyber-border text-base font-mono">
          Already have an account? &gt;&gt;&gt;{" "}
          <Link
            to="/login"
            className="text-neon-pink hover:text-white font-bold"
          >
            Login
          </Link>
        </p>
      </div>
    </motion.div>
  );
}

export default SignupPage;
