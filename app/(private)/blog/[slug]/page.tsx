import React, { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import dayjs from "dayjs";
import Markdown from "@/components/globals/markdown";
import Link from "next/link";
import Image from "next/image";

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-nunitosans",
});

interface SingleBlogProps {
  params: { slug: string };
}

const getPost = cache(async (slug: string) => {
  const post = await prisma.post.findUnique({
    where: { slug },
  });

  if (!post) notFound();

  return post;
});

// export async function generateStaticParams() {
//   const posts = await prisma.post.findMany({
//     select: { slug: true },
//   });

//   return posts.map(({ slug }) => slug);
// }

export async function generateMetadata({
  params: { slug },
}: SingleBlogProps): Promise<Metadata> {
  const post = await getPost(slug);

  return {
    title: post.title,
    // description: post.description,
    // coverImageUrl: post.coverImageUrl,
  };
}

export default async function SingleBlog({
  params: { slug },
}: SingleBlogProps) {
  const post = await getPost(slug);
  return (
    <div className={`text-[#181a20] ${raleway.className}`}>
      <section className="mx-auto w-full max-w-5xl px-5 py-16 md:px-10 md:py-24 lg:py-32">
        <div className="max-w-[770px] mx-auto text-center">
          <Link
            href="#"
            className="inline-flex text-blue-400 bg-neutral-100 font-medium py-1 px-3 rounded-full mb-1"
          >
            Investing
          </Link>
          <h1 className="font-bold text-2xl sm:text-4xl lg:text-5xl mb-5">
            {post.title}
          </h1>
          <div className="flex items-center justify-center gap-4 mt-7">
            Published on: {dayjs(post.createdAt).format("DD MMM YYYY hh:mm A")}
          </div>
        </div>

        <img
          src={`${post.coverImageUrl}`}
          alt=""
          className="rounded-xl mt-10 mb-11 w-full"
        />
        <article className="max-w-[770px] mx-auto prose">
          {post.description && <Markdown>{post.description}</Markdown>}
        </article>
      </section>
    </div>
  );
}
