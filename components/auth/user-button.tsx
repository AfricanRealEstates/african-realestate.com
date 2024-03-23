import { getServerSession } from "next-auth";

import Login from "@/app/(auth)/login/page";
import { authOptions } from "@/lib/auth-options";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuTrigger,
} from "../ui/dropdown-menu";
import { Button } from "../ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { signOut } from "next-auth/react";

export default async function UserButton() {
  const session = await getServerSession(authOptions);
  if (!session?.user) return <Login />;
  return (
    <div className="flex gap-2 items-center">
      <span className="hidden text-sm sm:inline-flex">
        {session.user.email}
      </span>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" className="relative w-8 h-8 rounded-full">
            <Avatar className="w-8 h-8">
              {session.user.image && (
                <AvatarImage
                  src={session.user.image}
                  alt={session.user.name ?? ""}
                />
              )}
              <AvatarFallback>{session.user.email}</AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent className="w-56" align="end" forceMount>
          <DropdownMenuLabel className="font-normal">
            <div className="flex flex-col space-y-1">
              <p className="text-sm font-medium leading-none">
                {session.user.name}
              </p>
              <p className="text-xs leading-none text-muted-foreground">
                {session.user.email}
              </p>
            </div>
          </DropdownMenuLabel>
          <DropdownMenuItem>
            <Button
              variant="outline"
              onClick={() => signOut({ redirect: false })}
            >
              Sign Out
            </Button>
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
