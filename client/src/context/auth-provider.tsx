import React, { createContext, useContext } from "react";
import { UserType } from "@/types/api.type";
import useAuth from "@/hooks/api/use-auth";

type AuthContextType = {
  user: UserType | undefined;
  isLoading: boolean;
  isFetching: boolean;
  error: Error | null;
  refetchAuth: () => void;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { data, error, isLoading, isFetching, refetch } = useAuth();

  return (
    <AuthContext.Provider
      value={{
        user: data?.user,
        isLoading,
        isFetching,
        error,
        refetchAuth: refetch,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuthContext = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuthContext must be used within an AuthProvider");
  }
  return context;
};
