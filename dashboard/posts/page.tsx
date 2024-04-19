import DashboardTitle from "@/components/dashboard/dashboard-title";
import { Button } from "@/components/ui/button";
import { Metadata } from "next";
import Link from "next/link";
import React from "react";
import prisma from "@/lib/prisma";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import dayjs from "dayjs";
import { CheckCircle2, MoreVertical, XCircle } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  ActiveToggleDropdownItem,
  DeleteDropdownItem,
} from "./_components/post-actions";
export const metadata: Metadata = {
  title: "Dashboard - Blogs",
};

export default async function Posts() {
  const posts = await prisma.post.findMany({
    orderBy: { createdAt: "desc" },
  });
  return (
    <>
      <DashboardTitle title="Posts" />
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-0">
              <span className="sr-only">Published</span>
            </TableHead>
            <TableHead>ID</TableHead>
            <TableHead>Title</TableHead>
            <TableHead>Created At</TableHead>
            <TableHead>Updated At</TableHead>
            <TableHead>
              <span className="sr-only">Actions</span>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {posts.map((post) => {
            return (
              <TableRow key={post.id}>
                <TableCell>
                  {post.published ? (
                    <div className="flex items-center gap-1 text-green-500">
                      <CheckCircle2 className="text-green-500" /> Published
                    </div>
                  ) : (
                    <div className="flex items-center gap-1 text-destructive">
                      <XCircle className="stroke-destructive" /> Draft
                    </div>
                  )}
                </TableCell>
                <TableCell>{post.id}</TableCell>
                <TableCell>{post.title}</TableCell>
                <TableCell>
                  {dayjs(post.createdAt).format("DD MMM YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                  {dayjs(post.updatedAt).format("DD MMM YYYY hh:mm A")}
                </TableCell>
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger>
                      <MoreVertical />
                      <span className="sr-only">Actions</span>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                      <DropdownMenuItem asChild>
                        <a href={`/admin/product/${post.id}/download`}>
                          Download
                        </a>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        <Link href={`/dashboard/blog/${post.id}/edit`}>
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <ActiveToggleDropdownItem
                        id={post.id}
                        published={post.published}
                      />
                      <DropdownMenuSeparator />
                      <DeleteDropdownItem id={post.id} />
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
      {posts.length === 0 && (
        <article className="h-96 mt-4 flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
          <div className="flex flex-col items-center gap-1 text-center">
            <h3 className="text-2xl font-bold tracking-tight">
              You have no blog posting
            </h3>
            <p className="text-sm text-gray-500">
              You can improve SEO as soon as possible through writing posts.
            </p>
            <Button className="mt-4" asChild>
              <Link href="/dashboard/blog/new">Add Blog Post</Link>
            </Button>
          </div>
        </article>
      )}
    </>
  );
}
