"use client";

import { deleteProperty } from "@/actions/properties";
import { Property, User } from "@prisma/client";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import dayjs from "dayjs";
import { MoreHorizontal } from "lucide-react";
import { useRouter } from "next/navigation";
import React, { useState, useTransition } from "react";
import { toast } from "sonner";
import PropertyQueries from "./property-queries";
import Link from "next/link";

interface ClientTableProps {
  properties: (Property & { user: User })[];
  fromAdmin?: boolean;
}

type RowType = {
  original: Property & { user: User };
};

type ColumnDef<T> = {
  accessorKey: keyof T | string;
  header: string;
  cell?: ({ row }: { row: { original: T } }) => React.ReactNode;
};

export default function ClientTable({
  properties,
  fromAdmin,
}: ClientTableProps) {
  const [showQueries, setShowQueries] = useState(false);
  const [selectedProperty, setSelectedProperty] = useState<
    (Property & { user: User }) | null
  >(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [propertyToDelete, setPropertyToDelete] = useState<
    (Property & { user: User }) | null
  >(null);
  const [isPending, startTransition] = useTransition();
  const router = useRouter();

  const onDelete = async (id: string) => {
    startTransition(async () => {
      try {
        const result = await deleteProperty(id);
        if (result.error) {
          throw new Error(result.error);
        }
        toast.success(result.message);
        setShowDeleteDialog(false);
        router.refresh();
      } catch (error: any) {
        console.error("Error in onDelete:", error);
        toast.error(error.message || "Failed to delete property");
      }
    });
  };

  const columns: ColumnDef<Property & { user: User }>[] = [
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => (
        <Link
          href={`/properties/${row.original.propertyDetails}/${row.original.id}`}
          className="text-blue-600 hover:underline"
        >
          {row.original.title}
        </Link>
      ),
    },
    {
      accessorKey: "currency",
      header: "Currency",
    },
    {
      accessorKey: "price",
      header: "Price",
      cell: ({ row }) => <span>{row.original.price.toLocaleString()}</span>,
    },
    {
      accessorKey: "propertyDetails",
      header: "Type",
    },
    {
      accessorKey: "status",
      header: "Status",
    },
    {
      accessorKey: "updatedAt",
      header: "Updated At",
      cell: ({ row }) => (
        <span>
          {dayjs(row.original.updatedAt).format("DD MMM YYYY HH:mm A")}
        </span>
      ),
    },
    {
      accessorKey: "actions",
      header: "Actions",
      cell: ({ row }) => (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => {
                setSelectedProperty(row.original);
                setShowQueries(true);
              }}
            >
              View Queries
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/agent/properties/create-property/?cloneFrom=${row.original.id}`
                )
              }
            >
              Clone Property
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() =>
                router.push(
                  `/agent/properties/edit-property/${row.original.id}`
                )
              }
            >
              Edit Property
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={() => {
                setPropertyToDelete(row.original);
                setShowDeleteDialog(true);
              }}
              className="text-red-600"
            >
              Delete Property
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      ),
    },
  ];

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            {columns.map((column) => (
              <TableHead key={column.accessorKey}>{column.header}</TableHead>
            ))}
          </TableRow>
        </TableHeader>
        <TableBody>
          {properties.map((property) => (
            <TableRow key={property.id}>
              {columns.map((column) => (
                <TableCell key={column.accessorKey}>
                  {column.cell
                    ? column.cell({ row: { original: property } })
                    : getNestedValue(property, column.accessorKey)}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {showQueries && (
        <PropertyQueries
          selectedProperty={selectedProperty}
          showQueriesModal={showQueries}
          setShowQueriesModal={setShowQueries}
        />
      )}

      <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              Are you sure you want to delete this property?
            </DialogTitle>
            <DialogDescription>
              This action cannot be undone. This will permanently delete the
              property and remove the data from our servers.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setShowDeleteDialog(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => propertyToDelete && onDelete(propertyToDelete.id)}
              disabled={isPending}
            >
              {isPending ? "Deleting..." : "Delete Property"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}

function getNestedValue(obj: any, path: string): any {
  return path.split(".").reduce((prev, curr) => prev && prev[curr], obj);
}
