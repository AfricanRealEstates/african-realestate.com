import prisma from "@/lib/prisma";
import { cn } from "@/lib/utils";
import { Heart } from "lucide-react";
import React from "react";

interface LikesProps {
  propertyId: string;
}

export default async function Likes({ propertyId }: LikesProps) {
  const likes = await prisma.like.findMany({
    where: {
      propertyId: propertyId,
    },
  });

  return (
    <>
      {likes.length > 0 && (
        <div className="flex items-center gap-0.5 bg-[rgba(11,33,50,.4)] p-1 py-0.5 w-fit rounded-md">
          <Heart className={cn("size-3 text-red-500 fill-red-500")} />
          <span className="text-white font-bold text-sm">{likes.length}</span>
        </div>
      )}
    </>
  );
}
