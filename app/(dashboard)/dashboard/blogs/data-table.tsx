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
import { useState, useEffect } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";

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

  // Initialize filters from URL params
  useEffect(() => {
    const newFilters: ColumnFiltersState = [];

    // Check for title filter
    const titleFilter = searchParams.get("title");
    if (titleFilter) {
      newFilters.push({
        id: "title",
        value: titleFilter,
      });
    }

    // Check for status filter
    const statusFilter = searchParams.get("status");
    if (statusFilter) {
      newFilters.push({
        id: "status",
        value: statusFilter,
      });
    }

    // Check for author filter
    const authorFilter = searchParams.get("author");
    if (authorFilter) {
      newFilters.push({
        id: "author",
        value: authorFilter,
      });
    }

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

    // Reset to first page when filters change
    newParams.set("page", "1");

    // Update or remove params based on provided values
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
    // If value is empty, remove the filter
    const paramValue = value.trim() === "" ? null : value;

    // Update URL with new filter
    router.push(`${pathname}?${createQueryString({ [columnId]: paramValue })}`);
  };

  const clearAllFilters = () => {
    const newParams = new URLSearchParams(searchParams.toString());

    // Remove all filter params but keep pagination
    newParams.delete("title");
    newParams.delete("status");
    newParams.delete("author");
    newParams.set("page", "1");

    router.push(`${pathname}?${newParams.toString()}`);
  };

  const goToPage = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", pageNumber.toString());
    router.push(`${pathname}?${params.toString()}`);
  };

  // Get unique status values for the filter dropdown
  const statusOptions = Array.from(
    new Set(data.map((item: any) => item.status))
  );

  // Get unique author values for the filter dropdown
  const authorOptions = Array.from(
    new Set(data.map((item: any) => item.author).filter(Boolean))
  );

  return (
    <div>
      <div className="flex flex-col gap-4 py-4 md:flex-row md:items-center">
        <Input
          placeholder="Filter by title..."
          value={(table.getColumn("title")?.getFilterValue() as string) ?? ""}
          onChange={(e) => handleFilterChange("title", e.target.value)}
          className="max-w-sm"
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
