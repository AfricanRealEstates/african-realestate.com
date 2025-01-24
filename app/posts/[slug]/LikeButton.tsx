"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { likePost, unlikePost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Heart } from "lucide-react";

export default function LikeButton({
  postId,
  initialLikeCount,
  initialIsLiked,
}: {
  postId: string;
  initialLikeCount: number;
  initialIsLiked: boolean;
}) {
  const [likeCount, setLikeCount] = useState(initialLikeCount);
  const [isLiked, setIsLiked] = useState(initialIsLiked);
  const { data: session } = useSession();

  const handleLike = async () => {
    if (!session) return;

    try {
      if (isLiked) {
        const newLikeCount = await unlikePost(postId);
        setLikeCount(newLikeCount);
        setIsLiked(false);
      } else {
        const newLikeCount = await likePost(postId);
        setLikeCount(newLikeCount);
        setIsLiked(true);
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    }
  };

  return (
    <Button
      onClick={handleLike}
      variant={isLiked ? "default" : "outline"}
      disabled={!session}
    >
      <Heart className={`mr-2 h-4 w-4 ${isLiked ? "fill-current" : ""}`} />
      {likeCount}
    </Button>
  );
}
