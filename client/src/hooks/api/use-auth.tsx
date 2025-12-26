import { useQuery } from "@tanstack/react-query";
import { getCurrentUserQueryFn } from "./auth-api";

const useAuth = () => {
  const query = useQuery({
    queryKey: ["authUser"],
    queryFn: getCurrentUserQueryFn,
    staleTime: Infinity,
    retry: 1,
  });

  return query;
};

export default useAuth;
