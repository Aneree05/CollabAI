import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import LoadingScreen from "../components/common/LoadingScreen";

export default function PublicRoute({ children }) {
  const { isAuthenticated, loading, user } = useAuth();

  if (loading) {
    return <LoadingScreen message="Restoring session..." />;
  }

  if (isAuthenticated) {
    // Already logged in, redirect dynamically by role
    if (user?.roles?.includes("admin")) {
      return <Navigate to="/dashboard/admin" replace />;
    }
    if (user?.roles?.includes("client")) {
      return <Navigate to="/dashboard/client" replace />;
    }
    if (user?.roles?.includes("freelancer") || user?.roles?.includes("agency")) {
      return <Navigate to="/marketplace/my-services" replace />;
    }
    return <Navigate to="/" replace />;
  }

  return children;
}
