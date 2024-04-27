import React from "react";

interface Props {
  children: React.ReactNode;
}
export default function OnboardingLayout({ children }: Props) {
  return (
    <section className="flex relative h-screen w-full flex-col items-center justify-center">
      {children}
    </section>
  );
}
