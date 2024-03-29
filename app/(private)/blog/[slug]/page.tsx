import React, { cache } from "react";
import prisma from "@/lib/prisma";
import { notFound } from "next/navigation";
import { Metadata } from "next";
import { Raleway } from "next/font/google";
import dayjs from "dayjs";
import Markdown from "@/components/globals/markdown";

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

export async function generateMetadata({
  params: { slug },
}: SingleBlogProps): Promise<Metadata> {
  const post = await getPost(slug);

  return {
    title: post.title,
    description: post.description,
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
        <div className="max-w-prose mx-auto lg:text-lg">
          <h2 className="text-3xl font-semibold md:text-4xl">{post.title}</h2>
          <article className="my-6 prose prose-slate">
            {post.description && <Markdown>{post.description}</Markdown>}
          </article>
        </div>
      </section>
    </div>
  );
}
