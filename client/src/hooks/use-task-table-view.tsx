import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";

type TaskTableViewState = {
  view: "table" | "kanban";
  pageNumber: number;
  pageSize: number;
  setView: (view: "table" | "kanban") => void;
  setPageNumber: (pageNumber: number) => void;
  setPageSize: (pageSize: number) => void;
};

export const useTaskTableView = create<TaskTableViewState>()(
  persist(
    (set) => ({
      view: "table",
      pageNumber: 1,
      pageSize: 10,
      setView: (view) => set({ view }),
      setPageNumber: (pageNumber) => set({ pageNumber }),
      setPageSize: (pageSize) => set({ pageSize }),
    }),
    {
      name: "workpulse-task-view-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);
