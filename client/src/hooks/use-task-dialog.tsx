import { create } from "zustand";
import { TaskType } from "@/types/api.type";

type CreateTaskDialogState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateTaskDialog = create<CreateTaskDialogState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
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
