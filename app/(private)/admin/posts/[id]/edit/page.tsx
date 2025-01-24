import { redirect } from "next/navigation";
import BlogPostForm from "../../BlogPostForm";
import { prisma } from "@/lib/prisma";
import { auth } from "@/auth";

export default async function EditBlogPostPage({
  params,
}: {
  params: { id: string };
}) {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  const post = await prisma.post.findUnique({
    where: { id: params.id },
    include: {
      likes: true, // Include the likes relation
    },
  });

  if (!post) {
    redirect("/admin/posts");
  }

  return (
    <div className="mx-auto w-[95%] max-w-7xl px-4 lg:px-6 py-32  md:py-36 lg:py-40">
      <h1 className="text-2xl font-bold mb-4">Edit Blog Post</h1>
      <BlogPostForm post={post} />
    </div>
  );
}
