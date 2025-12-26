import API from "@/lib/axios-client";

export interface UpdateUserPayload {
  name?: string;
}

export const updateCurrentUserMutationFn = async (
  data: UpdateUserPayload
): Promise<{ message: string }> => {
  const response = await API.put("/user/current", data);
  return response.data;
};
