import React, { useEffect, useState } from "react";
import AdminStatsGraph from "../../components/Admin/AdminStatsGraph";
import QuickStatsCards from "../../components/Admin/QuickStatsCards";
import AdminTips from "../../components/Admin/Tips";
import axios from "axios";
import API_BASE_URL from "../../utils/api";

export default function DashboardHome() {
  const [userCount, setUserCount] = useState("-");
  const [assetCount, setAssetCount] = useState("-");

  useEffect(() => {
    axios
      .get(`${API_BASE_URL}/users/ttc`)
      .then((res) => {
        // API returns { totalUsers: 2 }
        setUserCount(
          res.data && typeof res.data.totalUsers === "number"
            ? res.data.totalUsers
            : "-"
        );
      })
      .catch(() => setUserCount("-"));

    axios
      .get(`${API_BASE_URL}/posters/count/ttc`)
      .then((res) => {
        // API returns { totalPosters: 0 }
        setAssetCount(
          res.data && typeof res.data.totalPosters === "number"
            ? res.data.totalPosters
            : "-"
        );
      })
      .catch(() => setAssetCount("-"));
  }, []);

  const quickStats = [
    {
      label: "Total Users",
      value: userCount,
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
      value: assetCount,
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
  ];

  return (
    <div className="w-full space-y-8">
      {/* Welcome Header */}
      <section className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h2 className="font-cyber text-2xl sm:text-3xl text-neon-blue mb-2">
            Welcome, Admin!
          </h2>
          <p className="font-mono text-gray-300">
            Manage users, assets, and monitor platform growth. Use the sidebar
            to navigate.
          </p>
        </div>
      </section>

      {/* Quick Stats */}
      <section>
        <QuickStatsCards stats={quickStats} />
      </section>

      {/* Platform Growth Graph */}
      <section className="bg-cyber-bg-darker rounded-xl shadow-lg p-6 hover:shadow-xl transition-shadow duration-200">
        <AdminStatsGraph />
      </section>
      <section>
        <AdminTips />
      </section>
    </div>
  );
}