import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createTaskMutationFn,
  deleteTaskMutationFn,
  getAllTasksQueryFn,
  getTaskByIdQueryFn,
  updateTaskMutationFn,
} from "./task-api";
import {
  AllTaskPayloadType,
  CreateTaskPayloadType,
  DeleteTaskPayloadType,
  UpdateTaskPayloadType,
} from "@/types/api.type";

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

export const useCreateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: CreateTaskPayloadType) =>
      createTaskMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", variables.workspaceId],
      });
    },
  });
};

export const useUpdateTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: UpdateTaskPayloadType) =>
      updateTaskMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["task", variables.taskId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", variables.workspaceId],
      });
    },
  });
};

export const useDeleteTaskMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: DeleteTaskPayloadType) =>
      deleteTaskMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["alltasks", variables.workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["projectAnalytics"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspace-analytics", variables.workspaceId],
      });
    },
  });
};
