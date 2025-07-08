import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const ConfirmLogoutModal = ({ open, onConfirm, onCancel }) => {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-[999] flex items-center justify-center bg-black/40 backdrop-blur-sm">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        className="bg-cyber-primary border-2 border-neon-blue rounded-xl shadow-2xl p-6 w-[90vw] max-w-xs sm:max-w-sm md:max-w-md text-center"
      >
        <h2 className="text-xl font-bold text-neon-blue mb-2">
          Confirm Logout
        </h2>
        <p className="mb-6 text-gray-300">Are you sure you want to logout?</p>
        <div className="flex justify-center gap-4">
          <button
            onClick={onCancel}
            className="px-5 py-1 rounded-full border-2 border-gray-400 text-gray-300 hover:bg-gray-700 transition"
          >
            No
          </button>
          <button
            onClick={onConfirm}
            className="px-5 py-1 rounded-full border-2 border-neon-yellow text-neon-yellow hover:bg-neon-yellow hover:text-cyber-primary transition font-bold"
          >
            Yes
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default function AdminHeader() {
  const [showLogoutModal, setShowLogoutModal] = useState(false);

  const currentUser = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <>
      <header className="flex items-center sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-2 border-b border-cyber-border/40 bg-cyber-bg/80">
        <h1 className="font-cyber pt-2 text-neon-blue text-2xl text-center sm:text-left">
          Admin Dashboard
        </h1>
        <div className="flex items-center justify-center sm:justify-end gap-4">
          <span className="font-mono text-neon-green break-all text-sm sm:text-base">
            {currentUser?.email || "admin"}
          </span>
          <button
            onClick={() => setShowLogoutModal(true)}
            className="bg-neon-pink text-white font-mono px-3 py-1 rounded shadow hover:bg-neon-blue hover:text-cyber-bg transition-colors duration-200"
          >
            Logout
          </button>
        </div>
      </header>
      <ConfirmLogoutModal
        open={showLogoutModal}
        onConfirm={() => {
          setShowLogoutModal(false);
          logout();
        }}
        onCancel={() => setShowLogoutModal(false)}
      />
    </>
  );
}
