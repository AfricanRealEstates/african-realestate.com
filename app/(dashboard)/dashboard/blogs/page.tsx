import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";

export default async function BlogDashboard({
  searchParams,
}: {
  searchParams: { page?: string; per_page?: string };
}) {
  const session = await auth();
  if (!session || !session.user) {
    return <div>Not authorized</div>;
  }

  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.per_page) || 10;

  const posts = await prisma.post.findMany({
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
    include: { author: true, likes: true },
  });

  const totalPosts = await prisma.post.count();

  const formattedPosts = posts.map((post) => ({
    id: post.id,
    title: post.title,
    likes: post.likes.length,
    views: post.viewCount,
    shares: post.shareCount,
    status: post.published ? "Published" : "Draft",
    author: post.author?.name,
    createdAt: post.createdAt.toISOString(),
    slug: post.slug,
    topics: post.topics,
  }));

  return (
    <div className="container mx-auto py-10">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Blog Posts</h1>
        <Link href="/posts/create">
          <Button>Create New Post</Button>
        </Link>
      </div>
      <DataTable
        columns={columns}
        data={formattedPosts}
        pageCount={Math.ceil(totalPosts / perPage)}
      />
    </div>
  );
}
