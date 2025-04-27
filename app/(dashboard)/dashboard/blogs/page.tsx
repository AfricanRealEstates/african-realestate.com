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
import { PaginationControls } from "./pagination-controls";

export default async function BlogDashboard({
  searchParams,
}: {
  searchParams: {
    page?: string;
    per_page?: string;
    title?: string;
    status?: string;
    author?: string;
  };
}) {
  const session = await auth();
  if (!session || !session.user) {
    return <div>Not authorized</div>;
  }

  const page = Number(searchParams.page) || 1;
  const perPage = Number(searchParams.per_page) || 10;

  // Check if user is admin
  const isAdmin = session.user.role === "ADMIN";

  // Build where clause based on filters
  const whereClause: any = isAdmin ? {} : { authorId: session.user.id };

  // Add title filter if provided
  if (searchParams.title) {
    whereClause.title = {
      contains: searchParams.title,
      mode: "insensitive", // Case-insensitive search
    };
  }

  // Add status filter if provided
  if (searchParams.status) {
    whereClause.published = searchParams.status === "Published";
  }

  // Add author filter if provided (for admin only)
  if (isAdmin && searchParams.author) {
    whereClause.author = {
      name: searchParams.author,
    };
  }

  // Filter posts based on user role and filters
  const postsQuery = prisma.post.findMany({
    where: whereClause,
    skip: (page - 1) * perPage,
    take: perPage,
    orderBy: { createdAt: "desc" },
    include: { author: true, likes: true },
  });

  // Count total posts based on user role and filters
  const countQuery = prisma.post.count({ where: whereClause });

  // Execute both queries in parallel
  const [posts, totalPosts] = await Promise.all([postsQuery, countQuery]);

  const formattedPosts = posts.map((post, index) => ({
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
    // Calculate the blog number based on the current page and index
    blogNumber: (page - 1) * perPage + index + 1,
  }));

  // Calculate page count
  const pageCount = Math.ceil(totalPosts / perPage);

  // Fetch accepted invitations if user is admin
  const acceptedInvitations = isAdmin ? await getAcceptedInvitations() : [];

  return (
    <div className="relative">
      {isAdmin && (
        <>
          <div className="container mx-auto py-6 px-4 sm:px-6">
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
      <div className="container mx-auto py-6 px-4 sm:px-6">
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
          <h1 className="text-2xl sm:text-3xl font-bold">Blog Posts</h1>
          <Link href="/blog/create">
            <Button>Create New Post</Button>
          </Link>
        </div>
        <DataTable
          columns={columns}
          data={formattedPosts}
          pageCount={pageCount}
          currentPage={page}
          pageSize={perPage}
        />

        {/* Alternative pagination UI with page numbers */}
        <div className="mt-4">
          <PaginationControls
            pageCount={pageCount}
            currentPage={page}
            pageSize={perPage}
          />
        </div>
      </div>
    </div>
  );
}
