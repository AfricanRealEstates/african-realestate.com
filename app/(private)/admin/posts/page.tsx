import { redirect } from "next/navigation";
import { prisma } from "@/lib/prisma";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { deletePost } from "@/actions/blog";
import { auth } from "@/auth";
import Image from "next/image";

export default async function BlogPostsPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
    include: {
      author: true, // Include the author relation
    },
  });
  console.log(posts);

  return (
    <div className="mx-auto w-[95%] max-w-7xl px-4 lg:px-6 py-32 md:py-36 lg:py-40">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Blog Posts</h1>
        <Link href="/admin/posts/new">
          <Button>Create New Post</Button>
        </Link>
      </div>
      {posts.length > 0 ? (
        <div className="space-y-4">
          {posts.map((post) => (
            <div key={post.id} className="border p-4 rounded-md">
              <h2 className="text-xl font-semibold">{post.title}</h2>
              <p className="text-sm text-gray-500">
                {post.published ? "Published" : "Draft"} •{" "}
                {new Date(post.createdAt).toLocaleDateString()}
              </p>
              {post.imageUrls?.[0] && (
                <div className="mt-2">
                  <Image
                    width={50}
                    height={50}
                    src={post.imageUrls[0]}
                    alt={post.title}
                    className="w-full object-cover rounded-md"
                  />
                </div>
              )}
              <p className="mt-2 text-sm text-gray-600">
                Author: {post.author?.name || "Unknown"}
              </p>
              <div className="mt-2 space-x-2">
                <Link href={`/admin/posts/${post.id}/edit`}>
                  <Button variant="outline">Edit</Button>
                </Link>
                <form
                  action={deletePost.bind(null, post.id)}
                  className="inline"
                >
                  <Button variant="destructive" type="submit">
                    Delete
                  </Button>
                </form>
              </div>
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
