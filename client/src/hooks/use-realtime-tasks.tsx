import { useEffect } from "react";
import { useQueryClient } from "@tanstack/react-query";
import { useSocket } from "@/context/socket-provider";
import { TaskType } from "@/types/api.type";

interface UseRealtimeTasksOptions {
  workspaceId: string;
}

export const useRealtimeTasks = ({ workspaceId }: UseRealtimeTasksOptions) => {
  const { socket, isConnected, joinWorkspace, leaveWorkspace } = useSocket();
  const queryClient = useQueryClient();

  useEffect(() => {
    if (!workspaceId || !isConnected) return;

    // Join the workspace room
    joinWorkspace(workspaceId);

    // Listen for task events
    socket?.on("task:created", (task: TaskType) => {
      console.log("🆕 Task created:", task);
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    });

    socket?.on("task:updated", (task: TaskType) => {
      console.log("✏️ Task updated:", task);
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    });

    socket?.on("task:deleted", (data: { taskId: string; workspaceId: string }) => {
      console.log("🗑️ Task deleted:", data.taskId);
      // Invalidate tasks query to refetch
      queryClient.invalidateQueries({ queryKey: ["tasks", workspaceId] });
    });

    // Cleanup
    return () => {
      leaveWorkspace(workspaceId);
      socket?.off("task:created");
      socket?.off("task:updated");
      socket?.off("task:deleted");
    };
  }, [socket, isConnected, workspaceId, joinWorkspace, leaveWorkspace, queryClient]);

  return { isConnected };
};
