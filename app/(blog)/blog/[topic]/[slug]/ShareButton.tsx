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
      // Try to get the image from Open Graph meta tags
      const ogImage = document
        .querySelector('meta[property="og:image"]')
        ?.getAttribute("content");

      // Fallback to Twitter image if OG image is not available
      const twitterImage = document
        .querySelector('meta[name="twitter:image"]')
        ?.getAttribute("content");

      setShareImage(ogImage || twitterImage || null);
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

        const shareMethods: Record<string, () => Promise<boolean>> = {
          native: async () => {
            if (navigator.share) {
              try {
                await navigator.share({
                  title,
                  text: shortDesc,
                  url,
                });
                return true;
              } catch (error) {
                // User cancelled or sharing failed
                console.log("Native sharing cancelled or failed:", error);
                return false;
              }
            } else {
              toast({
                title: "Sharing not supported",
                description: "Your browser does not support native sharing.",
              });
              return false;
            }
          },
          facebook: async () => {
            // Use Facebook's sharing dialog with explicit image parameter if available
            const fbShareUrl = shareImage
              ? `https://www.facebook.com/dialog/share?app_id=746690373660443&display=popup&href=${encodedUrl}&picture=${encodeURIComponent(shareImage)}&quote=${encodedTitle}`
              : `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`;

            const shareWindow = window.open(
              fbShareUrl,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );

            // We can't reliably detect if sharing was successful with Facebook
            // So we'll use a timeout and check if the window was closed
            return new Promise((resolve) => {
              const checkClosed = setInterval(() => {
                if (shareWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve(true);
                }
              }, 1000);

              // Timeout after 30 seconds
              setTimeout(() => {
                clearInterval(checkClosed);
                resolve(true); // Assume success after timeout
              }, 30000);
            });
          },
          twitter: async () => {
            // Twitter will use the Twitter card meta tags, but we can also include hashtags
            const hashtags = title
              .split(" ")
              .filter((word) => word.startsWith("#"))
              .map((tag) => tag.substring(1))
              .join(",");

            const shareWindow = window.open(
              `https://twitter.com/intent/tweet?url=${encodedUrl}&text=${encodedTitle}${hashtags ? `&hashtags=${hashtags}` : ""}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );

            // Similar approach as Facebook
            return new Promise((resolve) => {
              const checkClosed = setInterval(() => {
                if (shareWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve(true);
                }
              }, 1000);

              setTimeout(() => {
                clearInterval(checkClosed);
                resolve(true);
              }, 30000);
            });
          },
          linkedin: async () => {
            const shareWindow = window.open(
              `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );

            return new Promise((resolve) => {
              const checkClosed = setInterval(() => {
                if (shareWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve(true);
                }
              }, 1000);

              setTimeout(() => {
                clearInterval(checkClosed);
                resolve(true);
              }, 30000);
            });
          },
          whatsapp: async () => {
            const shareWindow = window.open(
              `https://wa.me/?text=${encodeURIComponent(`${title}\n\n${shortDesc}\n\n${url}`)}`,
              "_blank",
              "noopener,noreferrer"
            );

            return new Promise((resolve) => {
              const checkClosed = setInterval(() => {
                if (shareWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve(true);
                }
              }, 1000);

              setTimeout(() => {
                clearInterval(checkClosed);
                resolve(true);
              }, 30000);
            });
          },
          telegram: async () => {
            const shareWindow = window.open(
              `https://t.me/share/url?url=${encodedUrl}&text=${encodeURIComponent(`${title}\n\n${shortDesc}`)}`,
              "_blank",
              "width=600,height=400,noopener,noreferrer"
            );

            return new Promise((resolve) => {
              const checkClosed = setInterval(() => {
                if (shareWindow?.closed) {
                  clearInterval(checkClosed);
                  resolve(true);
                }
              }, 1000);

              setTimeout(() => {
                clearInterval(checkClosed);
                resolve(true);
              }, 30000);
            });
          },
          email: async () => {
            window.location.href = `mailto:?subject=${encodedTitle}&body=${encodeURIComponent(
              `${shortDesc}\n\nRead more: ${url}`
            )}`;
            return true;
          },
          copy: async () => {
            try {
              await navigator.clipboard.writeText(url);
              toast({
                title: "Link copied",
                description: "The URL has been copied to your clipboard.",
              });
              return true;
            } catch (error) {
              console.error("Failed to copy:", error);
              return false;
            }
          },
          pinterest: async () => {
            if (shareImage) {
              const shareWindow = window.open(
                `https://pinterest.com/pin/create/button/?url=${encodedUrl}&media=${encodeURIComponent(shareImage)}&description=${encodedDesc}`,
                "_blank",
                "width=600,height=400,noopener,noreferrer"
              );

              return new Promise((resolve) => {
                const checkClosed = setInterval(() => {
                  if (shareWindow?.closed) {
                    clearInterval(checkClosed);
                    resolve(true);
                  }
                }, 1000);

                setTimeout(() => {
                  clearInterval(checkClosed);
                  resolve(true);
                }, 30000);
              });
            } else {
              toast({
                title: "No image available",
                description:
                  "Pinterest sharing requires an image. Try another sharing method.",
              });
              return false;
            }
          },
        };

        if (shareMethods[method]) {
          shared = await shareMethods[method]();
        }

        if (shared) {
          // Only increment share count if sharing was successful
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

          toast({
            title: "Shared successfully",
            description: `You've shared this article via ${method}`,
          });
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
    [postId, title, description, shareCount, isSharing, shareImage]
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
          onClick={() => handleShare("pinterest")}
          disabled={isSharing || !shareImage}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            className="mr-2 h-4 w-4 text-red-600"
            fill="currentColor"
          >
            <path d="M12 0c-6.627 0-12 5.373-12 12 0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738.098.119.112.224.083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.631-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146 1.124.347 2.317.535 3.554.535 6.627 0 12-5.373 12-12 0-6.628-5.373-12-12-12z" />
          </svg>
          Pinterest
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
