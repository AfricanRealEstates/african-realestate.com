"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { likePost, unlikePost } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

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
      variant="ghost"
      size="sm"
      className={cn(
        "flex items-center space-x-2 px-3 py-2 hover:bg-transparent",
        isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
      )}
      disabled={!session}
    >
      <AnimatePresence initial={false}>
        <motion.div
          key={isLiked ? "liked" : "unliked"}
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill={isLiked ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className={cn("w-6 h-6", isLiked ? "fill-current" : "")}
          >
            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
          </svg>
        </motion.div>
      </AnimatePresence>
      <span className="text-sm font-medium">{likeCount}</span>
    </Button>
  );
}
