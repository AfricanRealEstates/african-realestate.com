// import {prisma }from "@/lib/prisma";
// import { cn } from "@/lib/utils";
// import { Heart } from "lucide-react";
// import React from "react";

// interface LikesProps {
//   propertyId: string;
// }

// export default async function Likes({ propertyId }: LikesProps) {
//   const likes = await prisma.like.findMany({
//     where: {
//       propertyId: propertyId,
//     },
//   });

//   return (
//     <>
//       {likes.length > 0 && (
//         <div className="flex items-center gap-0.5 bg-[rgba(11,33,50,.4)] p-1 py-0.5 w-fit rounded-md">
//           <Heart className={cn("size-3 text-red-500 fill-red-500")} />
//           <span className="text-white font-bold text-sm">{likes.length}</span>
//         </div>
//       )}
//     </>
//   );
// }
"use client";
import ActionIcon from "@/app/(private)/properties/[propertyDetails]/[id]/_components/ActionIcon";
import { likeProperty } from "@/lib/actions";
import { PropertyWithExtras } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Like } from "@prisma/client";
import { Heart, ThumbsUp } from "lucide-react";
import React, { useOptimistic } from "react";

export default function LikeButton({
  property,
  userId,
}: {
  property: PropertyWithExtras;
  userId?: string;
}) {
  const predicate = (like: Like) =>
    like.userId === userId && like.propertyId === property.id;
  const [optimisticLikes, addOptimisticLike] = useOptimistic<Like[]>(
    property.likes,
    // @ts-ignore
    (state: Like[], newLike: Like) =>
      // here we check if the like already exists, if it does, we remove it, if it doesn't, we add it
      state.some(predicate)
        ? state.filter((like) => like.userId !== userId)
        : [...state, newLike]
  );
  return (
    <div className="flex flex-col">
      <form
        action={async (formData: FormData) => {
          const propertyId = formData.get("propertyId");
          addOptimisticLike({ propertyId, userId });

          await likeProperty(propertyId);
        }}
      >
        <input type="hidden" name="propertyId" value={property.id} />

        <ActionIcon>
          <ThumbsUp
            className={cn("h-6 w-6 text-gray-400", {
              "text-red-500 fill-red-500": optimisticLikes.some(predicate),
            })}
          />
        </ActionIcon>
      </form>
      {optimisticLikes.length > 0 && (
        <p className="text-sm font-bold dark:text-white">
          {optimisticLikes.length}{" "}
          {optimisticLikes.length === 1 ? "like" : "likes"}
        </p>
      )}
    </div>
  );
}
