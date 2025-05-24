import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface UserAvatarProps {
  user: {
    name: string | null;
    image: string | null;
  };
  className?: string;
}

export function UserAvatar({ user, className }: UserAvatarProps) {
  // Add timestamp to force image refresh and prevent caching
  const imageUrl = user.image ? `${user.image}?t=${Date.now()}` : undefined;

  return (
    <Avatar className={cn("size-8", className)}>
      <AvatarImage
        src={imageUrl || "/placeholder.svg"}
        alt={user.name || "User avatar"}
        onError={(e) => {
          // If image fails to load, hide it and show fallback
          const target = e.target as HTMLImageElement;
          target.style.display = "none";
        }}
      />
      <AvatarFallback>
        {user.name ? (
          <span className="text-sm font-medium">
            {user.name.charAt(0)?.toUpperCase() || "U"}
          </span>
        ) : (
          <User className="size-4" />
        )}
      </AvatarFallback>
    </Avatar>
  );
}
