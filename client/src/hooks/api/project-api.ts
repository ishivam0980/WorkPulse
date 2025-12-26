import API from "@/lib/axios-client";
import {
  AllProjectPayloadType,
  AllProjectResponseType,
  CreateProjectPayloadType,
  CreateProjectResponseType,
  EditProjectPayloadType,
  ProjectAnalyticsPayloadType,
  ProjectAnalyticsResponseType,
  ProjectByIdPayloadType,
  ProjectType,
} from "@/types/api.type";

export const createProjectMutationFn = async ({
  workspaceId,
  data,
}: {
  workspaceId: string;
  data: CreateProjectPayloadType;
}): Promise<CreateProjectResponseType> => {
  const response = await API.post(
    `/project/workspace/${workspaceId}/create`,
    data
  );
  return response.data;
};

export const editProjectMutationFn = async (
  payload: EditProjectPayloadType
): Promise<{ message: string; project: ProjectType }> => {
  const response = await API.put(
    `/project/${payload.projectId}/workspace/${payload.workspaceId}/update`,
    payload.data
  );
  return response.data;
};

export const getAllProjectsQueryFn = async (
  payload: AllProjectPayloadType
): Promise<AllProjectResponseType> => {
  const response = await API.get(
    `/project/workspace/${payload.workspaceId}/all`,
    {
      params: {
        pageNumber: payload.pageNumber,
        pageSize: payload.pageSize,
      },
    }
  );
  return response.data;
};

export const getProjectByIdQueryFn = async (
  payload: ProjectByIdPayloadType
): Promise<{ message: string; project: ProjectType }> => {
  const response = await API.get(
    `/project/${payload.projectId}/workspace/${payload.workspaceId}`
  );
  return response.data;
};

export const getProjectAnalyticsQueryFn = async (
  payload: ProjectAnalyticsPayloadType
): Promise<ProjectAnalyticsResponseType> => {
  const response = await API.get(
    `/project/${payload.projectId}/workspace/${payload.workspaceId}/analytics`
  );
  return response.data;
};

export const deleteProjectMutationFn = async (
  payload: ProjectByIdPayloadType
): Promise<{ message: string }> => {
  const response = await API.delete(
    `/project/${payload.projectId}/workspace/${payload.workspaceId}/delete`
  );
  return response.data;
};
