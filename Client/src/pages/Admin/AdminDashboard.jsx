import React from "react";
import { Routes, Route } from "react-router-dom";
import AdminSidebar from "../../components/Admin/AdminSidebar";
import AdminHeader from "../../components/Admin/AdminHeader";
import UserManagement from "./UserManagement";
import AssetManagement from "./AssetManagement";
import DashboardHome from "./DashboardHome";

export default function AdminDashboard() {
  return (
    <div className="flex min-h-screen bg-gradient-to-r from-slate-900 to-slate-700 border border-cyber-border">
      <AdminSidebar />
      <div className="flex-1 flex flex-col min-w-0">
        <AdminHeader />
        <main className="flex-1 w-full max-w-7xl mx-auto px-2 sm:px-6 py-8">
          <Routes>
            <Route index element={<DashboardHome />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="assets" element={<AssetManagement />} />
          </Routes>
        </main>
      </div>
    </div>
  );
}
