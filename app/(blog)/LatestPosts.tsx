import { formatBlogDate } from "@/lib/utils";
import Image from "next/image";
import Link from "next/link";
import { prisma } from "@/lib/prisma";

async function getLatestPosts() {
  return await prisma.post.findMany({
    where: {
      published: true,
    },
    select: {
      slug: true,
      title: true,
      content: true,
      topics: true,
      coverPhoto: true,
      createdAt: true,
      metaDescription: true,
      author: {
        select: { name: true },
      },
      viewCount: true,
    },
    orderBy: {
      createdAt: "desc",
    },
    take: 5,
  });
}

export default async function LatestPosts() {
  const latestPosts = await getLatestPosts();

  return (
    <>
      <section className="space-y-4 grid grid-cols-1 px-4 lg:px-0">
        {latestPosts.map((post) => (
          <Link
            href={`/blog/${post.topics[0]}/${post.slug}`}
            key={post.slug}
            className="group relative -mx-4 sm:-mx-8 p-6 sm:p-8 rounded-xl bg-white border border-gray-100 hover:border-gray-100 shadow-2xl shadow-transparent hover:shadow-gray-600/10 sm:gap-8 sm:flex transition duration-300 hover:z-10"
          >
            <div className="sm:w-[60%] rounded-3xl overflow-hidden transition-all duration-500 group-hover:rounded-xl">
              <Image
                width={800}
                height={500} // Set a consistent height
                alt={post.title}
                src={post.coverPhoto || "/placeholder.svg"}
                className="h-[250px] w-full object-cover rounded-lg transition duration-500 group-hover:scale-105"
              />
            </div>
            <div className="sm:p-2 sm:pl-0 sm:w-4/6">
              <span className="mt-4 mb-2 inline-block text-[14px] font-medium text-gray-400 sm:mt-0">
                {" "}
                Published {formatBlogDate(post.createdAt.toISOString())}
              </span>
              <h3 className="text-2xl font-semibold text-gray-800">
                {post.title}
              </h3>

              <p className="my-6 text-gray-600 line-clamp-3">
                {post.metaDescription ||
                  "Learn more about this topic by reading the full article. Click to explore detailed insights and expert opinions."}
              </p>

              <div className="flex gap-2 flex-wrap">
                {post.topics.map((topic, index) => (
                  <span
                    key={index}
                    className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2 capitalize"
                  >
                    {topic}
                  </span>
                ))}
              </div>
            </div>
          </Link>
        ))}
      </section>
    </>
  );
}
