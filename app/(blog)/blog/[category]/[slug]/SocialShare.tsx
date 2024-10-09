"use client";

import React from "react";
import { Share2, Facebook, Twitter, Linkedin, Link } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "@/components/ui/use-toast";

interface BlogShareProps {
  url: string;
  title: string;
  summary: string;
}

const BlogShare: React.FC<BlogShareProps> = ({ url, title, summary }) => {
  const shareData = {
    title: title,
    text: summary,
    url: url,
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url);
    toast({
      title: "Link copied!",
      description: "The blog post link has been copied to your clipboard.",
    });
  };

  const shareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/dialog/share?app_id=YOUR_FACEBOOK_APP_ID&display=popup&href=${encodeURIComponent(
      url
    )}&quote=${encodeURIComponent(title)}`;
    window.open(facebookShareUrl, "_blank", "width=600,height=400");
  };

  const shareOnTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(
        url
      )}&text=${encodeURIComponent(title)}`,
      "_blank"
    );
  };

  const shareOnLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(
        url
      )}&title=${encodeURIComponent(title)}&summary=${encodeURIComponent(
        summary
      )}`,
      "_blank"
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="flex items-center gap-2">
          <Share2 className="w-4 h-4" />
          Share
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem onClick={shareOnFacebook} className="cursor-pointer">
          <Facebook className="mr-2 h-4 w-4" />
          <span>Facebook</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnTwitter} className="cursor-pointer">
          <Twitter className="mr-2 h-4 w-4" />
          <span>Twitter</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={shareOnLinkedIn} className="cursor-pointer">
          <Linkedin className="mr-2 h-4 w-4" />
          <span>LinkedIn</span>
        </DropdownMenuItem>
        <DropdownMenuItem onClick={handleCopyLink} className="cursor-pointer">
          <Link className="mr-2 h-4 w-4" />
          <span>Copy link</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
};

export default BlogShare;
