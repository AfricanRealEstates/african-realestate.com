"use client";

import { useEffect, useState } from "react";
import { SavedProperty } from "@prisma/client";
import { Bookmark } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import { bookmarkProperty, getPropertyBookmarks } from "@/lib/actions"; // Ensure you have a function to fetch bookmarks

type Props = {
  property: PropertyWithExtras;
  userId: string;
};

function BookmarkButton({ property, userId }: Props) {
  const predicate = (bookmark: SavedProperty) =>
    bookmark.userId === userId && bookmark.propertyId === property.id;

  // State to manage bookmarks after fetching from the server
  const [bookmarks, setBookmarks] = useState<SavedProperty[]>(
    property.savedBy || []
  );
  const [hasBookmarked, setHasBookmarked] = useState(false);

  // Function to handle the bookmark action and refetch the bookmarks
  const handleBookmark = async (propertyId: string) => {
    // Optimistic update
    const optimisticBookmarks = bookmarks.some(predicate)
      ? bookmarks.filter((bookmark) => bookmark.userId !== userId)
      : [...bookmarks, { propertyId, userId } as SavedProperty];

    setBookmarks(optimisticBookmarks);

    // Call the action to update on the server
    await bookmarkProperty(propertyId);

    // After server update, refetch the bookmarks to sync with server
    const updatedBookmarks = await getPropertyBookmarks(propertyId);
    setBookmarks(updatedBookmarks); // Update bookmarks with the server response
  };

  // Check if the user has already bookmarked the property on component mount
  useEffect(() => {
    const userBookmark = bookmarks.some(predicate);
    setHasBookmarked(userBookmark); // Set whether the user has bookmarked the property
  }, [bookmarks, userId, property.id]);

  useEffect(() => {
    // Fetch updated bookmarks from server on mount
    const fetchBookmarks = async () => {
      const updatedBookmarks = await getPropertyBookmarks(property.id);
      setBookmarks(updatedBookmarks);
    };

    fetchBookmarks();
  }, [property.id]);

  return (
    <form
      action={async (formData: FormData) => {
        const propertyId = formData.get("propertyId") as string;
        await handleBookmark(propertyId); // Call the bookmark handling function
      }}
      className="ml-auto"
    >
      <input type="hidden" name="propertyId" value={property.id} />

      <ActionIcon>
        <Bookmark
          className={cn("size-5 text-gray-400", {
            "fill-yellow-400 text-yellow-400 border-yellow-300": hasBookmarked, // Apply blue color if the user has bookmarked the property
          })}
        />
      </ActionIcon>
    </form>
  );
}

export default BookmarkButton;
