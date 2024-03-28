import Sidebar from "@/components/dashboard/sidebar";
import React, { ReactNode } from "react";

// Do not cache our admin page
export const dynamic = "force-dynamic";

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="p-8">
      {/* <Sidebar /> */}
      {children}
    </div>
  );
}
