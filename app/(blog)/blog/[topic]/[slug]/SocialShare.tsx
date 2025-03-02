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
  const shareData = { title, text: summary, url };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        console.error("Error sharing:", err);
        toast({
          title: "Sharing failed",
          description: "Please try another method.",
          variant: "destructive",
        });
      }
    } else {
      handleCopyLink();
    }
  };

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url);
      toast({
        title: "Link copied!",
        description: "The blog post link has been copied to your clipboard.",
      });
    } catch (err) {
      console.error("Could not copy text: ", err);
      toast({
        title: "Copy failed",
        description: "Try again or use another sharing method.",
        variant: "destructive",
      });
    }
  };

  const socialPlatforms = [
    {
      name: "Facebook",
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`,
      icon: Facebook,
    },
    {
      name: "Twitter",
      url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(title)}`,
      icon: Twitter,
    },
    {
      name: "LinkedIn",
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`,
      icon: Linkedin,
    },
  ];

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
        {socialPlatforms.map(({ name, url, icon: Icon }) => (
          <DropdownMenuItem
            key={name}
            onClick={() => window.open(url, "_blank", "noopener,noreferrer")}
            className="cursor-pointer"
          >
            <Icon className="mr-2 h-4 w-4" />
            <span>{name}</span>
          </DropdownMenuItem>
        ))}
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
