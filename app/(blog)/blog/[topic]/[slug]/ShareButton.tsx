"use client";

import { useState, useCallback, useEffect } from "react";
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
  Twitter,
  Linkedin,
  PhoneIcon as WhatsApp,
  Copy,
  Share2,
  Mail,
  MessageCircle,
} from "lucide-react";
import { toast } from "@/components/ui/use-toast";

declare global {
  interface Window {
    gtag: (command: string, action: string, params: object) => void;
  }
}

interface ShareButtonProps {
  postId: string;
  initialShareCount: number;
  title: string;
  description: string;
  coverPhoto?: string | null;
}

export default function ShareButton({
  postId,
  initialShareCount,
  title,
  description,
  coverPhoto,
}: ShareButtonProps) {
  const [shareCount, setShareCount] = useState(initialShareCount);
  const [isSharing, setIsSharing] = useState(false);
  const [shareImage, setShareImage] = useState<string | null | undefined>(
    coverPhoto
  );

  useEffect(() => {
    if (!shareImage) {
      const ogImage = document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content");
      if (ogImage) {
        setShareImage(ogImage);
      }
    }
  }, [shareImage]);

  const handleShare = useCallback(
    async (method: string) => {
      if (isSharing) return;

      setIsSharing(true);
      try {
        let shared = false;
        const url = window.location.href;
        const shareText = `${title}\n\n${description}\n\n`;
        const encodedTitle = encodeURIComponent(title);
        const encodedDesc = encodeURIComponent(description);
        const encodedUrl = encodeURIComponent(url);

        // Create a shortened description for sharing
        const shortDesc =
          description.length > 100
            ? description.substring(0, 100) + "..."
            : description;

        const shareMethods: Record<string, () => Promise<void>> = {
          native: async () => {
            if (navigator.share) {
              await navigator.share({
                title,
                text: shortDesc,
                url,
              });
              shared = true;
            } else {
              toast({
                title: "Sharing not supported",
                description: "Your browser does not support native sharing.",
              });
            }
          },
          facebook: async () => {
            // Facebook will use the Open Graph meta tags from the page
            window.open(
              `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );
            shared = true;
          },
          twitter: async () => {
            // Twitter will use the Twitter card meta tags from the page
            window.open(
              `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );
            shared = true;
          },
          linkedin: async () => {
            window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );
            shared = true;
          },
          whatsapp: async () => {
            // WhatsApp doesn't support image previews via URL parameters, but we can include the text
            window.open(
              `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${shortDesc}\n\n${url}`)}`,
              "_blank",
              "noopener,noreferrer"
            );
            shared = true;
          },
          telegram: async () => {
            window.open(
              `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${title}\n\n${shortDesc}`)}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );
            shared = true;
          },
          email: async () => {
            window.location.href = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
              `${shortDesc}\n\nRead more: ${url}`
            )}`;
            shared = true;
          },
          copy: async () => {
            await navigator.clipboard.writeText(url);
            toast({
              title: "Link copied",
              description: "The URL has been copied to your clipboard.",
            });
            shared = true;
          },
        };

        if (shareMethods[method]) {
          await shareMethods[method]();
        }

        if (shared) {
          const newShareCount = await incrementShareCount(postId);
          setShareCount(newShareCount || shareCount + 1);

          if (typeof window !== "undefined" && window.gtag) {
            window.gtag("event", "share", {
              method: method,
              content_type: "blog",
              item_id: postId,
              title: title,
              url: url,
            });
          }
        }
      } catch (error) {
        console.error("Error sharing:", error);
        toast({
          title: "Error sharing",
          description: "There was an error while sharing. Please try again.",
          variant: "destructive",
        });
      } finally {
        setIsSharing(false);
      }
    },
    [postId, title, description, shareCount, isSharing]
  );

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          aria-label="Share this article"
          className="flex items-center gap-2 transition-colors hover:text-primary"
        >
          <Share2 className="h-4 w-4" />
          <span aria-label="Share count">{shareCount}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuItem
          onClick={() => handleShare("native")}
          disabled={isSharing}
        >
          <Share className="mr-2 h-4 w-4" /> Share
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("facebook")}
          disabled={isSharing}
        >
          <Facebook className="mr-2 h-4 w-4 text-blue-600" /> Facebook
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("twitter")}
          disabled={isSharing}
        >
          <Twitter className="mr-2 h-4 w-4 text-sky-500" /> Twitter
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("linkedin")}
          disabled={isSharing}
        >
          <Linkedin className="mr-2 h-4 w-4 text-blue-700" /> LinkedIn
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("whatsapp")}
          disabled={isSharing}
        >
          <WhatsApp className="mr-2 h-4 w-4 text-green-500" /> WhatsApp
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("telegram")}
          disabled={isSharing}
        >
          <MessageCircle className="mr-2 h-4 w-4 text-blue-500" /> Telegram
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("email")}
          disabled={isSharing}
        >
          <Mail className="mr-2 h-4 w-4" /> Email
        </DropdownMenuItem>
        <DropdownMenuItem
          onClick={() => handleShare("copy")}
          disabled={isSharing}
        >
          <Copy className="mr-2 h-4 w-4" /> Copy Link
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
