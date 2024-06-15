import { LogOutIcon } from "lucide-react";
import { signOut } from "next-auth/react";
import Link from "next/link";
import React from "react";

const avatar = [
  {
    name: "My properties",
    href: "/dashboard",
  },
  {
    name: "Profile Account",
    href: "/dashboard/account",
  },
];

export default function AvatarMenu() {
  const handleSignOut = async () => {
    await signOut({ callbackUrl: "/" });
  };
  return (
    <section className="border rounded-sm shadow-md bg-white absolute top-full text-gray-400">
      <div className="flex cursor-pointer p-3">
        <div className="flex flex-col items-start space-y-3">
          {avatar.map((link) => {
            const { name, href } = link;
            return (
              <Link
                href={href}
                key={name}
                className="group flex items-center gap-4"
              >
                <div className="space-y-2 p-2">
                  <p className="w-40 font-medium text-neutral-500 hover:text-blue-400 transition-colors">
                    {name}
                  </p>
                </div>
              </Link>
            );
          })}
          <button
            onClick={handleSignOut}
            className="group cursor-pointer rounded-lg px-3.5 py-0.5 focus:outline-none sm:px-3 sm:py-0.5 flex items-center gap-x-3"
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
