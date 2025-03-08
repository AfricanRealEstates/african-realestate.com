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

interface PaginationControlsProps {
  pageCount: number;
  currentPage: number;
}

export function PaginationControls({
  pageCount,
  currentPage,
}: PaginationControlsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const createPageURL = (pageNumber: number) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", pageNumber.toString());
    return `${pathname}?${params.toString()}`;
  };

  // Generate page numbers to display
  const getPageNumbers = () => {
    const pages = [];

    // Always show first page
    pages.push(1);

    // Current page neighborhood
    for (
      let i = Math.max(2, currentPage - 1);
      i <= Math.min(pageCount - 1, currentPage + 1);
      i++
    ) {
      if (pages[pages.length - 1] !== i - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      pages.push(i);
    }

    // Add last page if not already included
    if (pageCount > 1) {
      if (pages[pages.length - 1] !== pageCount - 1) {
        // Add ellipsis if there's a gap
        pages.push(-1);
      }
      if (!pages.includes(pageCount)) {
        pages.push(pageCount);
      }
    }

    return pages;
  };

  const pageNumbers = getPageNumbers();

  return (
    <Pagination>
      <PaginationContent>
        <PaginationItem>
          <PaginationPrevious
            href={createPageURL(currentPage - 1)}
            aria-disabled={currentPage <= 1}
            tabIndex={currentPage <= 1 ? -1 : undefined}
            className={currentPage <= 1 ? "pointer-events-none opacity-50" : ""}
          />
        </PaginationItem>

        {pageNumbers.map((pageNumber, i) =>
          pageNumber === -1 ? (
            <PaginationItem key={`ellipsis-${i}`}>
              <PaginationEllipsis />
            </PaginationItem>
          ) : (
            <PaginationItem key={pageNumber}>
              <PaginationLink
                href={createPageURL(pageNumber)}
                isActive={pageNumber === currentPage}
              >
                {pageNumber}
              </PaginationLink>
            </PaginationItem>
          )
        )}

        <PaginationItem>
          <PaginationNext
            href={createPageURL(currentPage + 1)}
            aria-disabled={currentPage >= pageCount}
            tabIndex={currentPage >= pageCount ? -1 : undefined}
            className={
              currentPage >= pageCount ? "pointer-events-none opacity-50" : ""
            }
          />
        </PaginationItem>
      </PaginationContent>
    </Pagination>
  );
}
