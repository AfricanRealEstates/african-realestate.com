"use client";
import Image from "next/image";
import Link from "next/link";
import React from "react";
import { UserRole } from "@prisma/client"; // Import Prisma enums
import { signOut, useSession } from "next-auth/react";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/assets/home.png",
        title: "Home",
        url: "/dashboard",
        visible: [
          UserRole.USER,
          UserRole.ADMIN,
          UserRole.AGENT,
          UserRole.AGENCY,
          UserRole.SUPPORT,
        ],
      },
      {
        icon: "/assets/agent.png",
        title: "Agents",
        url: "/dashboard/agents",
        visible: [UserRole.ADMIN],
      },
      {
        icon: "/assets/houses.svg",
        title: "Properties",
        url: "/dashboard/properties",
        visible: [UserRole.ADMIN, UserRole.AGENT, UserRole.AGENCY],
      },
      {
        icon: "/assets/agencies.png",
        title: "Agencies",
        url: "/dashboard/agencies",
        visible: [UserRole.ADMIN],
      },
      {
        icon: "/assets/agent.png",
        title: "All users",
        url: "/dashboard/users",
        visible: [UserRole.ADMIN],
      },
      {
        icon: "/assets/house-3.svg",
        title: "Discounts",
        url: "/dashboard/discounts",
        visible: [UserRole.ADMIN],
      },
      {
        icon: "/assets/support.png",
        title: "Support",
        url: "/dashboard/support",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
      {
        icon: "/assets/calendar.png",
        title: "Events",
        url: "/dashboard/events",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
      {
        icon: "/assets/message.png",
        title: "Messages",
        url: "/dashboard/messages",
        visible: [UserRole.ADMIN],
      },
      {
        icon: "/assets/announcement.png",
        title: "Announcements",
        url: "/dashboard/announcements",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/assets/profile.png",
        title: "Profile",
        url: "/dashboard/profile",
        visible: [
          UserRole.USER,
          UserRole.ADMIN,
          UserRole.AGENT,
          UserRole.AGENCY,
          UserRole.SUPPORT,
        ],
      },
      {
        icon: "/assets/setting.png",
        title: "Settings",
        url: "/dashboard/settings",
        visible: [
          UserRole.USER,
          UserRole.ADMIN,
          UserRole.AGENT,
          UserRole.AGENCY,
          UserRole.SUPPORT,
        ],
      },
      {
        icon: "/assets/logout.png",
        title: "Logout",
        action: () => signOut({ callbackUrl: `${window.location.origin}/` }),
        visible: [
          UserRole.USER,
          UserRole.ADMIN,
          UserRole.AGENT,
          UserRole.AGENCY,
          UserRole.SUPPORT,
        ],
      },
    ],
  },
];
export default function Menu() {
  const { data: session } = useSession();
  const user = session?.user;
  const role = user?.role;

  if (!role) {
    return null; // Handle unauthenticated state
  }

  // Convert string role to UserRole enum
  const userRole = UserRole[role as keyof typeof UserRole];

  if (!userRole) {
    return null; // Handle invalid roles
  }

  return (
    <div className="mt-4 text-base/6">
      {menuItems.map((i) => (
        <div key={i.title} className="flex flex-col gap-2">
          <span className="hidden lg:block text-gray-400 font-light my-4">
            {i.title}
          </span>
          {i.items.map((item) => {
            if (item.visible.includes(userRole)) {
              return item.url ? (
                <Link
                  href={item.url}
                  key={item.title}
                  className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={17}
                    height={17}
                  />
                  <span className="hidden lg:block">{item.title}</span>
                </Link>
              ) : (
                <div
                  key={item.title}
                  onClick={item.action}
                  className="cursor-pointer flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
                >
                  <Image
                    src={item.icon}
                    alt={item.title}
                    width={17}
                    height={17}
                  />
                  <span className="hidden lg:block">{item.title}</span>
                </div>
              );
            }
          })}
        </div>
      ))}
    </div>
  );
}
