import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  createTaskMutationFn,
  deleteTaskMutationFn,
  getAllTasksQueryFn,
  getTaskByIdQueryFn,
  updateTaskMutationFn,
} from "./task-api";
import { AllTaskPayloadType } from "@/types/api.type";

export const useGetTasksQuery = (
  filters: AllTaskPayloadType,
  enabled: boolean = true
) => {
  return useQuery({
    queryKey: ["alltasks", filters.workspaceId, filters],
    queryFn: () => getAllTasksQueryFn(filters),
    staleTime: 0,
    enabled,
  });
};

export const useGetTaskByIdQuery = (
  workspaceId: string,
  projectId: string,
  taskId: string
) => {
  return useQuery({
    queryKey: ["task", taskId],
    queryFn: () => getTaskByIdQueryFn(workspaceId, projectId, taskId),
    staleTime: Infinity,
    enabled: !!taskId && !!projectId,
  });
};

export const useCreateTaskMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (data: {
      title: string;
      description?: string;
      projectId: string;
      status: string;
      priority: string;
      assignedTo?: string | null;
      dueDate?: string;
    }) =>
      createTaskMutationFn({
        workspaceId,
        projectId: data.projectId,
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", workspaceId],
      });
      toast.success("Task created successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to create task");
    },
  });
};

export const useEditTaskMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: ({
      taskId,
      data,
    }: {
      taskId: string;
      data: {
        title: string;
        description?: string;
        projectId: string;
        status: string;
        priority: string;
        assignedTo?: string | null;
        dueDate?: string;
      };
    }) =>
      updateTaskMutationFn({
        workspaceId,
        projectId: data.projectId,
        taskId,
        data: {
          title: data.title,
          description: data.description,
          status: data.status,
          priority: data.priority,
          assignedTo: data.assignedTo,
          dueDate: data.dueDate,
        },
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", workspaceId],
      });
      toast.success("Task updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update task");
    },
  });
};

export const useDeleteTaskMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (taskId: string) =>
      deleteTaskMutationFn({
        workspaceId,
        taskId,
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", workspaceId],
      });
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to delete task");
    },
  });
};
