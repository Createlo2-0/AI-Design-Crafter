import React from "react";
import { motion } from "framer-motion";
import ResetPasswordForm from "../components/Auth/ResetPasswordForm";

function ResetPasswordPage() {
  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ duration: 0 }}
      className="flex items-center justify-center min-h-screen p-6"
    >
      <div className="relative bg-gray-900/80 backdrop-blur-md shadow-2xl rounded-tl-3xl rounded-br-3xl p-8 w-full max-w-md">
        <h2 className="text-2xl font-cyber text-neon-green mb-4 text-center uppercase">
          Reset Password
        </h2>
        <ResetPasswordForm />
      </div>
    </motion.div>
  );
}

export default ResetPasswordPage;