import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type WorkspaceIdState = {
  workspaceId: string;
  setWorkspaceId: (id: string) => void;
};

export const useWorkspaceId = create<WorkspaceIdState>()(
  persist(
    (set) => ({
      workspaceId: "",
      setWorkspaceId: (id) => set({ workspaceId: id }),
    }),
    {
      name: "workpulse-workspace-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
