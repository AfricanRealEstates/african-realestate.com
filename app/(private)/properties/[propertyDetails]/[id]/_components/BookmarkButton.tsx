"use client";

import { useEffect, useState } from "react";
import { SavedProperty } from "@prisma/client";
import { Bookmark, Loader } from "lucide-react"; // Use a loader icon from lucide-react
import { cn } from "@/lib/utils";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import { bookmarkProperty, getPropertyBookmarks } from "@/lib/actions";
import { toast } from "sonner";

type Props = {
  property: PropertyWithExtras;
  userId: string | null; // Allow userId to be nullable to check if the user is logged in
};

function BookmarkButton({ property, userId }: Props) {
  const predicate = (bookmark: SavedProperty) =>
    bookmark.userId === userId && bookmark.propertyId === property.id;

  // State to manage bookmarks after fetching from the server
  const [bookmarks, setBookmarks] = useState<SavedProperty[]>(
    property.savedBy || []
  );
  const [hasBookmarked, setHasBookmarked] = useState(false);
  const [loading, setLoading] = useState(false); // State to manage loading status

  // Function to handle the bookmark action and refetch the bookmarks
  const handleBookmark = async (propertyId: string) => {
    if (!userId) {
      toast.error("You need to be signed in to bookmark properties!");
      return;
    }

    setLoading(true); // Set loading to true when the action starts

    try {
      // Optimistic update
      const optimisticBookmarks = bookmarks.some(predicate)
        ? bookmarks.filter((bookmark) => bookmark.userId !== userId)
        : [...bookmarks, { propertyId, userId } as SavedProperty];

      setBookmarks(optimisticBookmarks);

      // Call the action to update on the server
      await bookmarkProperty(propertyId);

      // After server update, refetch the bookmarks to sync with the server
      const updatedBookmarks = await getPropertyBookmarks(propertyId);
      setBookmarks(updatedBookmarks);

      toast.success(
        bookmarks.some(predicate) ? "Bookmark removed!" : "Property bookmarked!"
      );
    } catch (error) {
      toast.error("Something went wrong, please try again.");
    } finally {
      setLoading(false); // Reset loading to false when the action is complete
    }
  };

  useEffect(() => {
    const userBookmark = bookmarks.some(predicate);
    setHasBookmarked(userBookmark);
  }, [bookmarks, userId, property.id]);

  useEffect(() => {
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
        await handleBookmark(propertyId);
      }}
      className="ml-auto"
    >
      <input type="hidden" name="propertyId" value={property.id} />

      <ActionIcon>
        {loading ? (
          <Loader className="animate-spin size-5 text-gray-400" /> // Show loader icon when loading
        ) : (
          <Bookmark
            className={cn("size-5 text-gray-400", {
              "fill-yellow-400 text-yellow-400 border-yellow-300":
                hasBookmarked,
            })}
          />
        )}
      </ActionIcon>
    </form>
  );
}

export default BookmarkButton;
