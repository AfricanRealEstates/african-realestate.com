"use client";

import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  getSortedRowModel,
  type ColumnFiltersState,
  getFilteredRowModel,
} from "@tanstack/react-table";

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { X } from "lucide-react";

import { useState, useEffect } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";

interface DataTableProps<TData, TValue> {
  columns: ColumnDef<TData, TValue>[];
  data: TData[];
  pageCount: number;
  currentPage?: number;
  pageSize?: number;
}

export function DataTable<TData, TValue>({
  columns,
  data,
  pageCount,
  currentPage = 1,
  pageSize = 10,
}: DataTableProps<TData, TValue>) {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);

  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  // Initialize filters from URL
  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    const titleFilter = searchParams.get("title");
    if (titleFilter) newFilters.push({ id: "title", value: titleFilter });

    const statusFilter = searchParams.get("status");
    if (statusFilter && statusFilter !== "all")
      newFilters.push({ id: "status", value: statusFilter });

    const authorFilter = searchParams.get("author");
    if (authorFilter && authorFilter !== "all")
      newFilters.push({ id: "author", value: authorFilter });

    const blogNumberFilter = searchParams.get("blogNumber");
    if (blogNumberFilter)
      newFilters.push({ id: "blogNumber", value: blogNumberFilter });

    setColumnFilters(newFilters);
  }, [searchParams]);

  const table = useReactTable({
    data,
    columns,
    getCoreRowModel: getCoreRowModel(),
    onSortingChange: setSorting,
    getSortedRowModel: getSortedRowModel(),
    onColumnFiltersChange: setColumnFilters,
    getFilteredRowModel: getFilteredRowModel(),
    state: {
      sorting,
      columnFilters,
      pagination: {
        pageIndex: currentPage - 1,
        pageSize,
      },
    },
    manualPagination: true,
    pageCount,
  });

  const createQueryString = (params: Record<string, string | null>) => {
    const newParams = new URLSearchParams(searchParams.toString());
    newParams.set("page", "1");

    Object.entries(params).forEach(([key, value]) => {
      if (value === null) {
        newParams.delete(key);
      } else {
        newParams.set(key, value);
      }
    });

    return newParams.toString();
  };

  const handleFilterChange = (columnId: string, value: string) => {
    const paramValue = value.trim() === "" || value === "all" ? null : value;
    router.push(`${pathname}?${createQueryString({ [columnId]: paramValue })}`);
  };

  const clearAllFilters = () => {
    router.push(`${pathname}?page=1`);
  };

  // Create options dynamically
  const statusOptions = ["Published", "Draft"];
  const authorOptions = Array.from(
    new Set(data.map((item: any) => item.author).filter(Boolean))
  );

  return (
    <div>
      {/* Filters section */}
      <div className="flex flex-wrap gap-4 py-4">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) => handleFilterChange("title", e.target.value)}
          className="max-w-xs"
        />

        <Select
          value={(table.getColumn("status")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => handleFilterChange("status", value)}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filter by status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All statuses</SelectItem>
            {statusOptions.map((status) => (
              <SelectItem key={status} value={status}>
                {status}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select
          value={(table.getColumn("author")?.getFilterValue() as string) ?? ""}
          onValueChange={(value) => handleFilterChange("author", value)}
        >
          <SelectTrigger className="max-w-[200px]">
            <SelectValue placeholder="Filter by author" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All authors</SelectItem>
            {authorOptions.map((author) => (
              <SelectItem key={author} value={author}>
                {author}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Input
          placeholder="Filter by blog number (e.g. 1, 2, 3...)"
          value={
            (table.getColumn("blogNumber")?.getFilterValue() as string) ?? ""
          }
          onChange={(e) => handleFilterChange("blogNumber", e.target.value)}
          className="max-w-[160px]"
          type="number"
          min="1"
        />

        <Select
          onValueChange={(value) => {
            if (value === "newest") {
              setSorting([{ id: "createdAt", desc: true }]);
            } else if (value === "oldest") {
              setSorting([{ id: "createdAt", desc: false }]);
            }
          }}
        >
          <SelectTrigger className="max-w-[180px]">
            <SelectValue placeholder="Sort by" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="newest">Newest first</SelectItem>
            <SelectItem value="oldest">Oldest first</SelectItem>
          </SelectContent>
        </Select>

        {columnFilters.length > 0 && (
          <Button
            variant="outline"
            onClick={clearAllFilters}
            size="sm"
            className="h-9 gap-1"
          >
            Clear filters
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>

      {/* Table section */}
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => (
                  <TableHead key={header.id} className="whitespace-nowrap">
                    {header.isPlaceholder
                      ? null
                      : flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
                  </TableHead>
                ))}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows.length > 0 ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} className="py-2">
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
