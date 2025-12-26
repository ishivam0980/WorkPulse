import { create } from "zustand";

type CreateWorkspaceDialogState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useCreateWorkspaceDialog = create<CreateWorkspaceDialogState>(
  (set) => ({
    isOpen: false,
    onOpen: () => set({ isOpen: true }),
    onClose: () => set({ isOpen: false }),
  })
);
