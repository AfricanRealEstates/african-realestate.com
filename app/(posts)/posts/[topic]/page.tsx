import { prisma } from "@/lib/prisma";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import Image from "next/image";
import { notFound } from "next/navigation";

const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  variable: "--font-jakarta",
});

export async function generateMetadata({
  params,
}: {
  params: { topic: string };
}) {
  const decodedTopic = decodeURIComponent(params.topic);
  return {
    title: `Posts about ${decodedTopic}`,
    description: `Explore our blog posts about ${decodedTopic}`,
  };
}

export default async function TopicPage({
  params,
}: {
  params: { topic: string };
}) {
  const decodedTopic = decodeURIComponent(params.topic);
  const posts = await prisma.post.findMany({
    where: {
      topics: {
        has: decodedTopic,
      },
      published: true,
    },
    include: { author: true },
    orderBy: { createdAt: "desc" },
  });

  if (posts.length === 0) notFound();

  return (
    <div className={`pt-16`}>
      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
        <Link
          href="/posts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="transition-transform group-hover:-translate-x-1"
          >
            <path d="m15 18-6-6 6-6" />
          </svg>
          All posts
        </Link>
        <h1 className="text-4xl font-bold mb-8 font-jakarta">
          Posts about {decodedTopic}
        </h1>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post) => (
            <Link
              href={`/posts/${encodeURIComponent(decodedTopic)}/${post.slug}`}
              key={post.id}
              className="group hover:no-underline"
            >
              <div className="aspect-[16/9] w-full relative overflow-hidden rounded-lg mb-4">
                <Image
                  src={post.coverPhoto || "/assets/blog.svg"}
                  alt={post.title}
                  fill
                  className="object-cover transition-transform duration-300 group-hover:scale-105"
                />
              </div>
              <h2 className="text-xl font-bold mb-2 group-hover:text-primary transition-colors duration-200 font-jakarta line-clamp-2">
                {post.title}
              </h2>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <span>{post.author.name}</span>
                <span>•</span>
                <time dateTime={post.createdAt.toISOString()}>
                  {new Date(post.createdAt).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </time>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}
