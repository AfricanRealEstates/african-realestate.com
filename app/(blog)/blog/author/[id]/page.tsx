import { prisma } from "@/lib/prisma";
import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { format } from "date-fns";
import PopularBlogs from "../../../PopularBlogs";
import RecommendedTopics from "../../../RecommendedTopics";
import { Metadata } from "next";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export async function generateMetadata({
  params,
}: {
  params: { id: string };
}): Promise<Metadata> {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    include: { posts: { where: { published: true } } },
  });

  if (!author) {
    return {
      title: "Author Not Found",
      description: "This author does not exist.",
    };
  }

  return {
    title: `Posts by ${author.name} - African Real Estate`,
    description: `Explore blog posts by ${author.name} on African Real Estate. Read insights, guides, and updates on the latest trends in real estate.`,
    openGraph: {
      title: `Posts by ${author.name} - African Real Estate`,
      description: `Explore blog posts by ${author.name} on African Real Estate.`,
      type: "website",
      url: `https://www.african-realestate.com/author/${params.id}`,
      images: author.posts[0]?.coverPhoto
        ? [{ url: author.posts[0].coverPhoto, width: 1200, height: 630 }]
        : [
            {
              url: author.image || "/assets/placeholder.jpg",
              width: 1200,
              height: 630,
            },
          ],
    },
  };
}

export default async function AuthorPostsPage({
  params,
}: {
  params: { id: string };
}) {
  const author = await prisma.user.findUnique({
    where: { id: params.id },
    include: {
      posts: {
        where: { published: true },
        orderBy: { createdAt: "desc" },
        include: {
          likes: true,
        },
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="">
      <div className="xl:container m-auto px-6 text-gray-600 md:px-12 xl:px-16">
        <div className="lg:p-10 rounded-[4rem] space-y-6 md:flex flex-col md:gap-6 justify-center md:space-y-0 lg:items-center border-b border-gray-50">
          <h1 className="font-semibold text-2xl lg:text-4xl tracking-tighter capitalize">
            Posts by: {author.name}
          </h1>
        </div>

        <section className="flex justify-between gap-4 px-4 mx-auto w-full mt-8">
          <div className="hidden mb-6 xl:block lg:w-60">
            <PopularBlogs />
          </div>

          <div className="w-full max-w-4xl mx-auto">
            <div className="grid gap-6 md:grid-cols-2">
              {author.posts.map((post) => (
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
                        <time dateTime={post.createdAt.toISOString()}>
                          {format(post.createdAt, "MMMM dd, yyyy")}
                        </time>
                        <div className="flex items-center gap-2">
                          <span>{post.viewCount} views</span>
                          <span>•</span>
                          <span>{post.likes.length} likes</span>
                        </div>
                      </div>
                    </div>
                  </Link>
                </article>
              ))}
            </div>
          </div>

          <aside className="hidden lg:block lg:w-60">
            <RecommendedTopics />
          </aside>
        </section>
      </div>
    </div>
  );
}
