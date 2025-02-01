import { prisma } from "@/lib/prisma";
import { Plus_Jakarta_Sans } from "next/font/google";
import Link from "next/link";
import { Suspense } from "react";
import { BlogPostSkeleton } from "./components/BlogSkeleton";
import { metadata } from "./metadata";
import { auth } from "@/auth";

const jakarta = Plus_Jakarta_Sans({
  weight: "400",
  subsets: ["latin"],
});

const topics = [
  { label: "Housing", value: "housing" },
  { label: "Tips", value: "tips" },
  { label: "Finance", value: "finance" },
  { label: "Investing", value: "investing" },
  { label: "Home Decor", value: "home-decor" },
];

function BlogPostSkeletons() {
  return (
    <>
      {[...Array(6)].map((_, index) => (
        <BlogPostSkeleton key={index} />
      ))}
    </>
  );
}

export const generateMetadata = async () => {
  return metadata;
};
export default async function Blogs() {
  const session = await auth();
  const userRole = session?.user?.role;
  const isAdminOrSupport = userRole === "ADMIN" || userRole === "SUPPORT";
  const posts = await prisma.post.findMany({
    where: { published: false },
    orderBy: { createdAt: "desc" },
    include: { author: true },
  });

  return (
    <section className="pt-16">
      <div className="container">
        <div className="flex flex-col md:flex-row min-h-screen w-full">
          <aside className="w-full md:w-64">
            <div className="md:sticky md:top-20">
              <div className="flex flex-col gap-8">
                <div className="w-full md:w-3/4">
                  <h1
                    className={`text-5xl md:text-4xl mb-4 font-bold ${jakarta.className}`}
                  >
                    Blog
                  </h1>
                  <p className="text-base md:text-sm text-muted-foreground mt-1">
                    Discover more topics about real estate news
                  </p>
                  <div className="w-full md:w-1/2 border-b border-border mt-8"></div>
                </div>
                <nav
                  className={`flex md:flex-col gap-4 overflow-x-auto pb-4 md:pb-0 whitespace-nowrap md:mx-0 scrollbar-hide ${jakarta.className}`}
                >
                  {topics.map((topic) => (
                    <Link
                      key={topic.label}
                      href="#"
                      className="text-muted-foreground hover:text-foreground transition-colors text-sm"
                    >
                      {topic.label}
                    </Link>
                  ))}

                  {isAdminOrSupport && (
                    <Link
                      href="/posts/create"
                      className="text-primary hover:text-primary-dark transition-colors font-semibold"
                    >
                      Create Post
                    </Link>
                  )}
                </nav>
              </div>
            </div>
          </aside>
          <main className="flex flex-col items-center gap-8 flex-1 px-4 md:px-8">
            <article className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-x-12 gap-y-12 w-full">
              <Suspense fallback={<BlogPostSkeletons />}>
                {posts.map((post) => (
                  <Link
                    href={`posts/${post.slug}`}
                    key={post.id}
                    className="group flex flex-col hover:scale-[1.01] transition-transform duration-300 ease-in-out"
                  >
                    <div className="mb-4 rounded-lg aspect-[16/9] w-full relative overflow-hidden">
                      <img
                        src={post.coverPhoto || "/assets/blog.svg"}
                        alt={post.title}
                        className="object-cover"
                      />
                    </div>
                    <div className="px-1 flex flex-col gap-2">
                      <div className="flex flex-wrap gap-2">
                        {post.topics.map((topic) => (
                          <span
                            key={topic}
                            className="text-sm text-muted-foreground"
                          >
                            {topic.charAt(0).toUpperCase() + topic.slice(1)}
                          </span>
                        ))}
                      </div>
                      <h2
                        className={`text-2xl font-bold line-clamp-2 ${jakarta.className}`}
                      >
                        {post.title}
                      </h2>

                      <div
                        className="prose max-w-none text-muted-foreground text-sm line-clamp-2"
                        dangerouslySetInnerHTML={{
                          __html: post.content.slice(0, 100),
                        }}
                      />
                      <div className="flex items-center gap-2 text-xs text-muted-foreground mt-2">
                        <span className="">{post.author.name}</span>
                        <span>•</span>
                        <time>
                          {new Date(post.createdAt).toLocaleDateString(
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
              </Suspense>
            </article>
          </main>
        </div>
      </div>
    </section>
  );
}
