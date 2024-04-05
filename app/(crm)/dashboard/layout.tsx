import Login from "@/app/(auth)/login/page";
import Header from "@/components/dashboard/header";
import Sidebar from "@/components/dashboard/sidebar";
import Sidenav from "@/components/dashboard/sidenav";
import { authOptions } from "@/lib/auth-options";
import { getServerSession } from "next-auth";
import React, { ReactNode } from "react";

// Do not cache our admin page
export const dynamic = "force-dynamic";

export default async function DashboardLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="grid h-full w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      {/* <Sidebar /> */}
      <Sidenav />
      <main className="flex flex-1 flex-col">
        <Header />
        <section className="gap-4 p-4 lg:gap-6 lg:p-6">{children}</section>
      </main>
    </div>
  );
}
