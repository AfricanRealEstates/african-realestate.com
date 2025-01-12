import { Home, HomeIcon } from "lucide-react";
import { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
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
      <div className="w-[14%] md:w-[w-8%] lg:w-[16%] xl:w-[14%]  p-4 border-r border-gray-100">
        {/* <Link
          href={`/`}
          className="flex items-center justify-center lg:justify-start gap-2"
        >
          <HomeIcon
            size={24}
            className="bg-[#eb6753] text-white px-0.5 py-0.5 rounded-lg"
          />
          <span className="hidden lg:block font-bold">African Real Estate</span>
        </Link> */}

        <Link href="/" className={`flex items-center gap-2 no-underline`}>
          <img
            src="/assets/logo.png"
            width={40}
            height={40}
            alt="ARE"
            className="object-cover"
          />
          {/* <span className="bg-[#eb6753] text-white py-1 px-2 rounded-lg">
                <HomeIcon />
              </span> */}
          <span
            className={`hidden lg:block lg:text-lg tracking-tight font-bold`}
          >
            African Real Estate.
          </span>
        </Link>
        <Menu />
      </div>
      <div className="w-[86%] md:w-[w-92%] lg:w-[84%] xl:w-[86%] overflow-scroll min-h-screen">
        <Navbar />
        <div className="bg-white min-h-screen flex flex-col">
          <main className="flex-1">{children}</main>

          <p className="block text-center text-sm text-gray-600 mt-16 mb-4">
            &copy; African Real Estate, {new Date().getFullYear()}. All Rights
            Reserved.
          </p>
        </div>
      </div>
    </div>
  );
}
