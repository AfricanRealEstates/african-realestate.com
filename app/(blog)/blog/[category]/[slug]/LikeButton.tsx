"use client";

import { useState, useEffect } from "react";
import { ThumbsUp } from "lucide-react";
import { Button } from "@/components/ui/button";

interface User {
  id: string;
  // Add other user properties as needed
}

interface LikeButtonProps {
  slug: string;
  initialLikes: number;
  user: User | null;
}

async function handleLike(
  slug: string
): Promise<{ likes: number; isLiked: boolean }> {
  const response = await fetch(`/api/like/${slug}`, { method: "POST" });
  if (!response.ok) throw new Error("Failed to like the post");
  return response.json();
}

export default function LikeButton({
  slug,
  initialLikes,
  user,
}: LikeButtonProps) {
  const [likes, setLikes] = useState<number>(initialLikes);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const checkLikedStatus = async () => {
      if (user) {
        try {
          const response = await fetch(`/api/like/${slug}/status`);
          if (response.ok) {
            const { isLiked } = await response.json();
            setIsLiked(isLiked);
          }
        } catch (error) {
          console.error("Error checking like status:", error);
        }
      }
    };

    checkLikedStatus();
  }, [slug, user]);

  const onLike = async () => {
    if (!user) {
      alert("Please log in to like this post");
      return;
    }

    setIsLoading(true);

    try {
      const { likes: updatedLikes, isLiked: updatedIsLiked } = await handleLike(
        slug
      );
      setLikes(updatedLikes);
      setIsLiked(updatedIsLiked);
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Button
      variant="outline"
      size="sm"
      onClick={onLike}
      disabled={isLoading}
      className={`flex items-center gap-1 ${
        isLiked ? "text-blue-600 bg-blue-50" : ""
      }`}
    >
      <ThumbsUp className={`w-4 h-4 ${isLiked ? "fill-current" : ""}`} />
      <span>
        {Intl.NumberFormat("en-US", { notation: "compact" }).format(likes)}
      </span>
    </Button>
  );
}
