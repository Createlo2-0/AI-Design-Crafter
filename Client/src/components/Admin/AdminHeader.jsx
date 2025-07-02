import React from "react";

export default function AdminHeader() {
  // Get user from localStorage (set after login)
  const currentUser = JSON.parse(localStorage.getItem("user"));

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("role");
    window.location.href = "/login";
  };

  return (
    <header className="flex items-center sm:flex-row sm:items-center sm:justify-between gap-4 px-4 py-2 border-b border-cyber-border/40 bg-cyber-bg/80">
      <h1 className="font-cyber pt-2 text-neon-blue text-2xl text-center sm:text-left">
        Admin Dashboard
      </h1>
      <div className="flex items-center justify-center sm:justify-end gap-4">
        <span className="font-mono text-neon-green break-all text-sm sm:text-base">
          {currentUser?.email || "admin"}
        </span>
        <button
          onClick={logout}
          className="bg-neon-pink text-white font-mono px-3 py-1 rounded shadow hover:bg-neon-blue hover:text-cyber-bg transition-colors duration-200"
        >
          Logout
        </button>
      </div>
    </header>
  );
}
