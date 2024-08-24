"use client";
import { LogOutIcon, UserIcon } from "lucide-react";
import { signOut, useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { cn } from "@/lib/utils";
import UserAvatar from "@/components/crm/UserAvatar";
import { auth } from "@/auth";
import { useQueryClient } from "@tanstack/react-query";

const avatar = [
  {
    name: "Dashboard",
    href: "/dashboard",
  },
  {
    name: "My properties",
    href: "/agent/properties",
  },
  {
    name: "Profile Account",
    href: "/dashboard/profile",
  },
];

export default function AvatarMenu() {
  const session = useSession();
  const user = session.data?.user;
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };

  const queryClient = useQueryClient();

  return (
    // <DropdownMenu>
    //   <DropdownMenuTrigger asChild>
    //     <button className={cn("flex-none rounded-full")}>
    //       <UserAvatar avatarUrl={user?.image} size={40} />
    //     </button>
    //   </DropdownMenuTrigger>
    //   <DropdownMenuContent>
    //     <DropdownMenuLabel>Logged in as {user?.name}</DropdownMenuLabel>
    //     <DropdownMenuSeparator />
    //     <Link href={`/dashboard/account`}>
    //       <DropdownMenuItem>
    //         <UserIcon className="mr-2 size-4" /> Profile
    //       </DropdownMenuItem>
    //     </Link>
    //     <DropdownMenuSeparator />
    //     <DropdownMenuItem
    //       onClick={async () => {
    //         await signOut({
    //           callbackUrl: "/login",
    //         });
    //         queryClient.clear();
    //       }}
    //     >
    //       <LogOutIcon className="mr-2 size-4" />
    //       Log out
    //     </DropdownMenuItem>
    //   </DropdownMenuContent>
    // </DropdownMenu>
    <section className="border rounded-sm shadow-md bg-white absolute top-full text-gray-400">
      <div className="flex cursor-pointer p-2">
        <div className="flex flex-col items-start space-y-2">
          {avatar.map((link) => {
            const { name, href } = link;
            return (
              <Link
                href={href}
                key={name}
                className="group flex items-center gap-4"
              >
                <div className="space-y-2">
                  <p className="w-40 p-2 rounded font-medium text-neutral-500 hover:text-blue-400 transition-colors hover:bg-gray-100 focus:ring-2 focus:ring-blue-500">
                    {name}
                  </p>
                </div>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="group hover:bg-blue-400 hover:text-white pt-1 border-t w-full border-neutral-100 cursor-pointer rounded-lg px-3.5 py-2 focus:outline-none sm:px-3 sm:py-0.5 flex items-center gap-x-3"
          >
            <LogOutIcon className="size-3" />
            Sign out
            {/* <span className="absolute inset-0" /> */}
          </button>
        </div>
      </div>
    </section>
  );
}
