"use client";

import React from "react";
import { Share2, Facebook, Twitter, Linkedin, Link, Mail } from "lucide-react";
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
        toast({
          title: "Sharing failed",
          description: "Please try another sharing method.",
          variant: "destructive",
        });
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = () => {
    navigator.clipboard.writeText(url).then(
      () => {
        toast({
          title: "Link copied!",
          description: "The blog post link has been copied to your clipboard.",
        });
      },
      (err) => {
        console.error("Could not copy text: ", err);
        toast({
          title: "Copy failed",
          description: "Please try again or use another sharing method.",
          variant: "destructive",
        });
      }
    );
  };

  const shareOnFacebook = () => {
    const facebookShareUrl = `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
      url
    )}`;
    window.open(facebookShareUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnTwitter = () => {
    const twitterShareUrl = `https://twitter.com/intent/tweet?url=${encodeURIComponent(
      url
    )}&text=${encodeURIComponent(title)}`;
    window.open(twitterShareUrl, "_blank", "noopener,noreferrer");
  };

  const shareOnLinkedIn = () => {
    const linkedInShareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
      url
    )}`;
    window.open(linkedInShareUrl, "_blank", "noopener,noreferrer");
  };

  const shareByEmail = () => {
    const subject = encodeURIComponent(title);
    const body = encodeURIComponent(
      `Check out this blog post: ${title}\n\n${summary}\n\nRead more at: ${url}`
    );
    window.location.href = `mailto:?subject=${subject}&body=${body}`;
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
        <DropdownMenuItem onClick={shareByEmail} className="cursor-pointer">
          <Mail className="mr-2 h-4 w-4" />
          <span>Email</span>
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
