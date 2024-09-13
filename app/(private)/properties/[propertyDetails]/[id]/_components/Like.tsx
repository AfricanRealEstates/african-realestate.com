"use client";

import { useEffect, useState } from "react";
import { Like } from "@prisma/client";
import { ThumbsUp } from "lucide-react";
import { cn } from "@/lib/utils";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import { likeProperty, getPropertyLikes } from "@/lib/actions"; // Ensure you have a function to fetch likes

function LikeButton({
  property,
  userId,
}: {
  property: PropertyWithExtras;
  userId: string;
}) {
  const predicate = (like: Like) =>
    like.userId === userId && like.propertyId === property.id;

  // State to manage likes after fetching from the server
  const [likes, setLikes] = useState<Like[]>(property.likes || []);
  const [hasLiked, setHasLiked] = useState(false);

  // Function to handle the like action and refetch the likes
  const handleLike = async (propertyId: string) => {
    // Optimistic update
    const optimisticLikes = likes.some(predicate)
      ? likes.filter((like) => like.userId !== userId)
      : [...likes, { propertyId, userId } as Like];

    setLikes(optimisticLikes);

    // Call the action to update on the server
    await likeProperty(propertyId);

    // After server update, refetch the likes to sync with server
    const updatedLikes = await getPropertyLikes(propertyId);
    setLikes(updatedLikes); // Update likes with the server response
  };

  // Check if the user has already liked the property on component mount
  useEffect(() => {
    const userLike = likes.some(predicate);
    setHasLiked(userLike); // Set whether the user has liked the property
  }, [likes, userId, property.id]);

  useEffect(() => {
    // Fetch updated likes from server on mount
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
          <ThumbsUp
            className={cn("size-5 text-gray-400", {
              "text-rose-500 fill-rose-500": hasLiked, // Apply red color if the user has liked the property
            })}
          />
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
