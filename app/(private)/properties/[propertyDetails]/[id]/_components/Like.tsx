"use client";

import { useEffect, useState } from "react";
import { Like } from "@prisma/client";
import { ThumbsUp, Loader } from "lucide-react"; // Add a loader icon
import { cn } from "@/lib/utils";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import { likeProperty, getPropertyLikes } from "@/lib/actions"; // Ensure you have a function to fetch likes
import { toast } from "sonner"; // Import toast from sonner

function LikeButton({
  property,
  userId,
}: {
  property: PropertyWithExtras;
  userId: string | null; // Allow userId to be nullable to check if the user is logged in
}) {
  const predicate = (like: Like) =>
    like.userId === userId && like.propertyId === property.id;

  // State to manage likes and loading state
  const [likes, setLikes] = useState<Like[]>(property.likes || []);
  const [hasLiked, setHasLiked] = useState(false);
  const [loading, setLoading] = useState(false); // New loading state

  // Function to handle the like action and refetch the likes
  const handleLike = async (propertyId: string) => {
    if (!userId) {
      // If the user is not signed in, show a toast message
      toast.error("You need to sign in to like properties!");
      return;
    }

    try {
      setLoading(true); // Start loading state

      // Optimistic update
      const optimisticLikes = likes.some(predicate)
        ? likes.filter((like) => like.userId !== userId)
        : [...likes, { propertyId, userId } as Like];

      setLikes(optimisticLikes);

      // Call the action to update on the server
      await likeProperty(propertyId);

      // After server update, refetch the likes to sync with the server
      const updatedLikes = await getPropertyLikes(propertyId);
      setLikes(updatedLikes);

      setLoading(false); // End loading state
    } catch (error) {
      setLoading(false); // End loading state in case of error
      toast.error("Something went wrong. Please try again.");
    }
  };

  useEffect(() => {
    const userLike = likes.some(predicate);
    setHasLiked(userLike); // Set whether the user has liked the property
  }, [likes, userId, property.id]);

  useEffect(() => {
    const fetchLikes = async () => {
      const updatedLikes = await getPropertyLikes(property.id);
      setLikes(updatedLikes);
    };

    fetchLikes();
  }, [property.id]);

  return (
    <div className="flex items-center">
      <form
        action={async (formData: FormData) => {
          const propertyId = formData.get("propertyId") as string;
          await handleLike(propertyId); // Call the like handling function
        }}
      >
        <input type="hidden" name="propertyId" value={property.id} />

        <ActionIcon>
          {loading ? (
            <Loader className="size-5 animate-spin text-gray-400" /> // Loader icon with spin animation
          ) : (
            <ThumbsUp
              className={cn("size-5 text-gray-400", {
                "text-rose-500 fill-rose-500": hasLiked, // Apply red color if the user has liked the property
              })}
            />
          )}
        </ActionIcon>
      </form>

      {/* Show the number of likes */}
      {likes.length > 0 && (
        <p className="text-sm font-bold flex ">{likes.length}</p>
      )}
    </div>
  );
}

export default LikeButton;
