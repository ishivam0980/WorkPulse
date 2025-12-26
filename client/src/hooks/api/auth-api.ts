import API from "@/lib/axios-client";
import {
  CurrentUserResponseType,
  LoginResponseType,
  LoginType,
  registerType,
} from "@/types/api.type";

export const getCurrentUserQueryFn =
  async (): Promise<CurrentUserResponseType> => {
    const response = await API.get(`/user/current`);
    return response.data;
  };

export const loginMutationFn = async (
  data: LoginType
): Promise<LoginResponseType> => {
  const response = await API.post(`/auth/login`, data);
  return response.data;
};

export const registerMutationFn = async (
  data: registerType
): Promise<{ message: string }> => {
  const response = await API.post(`/auth/register`, data);
  return response.data;
};

export const logoutMutationFn = async (): Promise<{ message: string }> => {
  const response = await API.post(`/auth/logout`);
  return response.data;
};
