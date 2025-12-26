import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  createProjectMutationFn,
  deleteProjectMutationFn,
  editProjectMutationFn,
  getAllProjectsQueryFn,
  getProjectAnalyticsQueryFn,
  getProjectByIdQueryFn,
} from "./project-api";
import {
  AllProjectPayloadType,
  CreateProjectPayloadType,
  EditProjectPayloadType,
  ProjectAnalyticsPayloadType,
  ProjectByIdPayloadType,
} from "@/types/api.type";

export const useGetProjectsQuery = (payload: AllProjectPayloadType) => {
  return useQuery({
    queryKey: ["allprojects", payload.workspaceId],
    queryFn: () => getAllProjectsQueryFn(payload),
    staleTime: Infinity,
  });
};

export const useGetProjectQuery = (payload: ProjectByIdPayloadType) => {
  return useQuery({
    queryKey: ["project", payload.projectId],
    queryFn: () => getProjectByIdQueryFn(payload),
    staleTime: Infinity,
    enabled: !!payload.projectId,
  });
};

export const useGetProjectAnalyticsQuery = (
  payload: ProjectAnalyticsPayloadType
) => {
  return useQuery({
    queryKey: ["projectAnalytics", payload.projectId],
    queryFn: () => getProjectAnalyticsQueryFn(payload),
    staleTime: 0,
    enabled: !!payload.projectId,
  });
};

export const useCreateProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: {
      workspaceId: string;
      data: CreateProjectPayloadType;
    }) => createProjectMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["allprojects", variables.workspaceId],
      });
    },
  });
};

export const useEditProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: EditProjectPayloadType) =>
      editProjectMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["project", variables.projectId],
      });
      queryClient.invalidateQueries({
        queryKey: ["allprojects", variables.workspaceId],
      });
    },
  });
};

export const useDeleteProjectMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: (payload: ProjectByIdPayloadType) =>
      deleteProjectMutationFn(payload),
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["allprojects", variables.workspaceId],
      });
    },
  });
};
