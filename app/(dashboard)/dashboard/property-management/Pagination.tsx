"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PaginationComponentProps {
  currentPage: number;
  totalPages: number;
  baseUrl: string;
  queryParams?: Record<string, string>;
}

export function PaginationComponent({
  currentPage,
  totalPages,
  baseUrl,
  queryParams = {},
}: PaginationComponentProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageUrl = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams.toString());

    // Add any additional query params
    Object.entries(queryParams).forEach(([key, value]) => {
      params.set(key, value);
    });

    params.set("page", pageNumber.toString());
    return `${baseUrl}?${params.toString()}`;
  };

  // Calculate which page numbers to show
  const getVisiblePages = () => {
    const delta = 2; // Number of pages to show on each side of current page
    const pages = [];

    // Always show first page
    pages.push(1);

    // Calculate range around current page
    const rangeStart = Math.max(2, currentPage - delta);
    const rangeEnd = Math.min(totalPages - 1, currentPage + delta);

    // Add ellipsis after first page if needed
    if (rangeStart > 2) {
      pages.push(-1); // -1 represents ellipsis
    }

    // Add pages in the middle range
    for (let i = rangeStart; i <= rangeEnd; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rangeEnd < totalPages - 1) {
      pages.push(-2); // -2 represents ellipsis (using different key)
    }

    // Always show last page if it's not the first page
    if (totalPages > 1) {
      pages.push(totalPages);
    }

    return pages;
  };

  const visiblePages = getVisiblePages();

  return (
    <TooltipProvider>
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationPrevious
                  href={currentPage > 1 ? createPageUrl(currentPage - 1) : "#"}
                  aria-disabled={currentPage === 1}
                  className={
                    currentPage === 1 ? "pointer-events-none opacity-50" : ""
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to previous page</p>
              </TooltipContent>
            </Tooltip>
          </PaginationItem>

          {visiblePages.map((page, index) => {
            // Render ellipsis
            if (page < 0) {
              return (
                <PaginationItem key={`ellipsis-${index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              );
            }

            // Render page number with tooltip for first and last page
            return (
              <PaginationItem key={page}>
                {page === 1 || page === totalPages ? (
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <PaginationLink
                        href={createPageUrl(page)}
                        isActive={page === currentPage}
                      >
                        {page}
                      </PaginationLink>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>
                        {page === 1 ? "Go to first page" : "Go to last page"}
                      </p>
                    </TooltipContent>
                  </Tooltip>
                ) : (
                  <PaginationLink
                    href={createPageUrl(page)}
                    isActive={page === currentPage}
                  >
                    {page}
                  </PaginationLink>
                )}
              </PaginationItem>
            );
          })}

          <PaginationItem>
            <Tooltip>
              <TooltipTrigger asChild>
                <PaginationNext
                  href={
                    currentPage < totalPages
                      ? createPageUrl(currentPage + 1)
                      : "#"
                  }
                  aria-disabled={currentPage === totalPages}
                  className={
                    currentPage === totalPages
                      ? "pointer-events-none opacity-50"
                      : ""
                  }
                />
              </TooltipTrigger>
              <TooltipContent>
                <p>Go to next page</p>
              </TooltipContent>
            </Tooltip>
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </TooltipProvider>
  );
}
