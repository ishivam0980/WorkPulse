import { useMutation, useQueryClient } from "@tanstack/react-query";
import { updateCurrentUserMutationFn, UpdateUserPayload } from "./user-api";

export const useUpdateCurrentUser = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: UpdateUserPayload) => updateCurrentUserMutationFn(data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["authUser"],
      });
    },
  });
};
