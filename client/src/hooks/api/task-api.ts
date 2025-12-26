import API from "@/lib/axios-client";
import {
  AllTaskPayloadType,
  AllTaskResponseType,
  CreateTaskPayloadType,
  CreateTaskResponseType,
  DeleteTaskPayloadType,
  TaskType,
  UpdateTaskPayloadType,
} from "@/types/api.type";

export const createTaskMutationFn = async (
  payload: CreateTaskPayloadType
): Promise<CreateTaskResponseType> => {
  const response = await API.post(
    `/task/project/${payload.projectId}/workspace/${payload.workspaceId}/create`,
    payload.data
  );
  return response.data;
};

export const updateTaskMutationFn = async (
  payload: UpdateTaskPayloadType
): Promise<{ message: string; task: TaskType }> => {
  const response = await API.put(
    `/task/${payload.taskId}/project/${payload.projectId}/workspace/${payload.workspaceId}/update`,
    payload.data
  );
  return response.data;
};

export const getAllTasksQueryFn = async (
  filters: AllTaskPayloadType
): Promise<AllTaskResponseType> => {
  const { workspaceId, ...params } = filters;
  const response = await API.get(`/task/workspace/${workspaceId}/all`, {
    params,
  });
  return response.data;
};

export const getTaskByIdQueryFn = async (
  workspaceId: string,
  projectId: string,
  taskId: string
): Promise<{ message: string; task: TaskType }> => {
  const response = await API.get(
    `/task/${taskId}/project/${projectId}/workspace/${workspaceId}`
  );
  return response.data;
};

export const deleteTaskMutationFn = async (
  payload: DeleteTaskPayloadType
): Promise<{ message: string }> => {
  const response = await API.delete(
    `/task/${payload.taskId}/workspace/${payload.workspaceId}/delete`
  );
  return response.data;
};
