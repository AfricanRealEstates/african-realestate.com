import { cn } from "@/lib/utils";
import Image from "next/image";
import React from "react";
interface UserAvatarProps {
  avatarUrl: string | null | undefined;
  size?: number;
  className?: string;
}
export default function UserAvatar({
  avatarUrl,
  size,
  className,
}: UserAvatarProps) {
  return (
    <img
      src={avatarUrl || "/assets/avatar-placeholder.png"}
      alt="User Avatar"
      width={size ?? 32}
      height={size ?? 32}
      className={cn(
        // "aspect-square h-fit flex-none rounded-full object-cover outline-none",
        className
      )}
    />
  );
}
