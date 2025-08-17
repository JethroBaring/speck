import { create } from 'zustand';

interface ProjectModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useProjectModalStore = create<ProjectModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
})); 