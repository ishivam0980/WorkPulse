import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "react-router-dom";
import { getCurrentUserQueryFn, logoutMutationFn } from "./auth-api";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
    retry: 1,
  });

  return query;
};

export const useLogout = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: logoutMutationFn,
    onSuccess: () => {
      queryClient.clear();
      navigate("/");
    },
  });
};

export default useAuth;
