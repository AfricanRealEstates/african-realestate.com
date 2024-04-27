import DashboardNavbar from "@/components/crm/navbar";
import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  return (
    <section className="relative flex h-screen w-full flex-col">
      <DashboardNavbar />
      <div className="w-full">{children}</div>
    </section>
  );
}
