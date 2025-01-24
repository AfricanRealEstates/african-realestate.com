import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementViewCount } from "@/actions/blog";
import { auth } from "@/auth";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";

export async function generateMetadata({
  params,
}: {
  params: { slug: string };
}) {
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true },
  });

  if (!post) {
    return {
      title: "Post Not Found",
    };
  }

  return {
    title: post.title,
    description: post.content.substring(0, 160),
    openGraph: {
      title: post.title,
      description: post.content.substring(0, 160),
      type: "article",
      authors: [post.author.name || ""],
      publishedTime: post.createdAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
    },
    twitter: {
      card: "summary_large_image",
      title: post.title,
      description: post.content.substring(0, 160),
    },
  };
}

export default async function BlogPost({
  params,
}: {
  params: { slug: string };
}) {
  const session = await auth();
  const post = await prisma.post.findUnique({
    where: { slug: params.slug },
    include: { author: true, likes: true },
  });

  if (!post) notFound();

  // Increment view count
  await incrementViewCount(post.id);

  const isLiked = session
    ? post.likes.some((like: any) => like.id === session.user.id)
    : false;

  return (
    <article className="max-w-2xl mx-auto mt-10">
      <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
      <div className="text-gray-600 mb-4">
        By {post.author.name} • {post.createdAt.toLocaleDateString()}
      </div>
      <div
        dangerouslySetInnerHTML={{ __html: post.content }}
        className="prose mb-6"
      />
      <div className="flex items-center space-x-4">
        <LikeButton
          postId={post.id}
          initialLikeCount={post.likes.length}
          initialIsLiked={isLiked}
        />
        <ShareButton postId={post.id} initialShareCount={post.shareCount} />
        <span>{post.viewCount} views</span>
      </div>
    </article>
  );
}
