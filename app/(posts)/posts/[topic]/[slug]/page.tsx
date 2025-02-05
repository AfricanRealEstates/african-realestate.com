import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import { incrementViewCount } from "@/actions/blog";
import { auth } from "@/auth";
import Link from "next/link";
import LikeButton from "./LikeButton";
import ShareButton from "./ShareButton";
import { Plus_Jakarta_Sans } from "next/font/google";

const jakarta = Plus_Jakarta_Sans({
  weight: "400",
  subsets: ["latin"],
});

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

  const relatedPosts = await prisma.post.findMany({
    where: {
      topics: {
        hasSome: post.topics,
      },
      id: {
        not: post.id,
      },
      published: true,
    },
    take: 3,
    include: { author: true },
  });

  // Increment view count
  await incrementViewCount(post.id);

  const isLiked = session
    ? post.likes.some((like: any) => like.id === session.user.id)
    : false;

  return (
    <article className="pt-16">
      <div className="max-w-5xl mx-auto">
        <Link
          href="/posts"
          className="flex items-center gap-2 text-muted-foreground hover:text-foreground mb-8 group"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="100%"
            height="100%"
            viewBox="0 -960 960 960"
            className="shrink-0 w-5 h-5 transition-transform group-hover:-translate-x-1"
            fill="currentColor"
          >
            <path d="m406-481 177 177q9 9 8.5 21t-9.5 21-21.5 9-21.5-9L341-460q-5-5-7-10t-2-11 2-11 7-10l199-199q9-9 21.5-9t21.5 9 9 21.5-9 21.5z"></path>
          </svg>
          All posts
        </Link>
      </div>
      <div className="max-w-5xl mx-auto flex items-center gap-2 text-sm text-muted-foreground mb-4">
        Published{" "}
        <time>
          {new Date(post.createdAt).toLocaleDateString("en-US", {
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </time>{" "}
        by {post.author.name}
      </div>
      <div className="max-w-5xl mx-auto pb-10">
        <h1 className={`${jakarta.className} text-4xl font-bold mb-6`}>
          {post.title}
        </h1>
        <img
          src={post.coverPhoto || "/placeholder.svg"}
          alt={post.title}
          className="w-full h-64 object-cover mb-6"
        />

        <div
          className="prose max-w-none mb-8 mt-4"
          dangerouslySetInnerHTML={{ __html: post.content }}
        />
        <div className="mb-12">
          <h2 className="text-2xl font-bold mb-4 font-jakarta">Topics</h2>
          <div className="flex flex-wrap gap-2">
            {post.topics.map((topic) => (
              <Link
                key={topic}
                href={`/posts/${encodeURIComponent(topic)}`}
                className="bg-gray-100 hover:bg-gray-200 px-3 py-1 rounded-full text-sm transition-colors duration-200"
              >
                {topic}
              </Link>
            ))}
          </div>
        </div>
        <div className="flex items-center space-x-4 mb-4">
          <LikeButton
            postId={post.id}
            initialLikeCount={post.likes.length}
            initialIsLiked={isLiked}
          />
          <ShareButton postId={post.id} initialShareCount={post.shareCount} />
          <span>{post.viewCount} views</span>
        </div>
        {relatedPosts.length > 0 && (
          <div className="mt-6">
            <h2 className="text-2xl font-bold mb-4">Related Posts</h2>
            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-12 gap-y-12 w-full">
              {relatedPosts.map((relatedPost) => (
                <Link
                  href={`/posts/${relatedPost.slug}`}
                  key={relatedPost.id}
                  className="group flex flex-col hover:scale-[1.01] transition-transform duration-300 ease-in-out"
                >
                  {/* <div className="border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
                    <img
                      src={relatedPost.coverPhoto || "/placeholder.svg"}
                      alt={relatedPost.title}
                      className="w-full h-40 object-cover"
                    />
                    <div className="p-4">
                      <h3 className="font-semibold mb-2">
                        {relatedPost.title}
                      </h3>
                      <p className="text-sm text-gray-600">
                        By {relatedPost.author.name}
                      </p>
                    </div>
                  </div> */}

                  <div className="mb-4 rounded-lg aspect-[16/9] w-full relative overflow-hidden">
                    <img
                      src={relatedPost.coverPhoto || "/assets/blog.svg"}
                      alt={relatedPost.title}
                      className="object-cover"
                    />
                  </div>
                  <div className="px-1 flex flex-col gap-2">
                    {/* <div className="flex flex-wrap gap-2">
                      {relatedPost.topics.map((topic) => (
                        <span
                          key={topic}
                          className="text-sm text-muted-foreground"
                        >
                          {topic.charAt(0).toUpperCase() + topic.slice(1)}
                        </span>
                      ))}
                    </div> */}
                    <h2
                      className={`text-2xl font-bold line-clamp-2 ${jakarta.className}`}
                    >
                      {relatedPost.title}
                    </h2>

                    {/* <div
                      className="prose max-w-none text-muted-foreground text-sm line-clamp-2"
                      dangerouslySetInnerHTML={{
                        __html: relatedPost.content.slice(0, 100),
                      }}
                    /> */}
                    <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                      <span className="">{relatedPost.author.name}</span>
                      <span>•</span>
                      <time>
                        {new Date(relatedPost.createdAt).toLocaleDateString(
                          "en-US",
                          {
                            month: "long",
                            day: "numeric",
                            year: "numeric",
                          }
                        )}
                      </time>
                    </div>
                  </div>
                </Link>
              ))}
            </article>
          </div>
        )}
      </div>
      {/* <h1 className="text-3xl font-bold mb-4">{post.title}</h1>
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
      </div> */}
    </article>
  );
}
