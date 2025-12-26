import { create } from "zustand";

type TaskFiltersState = {
  projectId: string | null;
  keyword: string | null;
  priority: string | null;
  status: string | null;
  assignedTo: string | null;
  dueDate: string | null;
  setFilters: (filters: Partial<TaskFiltersState>) => void;
  clearFilters: () => void;
};

const initialState = {
  projectId: null,
  keyword: null,
  priority: null,
  status: null,
  assignedTo: null,
  dueDate: null,
};

export const useTaskFilters = create<TaskFiltersState>((set) => ({
  ...initialState,
  setFilters: (filters) => set((state) => ({ ...state, ...filters })),
  clearFilters: () => set(initialState),
}));
