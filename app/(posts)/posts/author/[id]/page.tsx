import Link from "next/link";
import { prisma } from "@/lib/prisma";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { notFound } from "next/navigation";

export default async function AuthorBlogsPage({
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
      },
    },
  });

  if (!author) {
    notFound();
  }

  return (
    <div className="max-w-4xl mx-auto py-10">
      <h1 className="text-3xl font-bold mb-5">Blogs by {author.name}</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {author.posts.map((post) => (
          <Card key={post.id}>
            <CardHeader>
              <CardTitle>{post.title}</CardTitle>
            </CardHeader>
            <CardContent>
              <img
                src={post.coverPhoto || "/placeholder.svg"}
                alt={post.title}
                className="w-full h-48 object-cover mb-4"
              />
              <p className="text-sm text-gray-500">{post.topics.join(", ")}</p>
            </CardContent>
            <CardFooter>
              <Link
                href={`/blog/${post.slug}`}
                className="text-blue-500 hover:underline"
              >
                Read more
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
