import Markdown from "@/components/globals/markdown";
import { Post } from "@prisma/client";
import dayjs from "dayjs";
import Image from "next/image";
import Link from "next/link";
import React from "react";

interface SingleBlogProps {
  post: Post;
}

export default function SingleBlog({
  post: {
    id,
    title,
    slug,
    description,
    coverImageUrl,
    published,
    createdAt,
    updatedAt,
  },
}: SingleBlogProps) {
  return (
    <section className="mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
      <div className="max-w-[770px] mx-auto text-center">
        <Link
          href="#"
          className="inline-flex text-blue-400 bg-neutral-100 font-medium py-1 px-3 rounded-full mb-1"
        >
          Investing
        </Link>
        <h1 className="font-bold text-2xl sm:text-4xl lg:text-5xl mb-5">
          {title}
        </h1>
        <div className="flex items-center justify-center gap-4 mt-7">
          {dayjs(createdAt).format("DD MMM YYYY hh:mm A")}
        </div>
      </div>
      <Image
        height={720}
        width={720}
        src={coverImageUrl || "/assets/blog.svg"}
        alt=""
        className="rounded-xl mt-10 mb-11"
      />
      <article className="max-w-[770px] mx-auto">
        {description && <Markdown>{description}</Markdown>}
      </article>
    </section>
  );
}
