"use client";

import { useState } from "react";
import { incrementShareCount } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import { Share } from "lucide-react";

export default function ShareButton({
  postId,
  initialShareCount,
}: {
  postId: string;
  initialShareCount: number;
}) {
  const [shareCount, setShareCount] = useState(initialShareCount);

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: document.title,
          url: window.location.href,
        });
        const newShareCount = await incrementShareCount(postId);
        setShareCount(newShareCount || shareCount + 1);
      } else {
        // Fallback for browsers that don't support the Web Share API
        await navigator.clipboard.writeText(window.location.href);
        alert("Link copied to clipboard!");
        const newShareCount = await incrementShareCount(postId);
        setShareCount(newShareCount || shareCount + 1);
      }
    } catch (error) {
      console.error("Error sharing:", error);
    }
  };

  return (
    <Button onClick={handleShare} variant="outline">
      <Share className="mr-2 h-4 w-4" />
      {shareCount}
    </Button>
  );
}
