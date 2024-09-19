// components/LikeButton.tsx
"use client";

import { useState } from "react";
import { Heart, ThumbsUp } from "lucide-react";
import { likeBlogPost } from "@/actions/LikeBlogPost";
import { toast } from "sonner";

export function LikeButton({
  slug,
  initialLikes,
  initialLiked,
}: {
  slug: string;
  initialLikes: any;
  initialLiked: any;
}) {
  const [likes, setLikes] = useState(initialLikes);
  const [liked, setLiked] = useState(initialLiked);

  const handleLike = async () => {
    try {
      const result = await likeBlogPost(slug);
      setLikes(result.likes);
      setLiked(result.liked);
      toast.success(result.liked ? "Post liked!" : "Post unliked!");
    } catch (error) {
      console.error("Failed to like post:", error);
      toast.error("Failed to like post. Please try again.");
    }
  };

  return (
    <button
      onClick={handleLike}
      className={`flex items-center gap-2 ${
        liked ? "text-red-500" : "text-gray-500"
      }`}
    >
      <ThumbsUp className={liked ? "fill-current" : ""} />
      <span>{likes}</span>
    </button>
  );
}
