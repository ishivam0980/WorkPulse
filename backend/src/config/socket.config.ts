import { Server as SocketIOServer } from "socket.io";
import { Server as HTTPServer } from "http";
import { config } from "./app.config";

let io: SocketIOServer;

export const initializeSocket = (httpServer: HTTPServer) => {
  io = new SocketIOServer(httpServer, {
    cors: {
      origin: config.FRONTEND_ORIGIN,
      credentials: true,
    },
  });

  io.on("connection", (socket) => {
    console.log(`🔌 Client connected: ${socket.id}`);

    // Join workspace room
    socket.on("join-workspace", (workspaceId: string) => {
      socket.join(`workspace:${workspaceId}`);
      console.log(`📂 Socket ${socket.id} joined workspace: ${workspaceId}`);
    });

    // Leave workspace room
    socket.on("leave-workspace", (workspaceId: string) => {
      socket.leave(`workspace:${workspaceId}`);
      console.log(`📂 Socket ${socket.id} left workspace: ${workspaceId}`);
    });

    // Handle disconnection
    socket.on("disconnect", () => {
      console.log(`❌ Client disconnected: ${socket.id}`);
    });
  });

  return io;
};

export const getIO = (): SocketIOServer => {
  if (!io) {
    throw new Error("Socket.io not initialized!");
  }
  return io;
};

// Event emitters for different entities
export const emitTaskEvent = (
  workspaceId: string,
  event: "task:created" | "task:updated" | "task:deleted",
  data: unknown
) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};

export const emitProjectEvent = (
  workspaceId: string,
  event: "project:created" | "project:updated" | "project:deleted",
  data: unknown
) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};

export const emitMemberEvent = (
  workspaceId: string,
  event: "member:joined" | "member:left" | "member:role-changed",
  data: unknown
) => {
  if (io) {
    io.to(`workspace:${workspaceId}`).emit(event, data);
  }
};
