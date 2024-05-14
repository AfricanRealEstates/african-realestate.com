"use client";
import Geolocation from "@/components/globals/geo-location";
import { OnboardingModal } from "@/components/modals/onboarding-modal";
import Modal from "@/components/ui/modal";
import { useOnboardingModal } from "@/hooks/use-onboarding-modal";
import React, { useEffect } from "react";

export default function Onboarding() {
  // const session = await auth();
  // const user = session?.user;

  // if (!user) {
  //   redirect("/login");
  // }

  const onOpen = useOnboardingModal((state) => state.onOpen);
  const isOpen = useOnboardingModal((state) => state.isOpen);

  useEffect(() => {
    if (!isOpen) {
      onOpen;
    }
  }, [isOpen, onOpen]);

  return (
    <div className="max-w-5xl h-screen mx-auto flex-col items-center justify-center gap-4">
      <div className="mt-56">
        hello
        <Geolocation />
      </div>
    </div>
  );
}
