import API from "@/lib/axios-client";
import {
  AllMembersInWorkspaceResponseType,
  AllWorkspacesResponseType,
  AnalyticsResponseType,
  ChangeWorkspaceMemberRoleType,
  CreateWorkspaceResponseType,
  CreateWorkspaceType,
  EditWorkspaceResponseType,
  EditWorkspaceType,
  WorkspaceWithMembersType,
} from "@/types/api.type";

export const createWorkspaceMutationFn = async (
  data: CreateWorkspaceType
): Promise<CreateWorkspaceResponseType> => {
  const response = await API.post(`/workspace/create/new`, data);
  return response.data;
};

export const editWorkspaceMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: EditWorkspaceType;
}): Promise<EditWorkspaceResponseType> => {
  const response = await API.put(`/workspace/update/${workspaceId}`, data);
  return response.data;
};

export const getAllWorkspacesUserIsMemberQueryFn =
  async (): Promise<AllWorkspacesResponseType> => {
    const response = await API.get(`/workspace/all`);
    return response.data;
  };

export const getWorkspaceByIdQueryFn = async (
  workspaceId: string
): Promise<{ message: string; workspace: WorkspaceWithMembersType }> => {
  const response = await API.get(`/workspace/${workspaceId}`);
  return response.data;
};

export const getWorkspaceMembersQueryFn = async (
  workspaceId: string
): Promise<AllMembersInWorkspaceResponseType> => {
  const response = await API.get(`/workspace/members/${workspaceId}`);
  return response.data;
};

export const getWorkspaceAnalyticsQueryFn = async (
  workspaceId: string
): Promise<AnalyticsResponseType> => {
  const response = await API.get(`/workspace/analytics/${workspaceId}`);
  return response.data;
};

export const changeWorkspaceMemberRoleMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: ChangeWorkspaceMemberRoleType;
}): Promise<{ message: string }> => {
  const response = await API.put(
    `/workspace/change/member/role/${workspaceId}`,
    data
  );
  return response.data;
};

export const deleteWorkspaceMutationFn = async (
  workspaceId: string
): Promise<{ message: string; currentWorkspace: string }> => {
  const response = await API.delete(`/workspace/delete/${workspaceId}`);
  return response.data;
};
