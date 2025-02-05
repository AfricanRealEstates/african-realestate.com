"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { UserRole } from "@prisma/client";
import { signOut, useSession } from "next-auth/react";
import {
  Home,
  Users,
  Building,
  UserPlus,
  Percent,
  Headphones,
  Calendar,
  MessageSquare,
  Bell,
  User,
  Settings,
  LogOut,
  MenuIcon,
  Book,
} from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";

const menuItems = [
  {
    title: "MENU",
    items: [
      {
        icon: Home,
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
        icon: Users,
        title: "Agents",
        url: "/dashboard/agents",
        visible: [UserRole.ADMIN],
      },
      {
        icon: Building,
        title: "Properties",
        url: "/dashboard/properties",
        visible: [UserRole.ADMIN, UserRole.AGENT, UserRole.AGENCY],
      },
      {
        icon: Building,
        title: "Agencies",
        url: "/dashboard/agencies",
        visible: [UserRole.ADMIN],
      },
      {
        icon: UserPlus,
        title: "All users",
        url: "/dashboard/users",
        visible: [UserRole.ADMIN],
      },
      {
        icon: Percent,
        title: "Discounts",
        url: "/dashboard/discounts",
        visible: [UserRole.ADMIN],
      },
      {
        icon: Headphones,
        title: "Support",
        url: "/dashboard/support",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
      {
        icon: Calendar,
        title: "Events",
        url: "/dashboard/events",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
      {
        icon: MessageSquare,
        title: "Messages",
        url: "/dashboard/messages",
        visible: [UserRole.ADMIN],
      },
      {
        icon: Bell,
        title: "Announcements",
        url: "/dashboard/announcements",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
      {
        icon: Book,
        title: "Blogs",
        url: "/dashboard/blogs",
        visible: [UserRole.ADMIN, UserRole.SUPPORT],
      },
    ],
  },
  {
    title: "OTHER",
    items: [
      {
        icon: User,
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
        icon: Settings,
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
        icon: LogOut,
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
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(true);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 1024;
      setIsOpen(!mobile);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const user = session?.user;
  const role = user?.role;

  if (!role) return null;
  const userRole = UserRole[role as keyof typeof UserRole];
  if (!userRole) return null;

  const toggleMenu = () => setIsOpen(!isOpen);

  const MenuContent = ({ onItemClick }: { onItemClick?: () => void }) => (
    <ScrollArea className="h-full">
      <div className="px-4 py-6">
        <Link href="/" className="flex items-center gap-2 no-underline mb-6">
          <Image
            src="/assets/logo.png"
            width={40}
            height={40}
            alt="ARE"
            className="object-cover"
          />
          <span className="text-lg tracking-tight font-bold">
            African Real Estate
          </span>
        </Link>
        {menuItems.map((section) => (
          <div key={section.title} className="mb-6">
            <h2 className="text-xs font-semibold text-gray-400 mb-2">
              {section.title}
            </h2>
            {section.items.map((item) => {
              if (item.visible.includes(userRole)) {
                const isActive = item.url === pathname;
                return (
                  <div key={item.title} className="mb-1">
                    {item.url ? (
                      <Link
                        href={item.url}
                        onClick={onItemClick}
                        className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 ${
                          isActive
                            ? "bg-blue-100 text-blue-600"
                            : "text-gray-700 hover:bg-gray-100"
                        }`}
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </Link>
                    ) : (
                      <button
                        onClick={() => {
                          item.action?.();
                          onItemClick?.();
                        }}
                        className="flex items-center space-x-3 px-3 py-2 rounded-md transition-colors duration-200 text-gray-700 hover:bg-gray-100 w-full"
                      >
                        <item.icon className="h-5 w-5" />
                        <span className="text-sm">{item.title}</span>
                      </button>
                    )}
                  </div>
                );
              }
              return null;
            })}
          </div>
        ))}
      </div>
    </ScrollArea>
  );

  return (
    <>
      <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
        <SheetTrigger asChild>
          <button
            className="rounded-full lg:hidden fixed top-4 left-4 z-50 h-10 w-10 flex items-center justify-center hover:bg-neutral-50"
            onClick={() => setIsSheetOpen(true)}
          >
            <MenuIcon className="w-6 h-6 text-gray-400" />
          </button>
        </SheetTrigger>
        <SheetContent
          side="left"
          className="p-0 w-64 transition-transform duration-300 ease-in-out"
        >
          <MenuContent onItemClick={() => setIsSheetOpen(false)} />
        </SheetContent>
      </Sheet>

      <nav
        className={`bg-white border-r border-gray-200 transition-all duration-300 ease-in-out ${
          isOpen ? "w-64" : "w-20"
        } hidden lg:flex flex-col`}
      >
        <div className="flex justify-between items-center p-4">
          <Link
            href="/"
            className={`flex items-center gap-2 no-underline ${
              isOpen ? "" : "justify-center"
            }`}
          >
            <Image
              src="/assets/logo.png"
              width={40}
              height={40}
              alt="ARE"
              className="object-cover"
            />
            {isOpen && (
              <span className="lg:text-lg tracking-tight font-bold">
                African Real Estate
              </span>
            )}
          </Link>
          {/* <Button
            variant="ghost"
            size="icon"
            onClick={toggleMenu}
            className="text-gray-500 focus:outline-none"
          >
            {isOpen ? <X size={24} /> : <MenuIcon size={24} />}
          </Button> */}
        </div>
        <div className="mt-8 flex-1 overflow-y-auto">
          {menuItems.map((section) => (
            <div key={section.title} className="mb-6">
              {isOpen && (
                <h2 className="text-xs font-semibold text-gray-400 px-4 mb-2">
                  {section.title}
                </h2>
              )}
              {section.items.map((item) => {
                if (item.visible.includes(userRole)) {
                  const isActive = item.url === pathname;
                  return (
                    <div
                      key={item.title}
                      className={`px-4 py-2 ${
                        isOpen ? "" : "flex justify-center"
                      }`}
                    >
                      {item.url ? (
                        <Link
                          href={item.url}
                          className={`flex items-center ${
                            isOpen ? "space-x-3" : "justify-center"
                          } ${
                            isActive
                              ? "text-blue-600"
                              : "text-gray-700 hover:text-blue-600"
                          } transition-colors duration-200`}
                        >
                          <item.icon className="h-5 w-5" />
                          {isOpen && (
                            <span className="text-sm">{item.title}</span>
                          )}
                        </Link>
                      ) : (
                        <button
                          onClick={item.action}
                          className={`flex items-center ${
                            isOpen ? "space-x-3" : "justify-center"
                          } text-gray-700 hover:text-blue-600 transition-colors duration-200 w-full`}
                        >
                          <item.icon className="h-5 w-5" />
                          {isOpen && (
                            <span className="text-sm">{item.title}</span>
                          )}
                        </button>
                      )}
                    </div>
                  );
                }
                return null;
              })}
            </div>
          ))}
        </div>
      </nav>
    </>
  );
}
