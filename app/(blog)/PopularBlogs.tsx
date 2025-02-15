import { Raleway } from "next/font/google";
import Link from "next/link";
import { prisma } from "@/lib/prisma"; // Assuming you have your Prisma client setup in this file

const raleway = Raleway({
  subsets: ["latin"],
  display: "swap",
});

export default async function PopularBlogs() {
  const popularBlogs = await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      id: true,
      title: true,
      slug: true,
      content: true,
      topics: true,
      viewCount: true,
      shareCount: true,
      likes: {
        select: {
          id: true,
        },
      },
    },
    orderBy: [
      {
        viewCount: "desc",
      },
      {
        shareCount: "desc",
      },
      {
        likes: {
          _count: "desc",
        },
      },
    ],
    take: 5,
  });

  const processedBlogs = popularBlogs.map((blog) => ({
    ...blog,
    category: blog.topics[0] || "Uncategorized", // Assuming the first topic is the category
    summary: blog.content.substring(0, 100) + "...", // Create a summary from the first 100 characters
    likeCount: blog.likes.length,
  }));

  return (
    <aside className={`${raleway.className} sticky top-36`}>
      <Link href={`/blog/tips`} className="group">
        <article className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200">
          <h2 className="mb-2 font-bold text-gray-900 uppercase leading-relaxed group-hover:text-blue-500 transition-all">
            Popular Posts
          </h2>
          <p className="text-sm text-gray-400">
            Most popular posts, articles and guides about real estate
          </p>
        </article>
      </Link>
      {processedBlogs.length > 0 ? (
        <article className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200">
          <h4 className="mb-4 font-semibold text-gray-900 uppercase">
            Most viewed articles
          </h4>
          <div className="space-y-1">
            {processedBlogs.map((post, index) => (
              <div
                key={post.id}
                className="rounded border border-gray-50 group relative bg-white transition hover:z-[1] hover:border-ken-primary/10 hover:shadow-2xl hover:shadow-gray-600/10 p-2"
              >
                <Link
                  href={`/blog/${post.category}/${post.slug}`}
                  className="relative space-y-2"
                >
                  <h5 className="text-2xl font-bold text-ken-primary group-hover:text-ken-primary/80 transition md:text-4xl">
                    {index + 1}.
                  </h5>
                  <div className="space-y-1">
                    <h5 className="line-clamp-3 text-base font-medium text-gray-600 transition group-hover:text-gray-700">
                      {post.title}
                    </h5>
                    {/* <p>{post.summary}</p> */}
                  </div>
                  <p className="flex items justify-between group-hover:text-ken-primary">
                    <span className="text-sm">Read more</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      className="size-5 -translate-x-4 text-2xl opacity-0 transition duration-300 group-hover:translate-x-0 group-hover:opacity-100"
                    >
                      <path
                        fillRule="evenodd"
                        d="M12.97 3.97a.75.75 0 011.06 0l7.5 7.5a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 11-1.06-1.06l6.22-6.22H3a.75.75 0 010-1.5h16.19l-6.22-6.22a.75.75 0 010-1.06z"
                        clipRule="evenodd"
                      />
                    </svg>
                  </p>
                </Link>
              </div>
            ))}
          </div>
        </article>
      ) : (
        <article className="p-6 mb-6 font-medium text-gray-500 bg-white border border-gray-200">
          <h4 className="mb-4 font-semibold text-gray-900 uppercase">
            No articles available
          </h4>
          <p className="text-sm text-gray-400">
            There are currently no articles to display.
          </p>
        </article>
      )}
    </aside>
  );
}
