"use client";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BellRing,
  Handshake,
  LayoutGrid,
  LineChart,
  LinkIcon,
  Users,
} from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";

const links = [
  { name: "Dashboard", url: "/dashboard", icon: LayoutGrid },
  {
    name: "Requested Quotes",
    url: "/dashboard/quotes",
    icon: Handshake,
    hideOnMobile: true,
  },
  { name: "Staff", url: "/dashboard/staff", icon: Users },
  { name: "Analytics", url: "/dashboard/analytics", icon: LineChart },
  {
    name: "Notifications",
    url: "/dashboard/notifications",
    icon: BellRing,
    hideOnMobile: true,
  },
];

export default function NavLinks() {
  const pathname = usePathname();
  return (
    <div>
      {links.map((link) => {
        const { name, url, icon, hideOnMobile } = link;
        const LinkIcon = link.icon;
        const isActive = pathname === link.url;
        return (
          <Link
            href={url}
            key={name}
            className={buttonVariants({
              variant: isActive ? "secondary" : "ghost",
              className: cn("navLink", { "hidden md:flex": hideOnMobile }),
              size: "lg",
            })}
          >
            <LinkIcon className="size-4" />
            <p
              className={`${cn("hidden lg:block", {
                "font-bold": isActive,
              })}`}
            >
              {name}
            </p>
          </Link>
        );
      })}
    </div>
  );
}
