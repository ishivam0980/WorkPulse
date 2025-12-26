import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  changeWorkspaceMemberRoleMutationFn,
  createWorkspaceMutationFn,
  deleteWorkspaceMutationFn,
  editWorkspaceMutationFn,
  getAllWorkspacesUserIsMemberQueryFn,
  getWorkspaceAnalyticsQueryFn,
  getWorkspaceByIdQueryFn,
  getWorkspaceMembersQueryFn,
} from "./workspace-api";

export const useGetWorkspaceQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace", workspaceId],
    queryFn: () => getWorkspaceByIdQueryFn(workspaceId),
    staleTime: Infinity,
    enabled: !!workspaceId,
  });
};

export const useGetAllWorkspacesQuery = () => {
  return useQuery({
    queryKey: ["workspaces"],
    queryFn: getAllWorkspacesUserIsMemberQueryFn,
    staleTime: Infinity,
  });
};

export const useCreateWorkspaceMutation = () => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: createWorkspaceMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useEditWorkspaceMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: editWorkspaceMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["workspace", workspaceId],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useDeleteWorkspaceMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: () => deleteWorkspaceMutationFn(workspaceId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
      queryClient.invalidateQueries({
        queryKey: ["workspaces"],
      });
    },
  });
};

export const useGetWorkspaceMembersQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getWorkspaceMembersQueryFn(workspaceId),
    staleTime: Infinity,
  });
};

export const useChangeWorkspaceMemberRoleMutation = (workspaceId: string) => {
  const queryClient = useQueryClient();
  return useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["members", workspaceId],
      });
    },
  });
};

export const useGetWorkspaceAnalyticsQuery = (workspaceId: string) => {
  return useQuery({
    queryKey: ["workspace-analytics", workspaceId],
    queryFn: () => getWorkspaceAnalyticsQueryFn(workspaceId),
    staleTime: 0,
    enabled: !!workspaceId,
  });
};
