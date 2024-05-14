import { create } from "zustand";
interface useOnboardingModalStore {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
}

export const useOnboardingModal = create<useOnboardingModalStore>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
