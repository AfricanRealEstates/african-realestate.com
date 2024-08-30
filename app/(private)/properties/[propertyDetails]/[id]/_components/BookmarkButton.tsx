"use client";

import { bookmarkProperty } from "@/lib/actions";
import { PropertyWithExtras } from "@/lib/types";
import { cn } from "@/lib/utils";

import { SavedProperty } from "@prisma/client";
import { Bookmark } from "lucide-react";
import { useOptimistic } from "react";
import ActionIcon from "./ActionIcon";

type Props = {
  property: PropertyWithExtras;
  userId: string;
};

function BookmarkButton({ property, userId }: Props) {
  const predicate = (bookmark: SavedProperty) =>
    bookmark.userId === userId && bookmark.propertyId === property.id;

  const [optimisticBookmarks, addOptimisticBookmark] = useOptimistic<
    SavedProperty[]
  >(
    property.savedBy || [], // Ensure this is always an array
    // @ts-ignore
    (state: SavedProperty[], newBookmark: SavedProperty) =>
      state.find(predicate)
        ? state.filter((bookmark) => bookmark.userId !== userId)
        : [...state, newBookmark]
  );

  return (
    <form
      action={async (formData: FormData) => {
        const propertyId = formData.get("propertyId");
        addOptimisticBookmark({ propertyId, userId } as SavedProperty);
        await bookmarkProperty(propertyId);
      }}
      className="ml-auto"
    >
      <input type="hidden" name="propertyId" value={property.id} />

      <ActionIcon>
        <Bookmark
          className={cn("h-6 w-6", {
            "fill-black": optimisticBookmarks.some(predicate),
          })}
        />
      </ActionIcon>
    </form>
  );
}

export default BookmarkButton;
