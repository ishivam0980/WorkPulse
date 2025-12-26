import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import {
  getAllMembersInWorkspaceQueryFn,
  changeWorkspaceMemberRoleMutationFn,
  removeWorkspaceMemberMutationFn,
} from "./member-api";

export const useGetWorkspaceMembers = (workspaceId: string) => {
  return useQuery({
    queryKey: ["members", workspaceId],
    queryFn: () => getAllMembersInWorkspaceQueryFn(workspaceId),
    staleTime: Infinity,
    enabled: !!workspaceId,
  });
};

export const useChangeWorkspaceMemberRole = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: changeWorkspaceMemberRoleMutationFn,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.workspaceId],
      });
      toast.success(data.message || "Member role updated successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to update member role");
    },
  });
};

export const useRemoveWorkspaceMember = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: removeWorkspaceMemberMutationFn,
    onSuccess: (data, variables) => {
      queryClient.invalidateQueries({
        queryKey: ["members", variables.workspaceId],
      });
      toast.success(data.message || "Member removed successfully");
    },
    onError: (error: { message: string }) => {
      toast.error(error.message || "Failed to remove member");
    },
  });
};
