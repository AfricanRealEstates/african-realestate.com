"use client";
import useFavorite from "@/hooks/use-favorite";
import { User } from "next-auth";
import React from "react";
import { AiOutlineHeart, AiFillHeart } from "react-icons/ai";

interface HeartButtonProps {
  propertyId: string;
  currentUser?: User | null;
}
export default function HeartButton({
  propertyId,
  currentUser,
}: HeartButtonProps) {
  const { hasFavorited, toggleFavorite } = useFavorite({
    propertyId,
    currentUser,
  });
  console.log(hasFavorited);
  return (
    <div
      onClick={toggleFavorite}
      className="relative hover:opacity-80 transition cursor-pointer"
    >
      <AiOutlineHeart
        size={28}
        className="fill-white absolute -top-[2px] -right-[2px]"
      />
      <AiFillHeart
        size={28}
        className={
          hasFavorited
            ? `fill-rose-500`
            : `fill-neutral-500/70 absolute -top-[2px] -right-[2px]`
        }
      />
    </div>
  );
}
