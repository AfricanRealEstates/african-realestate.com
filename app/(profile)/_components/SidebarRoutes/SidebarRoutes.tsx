"use client";
import { Heart, List } from "lucide-react";
import { useSession } from "next-auth/react";
import React from "react";
import SidebarItem from "../SidebarItem/SidebarItem";

export const generalSidebar = [
  {
    icon: List,
    label: "Properties",
    href: "/profile",
  },
  {
    icon: Heart,
    label: "Loved Properties",
    href: "/properties",
  },
];
export default function SidebarRoutes() {
  const session = useSession();
  const userId = session.data?.user.id;
  return (
    <div className="flex flex-col justify-between h-full">
      <div>
        <div className="p-2 md:p-6">
          <p className="mb-2 text-slate-500">GENERAL</p>
          {generalSidebar.map((item) => {
            return <SidebarItem key={item.label} item={item} />;
          })}
        </div>
      </div>
    </div>
  );
}
