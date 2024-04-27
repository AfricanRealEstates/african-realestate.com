import React from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import UserAvatar from "../globals/user-avatar";
import { User } from "next-auth";
import Link from "next/link";
import { ArrowUpDown, LayoutDashboard, LogOut, Settings } from "lucide-react";
import { Icons } from "../globals/icons";
import { signOut } from "next-auth/react";

interface UserAccountNavProps extends React.HTMLAttributes<HTMLDivElement> {
  user: Pick<User, "name" | "image" | "email">;
}

const menuLinks = [
  {
    link: "/dashboard",
    label: "Dashboard",
    icon: <LayoutDashboard className="size-4 text-gray-400" />,
  },
  {
    link: "/dashboard/transactions",
    label: "Transactions",
    icon: <ArrowUpDown className="size-4 text-gray-400" />,
  },
  {
    link: "/dashboard/account",
    label: "Account",
    icon: <Settings className="size-4 text-gray-400" />,
  },
];
export default function UserAccountNav({ user }: UserAccountNavProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger>
        <UserAvatar
          user={{ name: user.name || null, image: user?.image || null }}
          className="size-8"
        />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            {user?.name && <p className="font-medium">{user.name}</p>}
            {user?.email && (
              <p className="truncate text-sm text-muted-foreground">
                {user.email}
              </p>
            )}
          </div>
        </div>
        <DropdownMenuSeparator />
        {menuLinks.map((menuLink) => {
          const { link, label, icon } = menuLink;
          return (
            <DropdownMenuItem asChild key={link}>
              <Link href={link} className="flex items-center space-x-2.5">
                {icon}
                <p className="text-sm">{label}</p>
              </Link>
            </DropdownMenuItem>
          );
        })}

        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="cursor-pointer"
          onSelect={(event) => {
            event.preventDefault();
            signOut({ callbackUrl: `${window.location.origin}` });
          }}
        >
          <div className="flex items-center space-x-2.5">
            <LogOut className="size-4" />
            <p className="text-sm">Log out</p>
          </div>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
