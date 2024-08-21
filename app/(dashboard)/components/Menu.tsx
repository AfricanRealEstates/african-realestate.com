import { LayoutDashboard } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React from "react";

export let role = "admin";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: "/assets/home.png",
        title: "Home",
        url: "/dashboard",
        visible: ["admin", "agent", "agency", "support"],
      },
      {
        icon: "/assets/agent.png",
        title: "Agents",
        url: "/dashboard/agents",
        visible: ["admin"],
      },
      {
        icon: "/assets/houses.svg",
        title: "Properties",
        url: "/dashboard/properties",
        visible: ["admin", "agent", "agency"],
      },
      {
        icon: "/assets/agencies.png",
        title: "Agencies",
        url: "/dashboard/agencies",
        visible: ["admin"],
      },
      {
        icon: "/assets/support.png",
        title: "Support",
        url: "/dashboard/support",
        visible: ["admin", "support"],
      },
      {
        icon: "/assets/calendar.png",
        title: "Events",
        url: "/dashboard/events",
        visible: ["admin", "support"],
      },
      {
        icon: "/assets/message.png",
        title: "Messages",
        url: "/dashboard/messages",
        visible: ["admin"],
      },
      {
        icon: "/assets/announcement.png",
        title: "Announcements",
        url: "/dashboard/announcements",
        visible: ["admin", "support"],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: "/assets/profile.png",
        title: "Profile",
        url: "/profile",
        visible: ["admin", "agent", "agency", "support"],
      },
      {
        icon: "/assets/setting.png",
        title: "Settings",
        url: "/settings",
        visible: ["admin", "agent", "agency", "support"],
      },
      {
        icon: "/assets/logout.png",
        title: "Logout",
        url: "/logout",
        visible: ["admin", "agent", "agency", "support"],
      },
    ],
  },
];

export default function Menu() {
  return (
    <div className="mt-4 text-base/6">
      {menuItems.map((i) => {
        return (
          <div key={i.title} className="flex flex-col gap-2">
            <span className="hidden lg:block text-gray-400 font-light my-4">
              {i.title}
            </span>

            {i.items.map((item) => {
              if (item.visible.includes(role)) {
                return (
                  <Link
                    href={item.url}
                    key={item.title}
                    className="flex items-center justify-center lg:justify-start gap-4 text-gray-500 py-2"
                  >
                    <Image src={item.icon} alt="" width={17} height={17} />
                    <span className="hidden lg:block">{item.title}</span>
                  </Link>
                );
              }
            })}
          </div>
        );
      })}
    </div>
  );
}
