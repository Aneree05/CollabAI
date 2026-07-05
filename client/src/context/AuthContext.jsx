import React, { createContext, useContext, useState, useEffect } from "react";
import { api } from "../services/api";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const stored = localStorage.getItem("collabai_user");
    return stored ? JSON.parse(stored) : null;
  });
  const [token, setToken] = useState(() => localStorage.getItem("collabai_token"));
  const [loading, setLoading] = useState(true);

  // Synchronize token and user profile on initial load
  useEffect(() => {
    const verifySession = async () => {
      const storedToken = localStorage.getItem("collabai_token");
      if (storedToken) {
        try {
           // Fetch fresh user profile from the server
           const response = await api.get("/profile");
           const freshUser = response.data.user || response.data;
           setUser(freshUser);
           localStorage.setItem("collabai_user", JSON.stringify(freshUser));
        } catch (error) {
          console.error("Session verification failed, logging out.", error);
          // Token is expired or invalid
          localStorage.removeItem("collabai_token");
          localStorage.removeItem("collabai_user");
          setToken(null);
          setUser(null);
        }
      }
      setLoading(false);
    };

    verifySession();
  }, []);

  // Login handler
  const login = async (email, password) => {
    try {
      const response = await api.post("/auth/login", { email, password });
      const { token: receivedToken, user: loggedUser } = response.data;
      
      localStorage.setItem("collabai_token", receivedToken);
      localStorage.setItem("collabai_user", JSON.stringify(loggedUser));
      
      setToken(receivedToken);
      setUser(loggedUser);
      return loggedUser;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Register handler
  const register = async (userData) => {
    try {
      const response = await api.post("/auth/register", userData);
      return response.data;
    } catch (error) {
      throw error.response?.data || error;
    }
  };

  // Logout handler
  const logout = () => {
    localStorage.removeItem("collabai_token");
    localStorage.removeItem("collabai_user");
    setToken(null);
    setUser(null);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        loading,
        login,
        register,
        logout,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
