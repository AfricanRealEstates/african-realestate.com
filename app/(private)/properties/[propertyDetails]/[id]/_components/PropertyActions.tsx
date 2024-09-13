"use client";
import { PropertyWithExtras } from "@/lib/types";
import { cn } from "@/lib/utils";
import React, { useState } from "react";
import ShareButton from "./ShareButton";
import BookmarkButton from "./BookmarkButton";
import { motion } from "framer-motion";
import { upvoteProperty } from "@/lib/actions";
import {
  PiArrowBendDoubleUpRight,
  PiCaretUpFill,
  PiChatCircle,
} from "react-icons/pi";
import Modal from "@/components/modals/Modal";
import AuthContent from "@/components/auth/AuthContent";
import LikeButton from "./Like";

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
    initital: { scale: 1 },
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
    <div
      className={cn(
        "text-sm flex items-center space-between gap-x-4",
        className
      )}
    >
      <LikeButton property={property} userId={userId as string} />
      <BookmarkButton property={property} userId={userId!} />

      {/* <motion.div
        onClick={handleUpvoteClick}
        variants={variants}
        animate={hasUpvoted ? "upvoted" : "initial"}
      >
        {hasUpvoted ? (
          <div
            className="border px-1 rounded-md flex 
              items-center bg-gradient-to-bl 
              from-[#ff6154] to-[#ff4582] border-[#ff6154]
              text-white"
          >
            <PiCaretUpFill className="text-lg" />
            {totalUpvotes}
          </div>
        ) : (
          <div className="border px-1 rounded-md flex items-center">
            <PiCaretUpFill className="text-lg" />
            {totalUpvotes}
          </div>
        )}
      </motion.div> */}
      <ShareButton propertyId={property.id} property={property} />

      <Modal visible={showLoginModal} setVisible={setShowLoginModal}>
        <AuthContent />
      </Modal>
    </div>
  );
}
