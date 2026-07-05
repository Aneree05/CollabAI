import React, { createContext, useContext } from "react";
import { useAuth } from "./AuthContext";

const RoleContext = createContext();

export function RoleProvider({ children }) {
  const { user } = useAuth();
  
  // Checks if the user has a specific role
  const hasRole = (role) => {
    if (!user || !user.roles) return false;
    return user.roles.includes(role);
  };

  // Checks if the user has any of the specified roles
  const hasAnyRole = (rolesList = []) => {
    if (!user || !user.roles) return false;
    return rolesList.some((role) => user.roles.includes(role));
  };

  // Check individual common roles for ease of access
  const isClient = hasRole("client");
  const isFreelancer = hasRole("freelancer");
  const isAgency = hasRole("agency");
  const isAdmin = hasRole("admin");

  return (
    <RoleContext.Provider
      value={{
        hasRole,
        hasAnyRole,
        isClient,
        isFreelancer,
        isAgency,
        isAdmin,
        userRoles: user?.roles || [],
      }}
    >
      {children}
    </RoleContext.Provider>
  );
}

export function useRoles() {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error("useRoles must be used within a RoleProvider");
  }
  return context;
}
