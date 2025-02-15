import Link from "next/link";
import { prisma } from "@/lib/prisma";

export interface BlogPostMetadata {
  title: string;
  publishedAt: string;
  category: string;
  cover?: string;
  summary: string;
  author: string;
}

export interface BlogPost {
  slug: string;
  metadata: BlogPostMetadata;
  content: string;
}

export interface RecommendedTopicsProps {
  relatedCategoryPosts: BlogPost[];
}

async function getTopics() {
  const topics = await prisma.post.findMany({
    where: { published: true },
    select: { topics: true },
    distinct: ["topics"],
  });

  // Flatten the array of arrays and remove duplicates
  return Array.from(new Set(topics.flatMap((post) => post.topics)));
}

async function getRelatedPosts(category: string) {
  return await prisma.post.findMany({
    where: {
      published: true,
      topics: { has: category },
    },
    select: {
      slug: true,
      title: true,
      coverPhoto: true,
      topics: true,
      createdAt: true,
      author: {
        select: { name: true },
      },
    },
    take: 3,
    orderBy: { createdAt: "desc" },
  });
}

export default async function RecommendedTopics() {
  const topics = await getTopics();
  const category = topics[0];
  const relatedPosts = await getRelatedPosts(category);

  return (
    <section className="sticky top-36">
      <h3 id="sidebar-label" className="sr-only">
        Recommended Topics
      </h3>
      <div className="p-3 mb-2 font-medium text-gray-500 bg-white border border-gray-100 rounded-lg">
        <h4 className="mb-1 font-bold text-gray-800 uppercase leading-relaxed">
          Recommended topics
        </h4>
        <div className="flex flex-wrap">
          {topics.map((topic) => (
            <Link
              href={`/blog/${topic}`}
              key={topic}
              className="bg-blue-100 text-blue-800 text-sm font-medium mr-2 px-2.5 py-0.5 rounded hover:bg-blue-200 mb-2"
            >
              {topic}
            </Link>
          ))}
        </div>
      </div>
      {/* <h4 className="my-4 font-semibold text-gray-900 uppercase">
        Related Articles
      </h4>
      <div className="space-y-4">
        {relatedPosts.length > 0 && (
          <section className="space-y-4">
            {relatedPosts.map((post) => (
              <Link
                key={post.slug}
                href={`/blog/${post.topics[0]}/${post.slug}`}
                className="flex group flex-col p-4 bg-white border border-gray-200 rounded-lg hover:border-ken-primary/10  hover:shadow-2xl hover:shadow-gray-600/10"
              >
                {post.coverPhoto && (
                  <Image
                    height={150}
                    width={300}
                    src={post.coverPhoto || "/placeholder.svg"}
                    alt={post.title}
                    className="rounded-lg flex-1 max-h-[200px] h-full"
                  />
                )}
                <h5 className="line-clamp-2 text-base font-medium text-blue-400 hover:text-blue-500 transition group-hover:text-gray-700">
                  {post.title}
                </h5>
                <p className="flex items justify-between group-hover:text-ken-primary mt-2 flex-1">
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
            ))}
          </section>
        )}
      </div> */}
    </section>
  );
}
