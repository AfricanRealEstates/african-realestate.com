"use client";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import React, { useState } from "react";

interface DashboardLayoutProps {
  children: React.ReactNode;
}

export default function DashboardLayout({ children }: DashboardLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  return (
    <div>
      <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
      <Header setSidebarOpen={setSidebarOpen} />
      <main className="xl:pl-72">{children}</main>
    </div>
  );
}
