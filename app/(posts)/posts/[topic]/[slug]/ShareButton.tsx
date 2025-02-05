"use client";

import { useState } from "react";
import { incrementShareCount } from "@/actions/blog";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Share,
  Facebook,
  PhoneIcon as WhatsApp,
  Copy,
  Share2,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

export default function ShareButton({
  postId,
  initialShareCount,
}: {
  postId: string;
  initialShareCount: number;
}) {
  const [shareCount, setShareCount] = useState(initialShareCount);

  const handleShare = async (method: string) => {
    try {
      let shared = false;
      const url = window.location.href;
      const title = document.title;

      switch (method) {
        case "native":
          if (navigator.share) {
            await navigator.share({ title, url });
            shared = true;
          }
          break;
        case "facebook":
          window.open(
            `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
              url
            )}`,
            "_blank"
          );
          shared = true;
          break;
        case "whatsapp":
          window.open(
            `https://wa.me/?text=${encodeURIComponent(title + " " + url)}`,
            "_blank"
          );
          shared = true;
          break;
        case "copy":
          await navigator.clipboard.writeText(url);
          toast({
            title: "Link copied",
            description: "The URL has been copied to your clipboard.",
          });
          shared = true;
          break;
      }

      if (shared) {
        const newShareCount = await incrementShareCount(postId);
        setShareCount(newShareCount || shareCount + 1);
      }
    } catch (error) {
      console.error("Error sharing:", error);
      toast({
        title: "Error",
        description: "There was an error while sharing. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Share2 className="mr-2 h-4 w-4" />
          {shareCount}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuItem onClick={() => handleShare("native")}>
          <Share className="mr-2 h-4 w-4" />
          Share
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("facebook")}>
          <Facebook className="mr-2 h-4 w-4" />
          Facebook
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("whatsapp")}>
          <WhatsApp className="mr-2 h-4 w-4" />
          WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem onClick={() => handleShare("copy")}>
          <Copy className="mr-2 h-4 w-4" />
          Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
