import { Metadata } from "next";
import React from "react";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";
import { getCurrentUser } from "@/lib/session";
import { redirect } from "next/navigation";

export const metadata: Metadata = {
  title: {
    default: "Dashboard - African Real Estate",
    template: "%s - African Real Estate",
  },
};

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = await getCurrentUser();

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="h-screen flex">
      <Menu />
      <div className="flex-1 flex flex-col overflow-hidden w-full">
        <Navbar />
        <div className="flex-1 overflow-y-auto">
          <main className="p-6 w-full">{children}</main>
          <footer className="p-4 border-t border-gray-300">
            <p className="text-center text-sm text-gray-600">
              &copy; African Real Estate, {new Date().getFullYear()}. All Rights
              Reserved.
            </p>
          </footer>
        </div>
      </div>
    </div>
  );
}
