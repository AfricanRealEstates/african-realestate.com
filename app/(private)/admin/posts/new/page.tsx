import { redirect } from "next/navigation";
import BlogPostForm from "../BlogPostForm";
import { auth } from "@/auth";

export default async function NewBlogPostPage() {
  const session = await auth();

  if (!session || session.user.role !== "ADMIN") {
    redirect("/");
  }

  return (
    <div className="mx-auto w-[95%] max-w-7xl px-4 lg:px-6 py-32  md:py-36 lg:py-40">
      <h1 className="text-2xl font-bold mb-4">Create New Blog Post</h1>
      <BlogPostForm />
    </div>
  );
}
