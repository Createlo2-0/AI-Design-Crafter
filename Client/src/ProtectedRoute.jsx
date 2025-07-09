import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children, requiredRole }) => {
  const user = JSON.parse(localStorage.getItem("user"));
  const role = user?.role;

  if (!user) return <Navigate to="/login" replace />;
  if (requiredRole && role !== requiredRole) {
    return requiredRole === "admin" ? (
      <Navigate to="/profile" replace />
    ) : (
      <Navigate to="/" replace />
    );
  }
  return children;
};

export default ProtectedRoute;
