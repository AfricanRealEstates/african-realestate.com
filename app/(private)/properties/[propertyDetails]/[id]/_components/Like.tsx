"use client";

import { cn } from "@/lib/utils";
import { Like } from "@prisma/client";
import { Heart } from "lucide-react";
import { useOptimistic } from "react";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import { likeProperty } from "@/lib/actions";

function LikeButton({
  property,
  userId,
}: {
  property: PropertyWithExtras;
  userId?: string;
}) {
  const predicate = (like: Like) =>
    like.userId === userId && like.propertyId === property.id;

  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    property.likes || [], // Ensure property.likes is not undefined
    // @ts-ignore
    (state: Like[], newLike: Like) =>
      state.some(predicate)
        ? state.filter((like) => like.userId !== userId)
        : [...state, newLike]
  );

  return (
    <div className="flex flex-col">
      <form
        action={async (formData: FormData) => {
          const propertyId = formData.get("propertyId") as string;
          addOptimisticLike({ propertyId, userId } as Like);

          await likeProperty(propertyId);
        }}
      >
        <input type="hidden" name="propertyId" value={property.id} />

        <ActionIcon>
          <Heart
            className={cn("h-6 w-6", {
              "text-red-500 fill-red-500": optimisticLikes.some(predicate),
            })}
          />
        </ActionIcon>
      </form>
      {optimisticLikes && optimisticLikes.length > 0 && (
        <p className="text-sm font-bold dark:text-white">
          {optimisticLikes.length}{" "}
          {optimisticLikes.length === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}

export default LikeButton;
