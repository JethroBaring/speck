import { create } from 'zustand';

interface RoleModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useRoleModalStore = create<RoleModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
})); 