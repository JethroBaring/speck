import { create } from 'zustand';

interface TestCaseModalState {
  isOpen: boolean;
  openModal: () => void;
  closeModal: () => void;
}

export const useTestCaseModalStore = create<TestCaseModalState>((set) => ({
  isOpen: false,
  openModal: () => set({ isOpen: true }),
  closeModal: () => set({ isOpen: false }),
})); 