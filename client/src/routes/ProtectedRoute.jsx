import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useRoles } from "../context/RoleContext";
import LoadingScreen from "../components/common/LoadingScreen";
import ErrorState from "../components/common/ErrorState";

export default function ProtectedRoute({ children, allowedRoles }) {
  const { isAuthenticated, loading } = useAuth();
  const { hasAnyRole } = useRoles();
  const location = useLocation();

  if (loading) {
    return <LoadingScreen message="Verifying session credentials..." />;
  }

  if (!isAuthenticated) {
    // Redirect to login, storing original location to return later
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  if (allowedRoles && !hasAnyRole(allowedRoles)) {
    // Authenticated but does not possess the correct permission level
    return (
      <div className="flex h-screen w-screen items-center justify-center p-6 bg-bg-base">
        <ErrorState
          title="Access Denied"
          message="Your account credentials do not grant authorization to view this resource. Contact your system admin if you believe this is in error."
          actionText="Return to Safety"
          onAction={() => window.history.back()}
        />
      </div>
    );
  }

  return children;
}
