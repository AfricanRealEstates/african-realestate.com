"use client";

import { useOnboardingModal } from "@/hooks/use-onboarding-modal";
import Modal from "../ui/modal";

export const OnboardingModal = () => {
  const onboardingModal = useOnboardingModal();
  return (
    <Modal
      title="Create agency"
      description="Add a new agency to manage properties and clients"
      isOpen={onboardingModal.isOpen}
      onClose={onboardingModal.onClose}
    >
      Create Agency
    </Modal>
  );
};
