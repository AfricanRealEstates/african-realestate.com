"use client";

import { cn } from "@/lib/utils";
import type React from "react";
import { useState } from "react";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { upvoteProperty } from "@/lib/actions";
import Modal from "@/components/modals/Modal";
import AuthContent from "@/components/auth/AuthContent";
import LikeButton from "./Like";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

type Props = {
  property: any;
  userId?: string;
  className?: string;
};

export default function PropertyActions({
  property,
  userId,
  className,
}: Props) {
  const [showLoginModal, setShowLoginModal] = useState(false);
  const [hasUpvoted, setHasUpvoted] = useState(
    property.upvoters?.includes(userId)
  );

  const [totalUpvotes, setTotalUpvotes] = useState(property.upvotes || 0);

  const variants = {
    initial: { scale: 1 },
    upvoted: { scale: [1, 1.2, 1], transition: { duration: 0.3 } },
  };

  const handleUpvoteClick = async (
    e: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    e.stopPropagation();

    try {
      await upvoteProperty(property.id);
      setHasUpvoted(!hasUpvoted);
      setTotalUpvotes(hasUpvoted ? totalUpvotes - 1 : totalUpvotes + 1);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <TooltipProvider>
      <div
        className={cn(
          "text-sm flex items-center space-between gap-x-4",
          className
        )}
      >
        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <LikeButton property={property} userId={userId as string} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Like this property</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <BookmarkButton property={property} userId={userId!} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Bookmark this property</p>
          </TooltipContent>
        </Tooltip>

        <Tooltip>
          <TooltipTrigger asChild>
            <div>
              <ShareButton propertyId={property.id} property={property} />
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>Share this property</p>
          </TooltipContent>
        </Tooltip>

        <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
          <AuthContent />
        </Modal>
      </div>
    </TooltipProvider>
  );
}
