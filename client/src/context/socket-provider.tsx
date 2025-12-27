import React, { createContext, useContext, useEffect, useState, useCallback } from "react";
import { io, Socket } from "socket.io-client";
import { useAuthContext } from "./auth-provider";

const SOCKET_URL = import.meta.env.VITE_API_BASE_URL?.replace("/api", "") || "http://localhost:8000";

interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
  joinWorkspace: (workspaceId: string) => void;
  leaveWorkspace: (workspaceId: string) => void;
}

const SocketContext = createContext<SocketContextType | undefined>(undefined);

export const SocketProvider = ({ children }: { children: React.ReactNode }) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuthContext();

  useEffect(() => {
    if (!user) {
      // Disconnect if user logs out
      if (socket) {
        socket.disconnect();
        setSocket(null);
        setIsConnected(false);
      }
      return;
    }

    // Create socket connection
    const newSocket = io(SOCKET_URL, {
      withCredentials: true,
      transports: ["websocket", "polling"],
    });

    newSocket.on("connect", () => {
      console.log("🔌 Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
    });

    setSocket(newSocket);

    return () => {
      newSocket.disconnect();
    };
  }, [user]);

  const joinWorkspace = useCallback(
    (workspaceId: string) => {
      if (socket && isConnected) {
        socket.emit("join-workspace", workspaceId);
        console.log(`📂 Joined workspace room: ${workspaceId}`);
      }
    },
    [socket, isConnected]
  );

  const leaveWorkspace = useCallback(
    (workspaceId: string) => {
      if (socket && isConnected) {
        socket.emit("leave-workspace", workspaceId);
        console.log(`📂 Left workspace room: ${workspaceId}`);
      }
    },
    [socket, isConnected]
  );

  return (
    <SocketContext.Provider
      value={{ socket, isConnected, joinWorkspace, leaveWorkspace }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (context === undefined) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
