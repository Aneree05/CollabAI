import axios from "axios";
import { QueryClient } from "@tanstack/react-query";

// Base URL configuration - pointing to existing backend API base
const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

export const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request Interceptor: Attach JWT Bearer Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("collabai_token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor: Handle Token Expirations or Global Errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Clear local storage on unauthorized
      localStorage.removeItem("collabai_token");
      localStorage.removeItem("collabai_user");
      
      // Auto-reload to clear context states if needed, or route guards will catch it
      if (!window.location.pathname.startsWith("/login") && !window.location.pathname.startsWith("/register")) {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

// Create the unified TanStack QueryClient with premium default parameters
export const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false, // Prevents distracting refreshes in production
      retry: 1,                    // Limit retries on failures to prevent server spam
      staleTime: 5 * 60 * 1000,     // Consider data fresh for 5 minutes
      gcTime: 10 * 60 * 1000,      // Garbage collection time (formerly cacheTime)
    },
  },
});
