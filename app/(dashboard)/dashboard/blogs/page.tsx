import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { DataTable } from "./data-table";
import { columns } from "./columns";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { InviteUserForm } from "./InviteUserForm";
import { Separator } from "@/components/ui/separator";
import { getAcceptedInvitations } from "./actions";
import { AcceptedInvitationsList } from "./AcceptedInvitationsList";

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

  // Check if user is admin
  const isAdmin = session.user.role === "ADMIN";

  // Filter posts based on user role
  const postsQuery = isAdmin
    ? // Admin sees all posts
      prisma.post.findMany({
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: { author: true, likes: true },
      })
    : // Regular users see only their posts
      prisma.post.findMany({
        where: { authorId: session.user.id },
        skip: (page - 1) * perPage,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: { author: true, likes: true },
      });

  // Count total posts based on user role
  const countQuery = isAdmin
    ? prisma.post.count()
    : prisma.post.count({ where: { authorId: session.user.id } });

  // Execute both queries in parallel
  const [posts, totalPosts] = await Promise.all([postsQuery, countQuery]);

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

  // Fetch accepted invitations if user is admin
  const acceptedInvitations = isAdmin ? await getAcceptedInvitations() : [];

  return (
    <>
      {isAdmin && (
        <>
          <div className="container mx-auto py-6">
            <InviteUserForm />
            {acceptedInvitations.length > 0 ? (
              <>
                <Separator className="my-6" />
                <AcceptedInvitationsList invitations={acceptedInvitations} />
              </>
            ) : null}
          </div>
          <Separator />
        </>
      )}
      <div className="container mx-auto py-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Blog Posts</h1>
          <Link href="/blog/create">
            <Button>Create New Post</Button>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={formattedPosts}
          pageCount={Math.ceil(totalPosts / perPage)}
        />
      </div>
    </>
  );
}
