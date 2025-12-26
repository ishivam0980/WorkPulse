import API from "@/lib/axios-client";
import {
  AllMembersInWorkspaceResponseType,
  ChangeWorkspaceMemberRoleType,
} from "@/types/api.type";

export const getAllMembersInWorkspaceQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/member/workspace/${workspaceId}/members`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  memberId,
  roleId,
}: ChangeWorkspaceMemberRoleType & { workspaceId: string }): Promise<{
  message: string;
}> => {
  const response = await API.put(
    `/member/workspace/${workspaceId}/member/${memberId}/role`,
    { roleId }
  );
  return response.data;
};

export const removeWorkspaceMemberMutationFn = async ({
  workspaceId,
  memberId,
}: {
  workspaceId: string;
  memberId: string;
}): Promise<{ message: string }> => {
  const response = await API.delete(
    `/member/workspace/${workspaceId}/member/${memberId}`
  );
  return response.data;
};
