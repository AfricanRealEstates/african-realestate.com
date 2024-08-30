import { PropertyWithExtras } from "@/lib/types";
import { cn } from "@/lib/utils";
import React from "react";
import LikeButton from "./Like";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";

type Props = {
  property: PropertyWithExtras;
  userId?: string;
  className?: string;
};

export default function PropertyActions({
  property,
  userId,
  className,
}: Props) {
  return (
    <div className={cn("relative flex items-start w-full gap-x-2", className)}>
      <LikeButton property={property} userId={userId!} />
      <ShareButton propertyId={property.id} property={property} />
      <BookmarkButton property={property} userId={userId!} />
    </div>
  );
}
