import { formatBlogDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import React from "react";
interface CardCategoryProps {
  cover: string;
  title: string;
  summary: string;
  date: string;
}

export default function CardCategory({
  cover,
  title,
  summary,
  date,
}: CardCategoryProps) {
  return (
    <article className="group p-6 sm:p-8 rounded-3xl bg-white border border-gray-100 bg-opacity-50 shadow-2xl shadow-gray-600/10">
      <div className="relative overflow-hidden rounded-xl">
        <Image
          src={cover}
          alt={title}
          width={1000}
          height={667}
          className="h-64 w-full object-cover object-top transition duration-500 group-hover:scale-105"
        />
      </div>
      <div className="mt-6 relative">
        <h3 className="text-2xl font-semibold text-gray-800 line-clamp-2">
          {title}
        </h3>
        <p className="mt-2 text-base text-gray-600">
          Published on: {formatBlogDate(date)}
        </p>
        <p className="leading-relaxed mt-4 text-gray-600 line-clamp-3">
          {summary}
        </p>
        <p className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2 mt-5 w-fit">
          <span className="text-ken-primary">Read more</span>
        </p>
      </div>
    </article>
  );
}
