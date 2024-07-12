import React, { ReactNode } from "react";
import Sidebar from "./_components/Sidebar/Sidebar";
import NavbarDashboard from "./_components/NavbarDashboard/NavbarDashboard";

export default function ProfileLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex w-full h-screen pt-28">
      <section className="hidden h-full xl:block w-80 xl:fixed">
        <Sidebar />
      </section>
      <section className="w-full h-full xl:ml-80">
        <NavbarDashboard />
        <div className="p-6 h-max">{children}</div>
      </section>
    </div>
  );
}
