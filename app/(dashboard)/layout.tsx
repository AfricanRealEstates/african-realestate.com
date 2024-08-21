import { Home, HomeIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import Menu from "./components/Menu";
import Navbar from "./components/Navbar";

export const metadata: Metadata = {
  title: {
    default: "Dashboard - African Real Estate",
    template: "%s - African Real Estate",
  },
};

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="h-screen flex">
      <div className="w-[14%] md:w-[w-8%] lg:w-[16%] xl:w-[14%]  p-4">
        <Link
          href={`/`}
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <HomeIcon
            size={24}
            className="bg-[#eb6753] text-white px-0.5 py-0.5 rounded-lg"
          />
          <span className="hidden lg:block font-bold">African Real Estate</span>
        </Link>
        <Menu />
      </div>
      <div className="w-[86%] md:w-[w-92%] lg:w-[84%] xl:w-[86%] bg-neutral-50 overflow-scroll">
        <Navbar />
        {children}
      </div>
    </div>
  );
}
