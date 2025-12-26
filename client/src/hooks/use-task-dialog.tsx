import { create } from "zustand";
import { TaskType } from "@/types/api.type";

type CreateTaskDialogState = {
  isOpen: boolean;
  task: TaskType | null;
  onOpen: (task?: TaskType) => void;
  onClose: () => void;
};

export const useCreateTaskDialog = create<CreateTaskDialogState>((set) => ({
  isOpen: false,
  task: null,
  onOpen: (task) => set({ isOpen: true, task: task || null }),
  onClose: () => set({ isOpen: false, task: null }),
}));

type EditTaskDialogState = {
  isOpen: boolean;
  task: TaskType | null;
  onOpen: (task: TaskType) => void;
  onClose: () => void;
};

export const useEditTaskDialog = create<EditTaskDialogState>((set) => ({
  isOpen: false,
  task: null,
  onOpen: (task) => set({ isOpen: true, task }),
  onClose: () => set({ isOpen: false, task: null }),
}));
