"use client";

import { Share2 } from "lucide-react";
import React from "react";
import {
  FacebookShare,
  WhatsappShare,
  LinkedinShare,
  EmailShare,
  RedditShare,
} from "react-share-kit";
interface BlogShareProps {
  url: string;
  title: string;
}
export default function BlogShare({ url, title }: BlogShareProps) {
  const titleToShare = `Check out this amazing post: ${title}`;
  return (
    <div className="">
      <h2 className="flex gap-3 items-center">
        <span>Social share</span>
        <Share2 />
      </h2>
      <div className="flex gap-6 border-t border-neutral-100 pt-4">
        <FacebookShare
          url={url}
          quote={titleToShare}
          size={40}
          borderRadius={10}
        />
        <WhatsappShare url={url} size={40} borderRadius={10} />
        <LinkedinShare url={url} size={40} borderRadius={10} />
        <EmailShare url={url} size={40} borderRadius={10} />
        <RedditShare url={url} size={40} borderRadius={10} />
      </div>
    </div>
  );
}
