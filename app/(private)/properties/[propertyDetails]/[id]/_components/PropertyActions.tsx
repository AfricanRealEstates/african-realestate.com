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
    <div className={cn("", className)}>
      {/* <LikeButton property={property} userId={userId!} /> */}
      {/* <BookmarkButton property={property} userId={userId!} /> */}
      <ShareButton propertyId={property.id} property={property} />
    </div>
  );
}
