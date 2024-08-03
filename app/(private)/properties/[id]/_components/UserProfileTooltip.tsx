import UserAvatar from "@/components/crm/UserAvatar";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { UserData } from "@/lib/types";
import { formatDate } from "date-fns";
import Link from "next/link";
import React, { PropsWithChildren } from "react";

interface UserTooltipProps extends PropsWithChildren {
  user?: UserData;
  id?: string;
}

export default function UserProfileTooltip({
  children,
  user,
  id,
}: UserTooltipProps) {
  return (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>{children}</TooltipTrigger>
        <TooltipContent>
          <section className="max-w-80 flex flex-col gap-3 break-words px-1 py-2 5 md:min-w-32">
            <div className="flex items-center justify-between gap-2">
              <UserAvatar size={70} avatarUrl={user?.image} />
            </div>

            <div>
              <Link href={`/agencies/${id}`}>
                <div className="text-lg font-semibold hover:underline">
                  {user?.name}
                </div>
              </Link>
            </div>
            {user?.createdAt && (
              <div className="line-clamp-4 whitespace-pre-line">
                Member since {formatDate(user?.createdAt, "MMM d, yyyy")}
              </div>
            )}

            <div className="text-muted-foreground">
              {user?._count.properties} properties posted.
            </div>
          </section>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
