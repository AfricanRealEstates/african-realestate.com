"use client";

import { Link, Share2 } from "lucide-react";
import { toast } from "sonner";
import ActionIcon from "./ActionIcon";
import { PropertyWithExtras } from "@/lib/types";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { Button } from "@/components/ui/button";

function ShareButton({
  propertyId,
  property,
}: {
  propertyId: string;
  property: PropertyWithExtras;
}) {
  const shareUrl = `${window.location.origin}/properties/${property.propertyDetails}/${propertyId}`;

  const shareToFacebook = () => {
    window.open(
      `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const shareToTwitter = () => {
    window.open(
      `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}`,
      "_blank"
    );
  };

  const shareToLinkedIn = () => {
    window.open(
      `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(
        shareUrl
      )}`,
      "_blank"
    );
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    toast.success("Link copied to clipboard. Share now!", {
      icon: <Link className="h-5 w-5" />,
    });
  };

  return (
    <NavigationMenu>
      <NavigationMenuList>
        <NavigationMenuItem>
          <NavigationMenuTrigger>
            <Share2 className="size-4 text-gray-400" />
            {/* <span>
              <ActionIcon>
              </ActionIcon>
            </span> */}
          </NavigationMenuTrigger>
          <NavigationMenuContent>
            <div className="p-2 space-y-2 w-48">
              <Button
                variant="ghost"
                className="w-full justify-start flex gap-2"
                onClick={shareToFacebook}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 36 36"
                  fill="url(#a)"
                  height="20"
                  width="20"
                >
                  <defs>
                    <linearGradient
                      x1="50%"
                      x2="50%"
                      y1="97.078%"
                      y2="0%"
                      id="a"
                    >
                      <stop offset="0%" stop-color="#0062E0" />
                      <stop offset="100%" stop-color="#19AFFF" />
                    </linearGradient>
                  </defs>
                  <path d="M15 35.8C6.5 34.3 0 26.9 0 18 0 8.1 8.1 0 18 0s18 8.1 18 18c0 8.9-6.5 16.3-15 17.8l-1-.8h-4l-1 .8z" />
                  <path
                    fill="#FFF"
                    d="m25 23 .8-5H21v-3.5c0-1.4.5-2.5 2.7-2.5H26V7.4c-1.3-.2-2.7-.4-4-.4-4.1 0-7 2.5-7 7v4h-4.5v5H15v12.7c1 .2 2 .3 3 .3s2-.1 3-.3V23h4z"
                  />
                </svg>
                Facebook
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start flex gap-2"
                onClick={shareToTwitter}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="14"
                  height="14"
                  fill="none"
                  viewBox="0 0 1200 1227"
                >
                  <path
                    fill="#000"
                    d="M714.163 519.284 1160.89 0h-105.86L667.137 450.887 357.328 0H0l468.492 681.821L0 1226.37h105.866l409.625-476.152 327.181 476.152H1200L714.137 519.284h.026ZM569.165 687.828l-47.468-67.894-377.686-540.24h162.604l304.797 435.991 47.468 67.894 396.2 566.721H892.476L569.165 687.854v-.026Z"
                  />
                </svg>
                Twitter
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start flex gap-2"
                onClick={shareToLinkedIn}
              >
                <svg
                  width="18"
                  height="18"
                  xmlns="http://www.w3.org/2000/svg"
                  preserveAspectRatio="xMidYMid"
                  viewBox="0 0 256 256"
                >
                  <path
                    d="M218.123 218.127h-37.931v-59.403c0-14.165-.253-32.4-19.728-32.4-19.756 0-22.779 15.434-22.779 31.369v60.43h-37.93V95.967h36.413v16.694h.51a39.907 39.907 0 0 1 35.928-19.733c38.445 0 45.533 25.288 45.533 58.186l-.016 67.013ZM56.955 79.27c-12.157.002-22.014-9.852-22.016-22.009-.002-12.157 9.851-22.014 22.008-22.016 12.157-.003 22.014 9.851 22.016 22.008A22.013 22.013 0 0 1 56.955 79.27m18.966 138.858H37.95V95.967h37.97v122.16ZM237.033.018H18.89C8.58-.098.125 8.161-.001 18.471v219.053c.122 10.315 8.576 18.582 18.89 18.474h218.144c10.336.128 18.823-8.139 18.966-18.474V18.454c-.147-10.33-8.635-18.588-18.966-18.453"
                    fill="#0A66C2"
                  />
                </svg>
                LinkedIn
              </Button>
              <Button
                variant="ghost"
                className="w-full justify-start"
                onClick={copyToClipboard}
              >
                <Link className="mr-2 h-4 w-4" />
                Copy Link
              </Button>
            </div>
          </NavigationMenuContent>
        </NavigationMenuItem>
      </NavigationMenuList>
    </NavigationMenu>
  );
}

export default ShareButton;
