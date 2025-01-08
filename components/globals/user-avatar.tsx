import { User } from "@prisma/client";
import { AvatarProps } from "@radix-ui/react-avatar";
import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";
import { Icons } from "./icons";

interface UserAvatarProps extends AvatarProps {
  user: Pick<User, "image" | "name">;
}

export default function UserAvatar({ user, ...props }: UserAvatarProps) {
  return (
    <Avatar {...props}>
      {user.image ? (
        <AvatarImage
          alt="Profile"
          src={user.image}
          referrerPolicy="no-referrer"
        />
      ) : (
        <AvatarFallback>
          <span className="sr-only">{user.image}</span>
          <Icons.user className="size-4" />
        </AvatarFallback>
      )}
    </Avatar>
  );
}
