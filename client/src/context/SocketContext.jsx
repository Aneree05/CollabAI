import React, { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";
import socket from "../socket/socket";

const SocketContext = createContext();

export function SocketProvider({ children }) {
  const { isAuthenticated, user } = useAuth();
  const [isConnected, setIsConnected] = useState(socket.connected);

  useEffect(() => {
    if (isAuthenticated && user) {
      // Connect to Socket.IO backend
      socket.connect();

      const onConnect = () => {
        setIsConnected(true);
        console.log("Socket.IO client connected:", socket.id);
      };

      const onDisconnect = () => {
        setIsConnected(false);
        console.log("Socket.IO client disconnected");
      };

      socket.on("connect", onConnect);
      socket.on("disconnect", onDisconnect);

      // Clean up event listeners and connection when state updates or unmounts
      return () => {
        socket.off("connect", onConnect);
        socket.off("disconnect", onDisconnect);
        socket.disconnect();
      };
    } else {
      socket.disconnect();
      setIsConnected(false);
    }
  }, [isAuthenticated, user]);

  // Join a specific project channel
  const joinProject = (projectId) => {
    if (socket.connected) {
      socket.emit("joinProject", projectId);
    }
  };

  return (
    <SocketContext.Provider value={{ socket, isConnected, joinProject }}>
      {children}
    </SocketContext.Provider>
  );
}

export function useSocket() {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
}
