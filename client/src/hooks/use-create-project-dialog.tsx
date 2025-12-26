import { create } from "zustand";

type CreateProjectDialogState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateProjectDialog = create<CreateProjectDialogState>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
