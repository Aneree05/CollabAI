import { Server } from "socket.io";

let io;

export const initSocket = (server) => {
  io = new Server(server, {
    cors: {
      origin: "http://localhost:5173",
      methods: ["GET", "POST"],
    },
  });

  io.on("connection", (socket) => {
    console.log(`User Connected: ${socket.id}`);

    socket.on("joinProject", (projectId) => {
      socket.join(projectId);
      console.log(`${socket.id} joined project ${projectId}`);
    });

    socket.on("disconnect", () => {
      console.log(`User Disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = () => {
  if (!io) {
    throw new Error("Socket.IO not initialized.");
  }

  return io;
};