import React from "react";
import AdminStatsGraph from "../../components/Admin/AdminStatsGraph";
import QuickStatsCards from "../../components/Admin/QuickStatsCards";
import AdminTips from "../../components/Admin/Tips";

// Example quick stats (replace with real data as needed)
const quickStats = [
  {
    label: "Total Users",
    value: "1,245",
    color: "text-neon-blue",
    bg: "bg-cyber-bg-darker",
    icon: (
      <svg
        className="w-7 h-7 text-neon-blue"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M17 20h5v-2a4 4 0 0 0-3-3.87M9 20H4v-2a4 4 0 0 1 3-3.87m9-7a4 4 0 1 1-8 0 4 4 0 0 1 8 0z" />
      </svg>
    ),
  },
  {
    label: "Assets",
    value: "3,780",
    color: "text-neon-pink",
    bg: "bg-cyber-bg-darker",
    icon: (
      <svg
        className="w-7 h-7 text-neon-pink"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <path d="M3 7v10a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
        <path d="M16 3H8a2 2 0 0 0-2 2v2h12V5a2 2 0 0 0-2-2z" />
      </svg>
    ),
  },
  {
    label: "Active Sessions",
    value: "89",
    color: "text-neon-green",
    bg: "bg-cyber-bg-darker",
    icon: (
      <svg
        className="w-7 h-7 text-neon-green"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        viewBox="0 0 24 24"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 6v6l4 2" />
      </svg>
    ),
  },
];

export default function DashboardHome() {
  return (
    <div className="w-full">
      {/* Welcome */}
      <div className="mb-8 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-cyber text-2xl sm:text-3xl text-neon-blue mb-2">
            Welcome, Admin!
          </h2>
          <p className="font-mono text-gray-300">
            Manage users, assets, and monitor platform growth. All controls are
            available in the sidebar.
          </p>
        </div>
      </div>

      {/* Quick Stats */}
      <QuickStatsCards stats={quickStats} />

      {/* Graph Section */}
      <div className="bg-cyber-bg-darker rounded-xl shadow-lg p-6 mb-10 hover:shadow-xl transition-shadow duration-200">
        <AdminStatsGraph />
      </div>

      {/* Tips or Announcements */}
      <AdminTips />
    </div>
  );
}
