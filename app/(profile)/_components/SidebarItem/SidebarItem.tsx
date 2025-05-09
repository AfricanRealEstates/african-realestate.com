"use client";
import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
interface SidebarItemProps {
  item: {
    label: string;
    icon: LucideIcon;
    href: string;
  };
  key: string;
}

export default function SidebarItem({ item }: SidebarItemProps) {
  const { icon: Icon, href, label } = item;

  const pathname = usePathname();
  const activePath = pathname === href;
  return (
    <Link
      href={href}
      className={cn(
        "flex gap-x-2 mt-2 text-slate-700 text-sm items-center hover:bg-slate-300/20 p-2 rounded-lg cursor-pointer",
        activePath && "bg-slate-400/20"
      )}
    >
      <Icon className="size-5" strokeWidth={1} />
      {label}
    </Link>
  );
}
