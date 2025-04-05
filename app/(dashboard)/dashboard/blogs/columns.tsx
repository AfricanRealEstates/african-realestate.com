"use client";

import type { ColumnDef } from "@tanstack/react-table";
import { ArrowUpDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionCell } from "./ActionCell";

export type Post = {
  id: string;
  title: string;
  likes: number;
  views: number;
  shares: number;
  status: string;
  author: string | null;
  createdAt: string;
  slug: string;
  topics: string[];
  // Add a virtual property for the blog number
  blogNumber?: number;
};

export const columns: ColumnDef<Post>[] = [
  {
    id: "blogNumber",
    header: "Blog #",
    cell: ({ row }) => {
      // Format the blog number with leading zeros (4 digits)
      const blogNumber = row.original.blogNumber || 0;
      return (
        <span className="font-mono">
          {blogNumber.toString().padStart(4, "0")}
        </span>
      );
    },
  },
  {
    accessorKey: "title",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Title
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "likes",
    header: "Likes",
  },
  {
    accessorKey: "views",
    header: "Views",
  },
  {
    accessorKey: "shares",
    header: "Shares",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string;
      return (
        <span
          className={`px-2 py-1 rounded-full text-xs font-semibold ${
            status === "Published"
              ? "bg-green-100 text-green-800"
              : "bg-red-100 text-red-800"
          }`}
        >
          {status}
        </span>
      );
    },
  },
  {
    accessorKey: "author",
    header: "Author",
  },
  {
    accessorKey: "createdAt",
    header: "Created At",
    cell: ({ row }) => {
      return new Date(row.getValue("createdAt")).toLocaleDateString();
    },
  },
  {
    id: "actions",
    cell: ({ row }) => <ActionCell post={row.original} />,
  },
];
