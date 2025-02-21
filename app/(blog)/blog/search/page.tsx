import { prisma } from "@/lib/prisma";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import PopularBlogs from "@/app/(blog)/PopularBlogs";
import RecommendedTopics from "@/app/(blog)/RecommendedTopics";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function SearchPage({
  searchParams,
}: {
  searchParams: { q?: string };
}) {
  const query = searchParams.q?.trim();

  const posts = query
    ? await prisma.post.findMany({
        where: {
          published: true,
          OR: [
            { title: { contains: query, mode: "insensitive" } },
            { content: { contains: query, mode: "insensitive" } },
            { topics: { has: query } },
            { author: { name: { contains: query, mode: "insensitive" } } },
          ],
        },
        include: {
          author: true,
          likes: true,
        },
        orderBy: {
          createdAt: "desc",
        },
      })
    : [];

  return (
    <div className="">
      <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
        <div className="lg:p-10 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center border-b border-gray-50">
          {/* <div className="max-w-xl mx-auto w-full">
            <SearchField />
          </div> */}
          <div className="text-center mt-4">
            {query ? (
              <p className="text-sm text-muted-foreground">
                Found {posts.length} result{posts.length === 1 ? "" : "s"} for
                &ldquo;{query}&rdquo;
              </p>
            ) : (
              <p className="text-sm text-muted-foreground">
                Enter a search term to find posts
              </p>
            )}
          </div>
        </div>

        <section className="flex justify-between gap-4 px-4 mx-auto container mt-8">
          <div className="hidden mb-6 xl:block lg:w-60">
            <PopularBlogs />
          </div>

          <div className="w-full max-w-4xl mx-auto">
            {posts.length > 0 ? (
              <div className="grid gap-6 md:grid-cols-2">
                {posts.map((post) => (
                  <article
                    key={post.id}
                    className="group relative flex flex-col space-y-2 border rounded-lg p-4 hover:shadow-md transition-shadow"
                  >
                    <Link
                      href={`/blog/${post.topics[0]}/${post.slug}`}
                      className="block space-y-4"
                    >
                      {post.coverPhoto ? (
                        <Image
                          src={post.coverPhoto || "/placeholder.svg"}
                          alt={post.title}
                          width={600}
                          height={400}
                          className="rounded-lg object-cover w-full aspect-video"
                        />
                      ) : (
                        <div className="rounded-lg bg-muted aspect-video" />
                      )}
                      <div className="space-y-2">
                        <h2 className="text-xl font-semibold tracking-tight hover:underline">
                          {post.title}
                        </h2>
                        <p className="text-sm text-muted-foreground line-clamp-2">
                          {post.content.substring(0, 150)}...
                        </p>
                        <div className="flex items-center gap-x-4 text-sm text-muted-foreground">
                          <Link
                            href={`/blog/author/${post.authorId}`}
                            className="hover:underline"
                          >
                            By {post.author.name}
                          </Link>
                          <time dateTime={post.createdAt.toISOString()}>
                            {format(post.createdAt, "MMMM dd, yyyy")}
                          </time>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-muted-foreground">
                          <span>{post.viewCount} views</span>
                          <span>•</span>
                          <span>{post.likes.length} likes</span>
                        </div>
                      </div>
                    </Link>
                  </article>
                ))}
              </div>
            ) : query ? (
              <div className="text-center py-12">
                <p className="text-lg text-muted-foreground">
                  No posts found for &ldquo;{query}&rdquo;
                </p>
                <p className="text-sm text-muted-foreground mt-2">
                  Try searching for something else
                </p>
              </div>
            ) : null}
          </div>

          <aside className="hidden lg:block lg:w-60">
            <RecommendedTopics />
          </aside>
        </section>
      </div>
    </div>
  );
}
