import { auth } from "@/auth";
import DashboardNavbar from "@/components/crm/navbar";
import SessionProvider from "@/providers/client-provider";
import { redirect } from "next/navigation";
import React, { ReactNode } from "react";

interface DashboardLayoutProps {
  children: ReactNode;
}

export default async function DashboardLayout({
  children,
}: DashboardLayoutProps) {
  const session = await auth();
  const user = session?.user;

  if (!user) redirect("/login");
  const value = {
    user: session.user,
    session,
  };
  return (
    <SessionProvider value={value}>
      <section className="relative flex h-screen w-full flex-col">
        <DashboardNavbar />
        <div className="w-full">{children}</div>
      </section>
    </SessionProvider>
  );
}
