import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";

// Types
interface DynamicPaginationProps {
  currentPage: number;
  totalPages: number;
  onPageChange: (page: number) => void;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  className?: string;
  buttonClassName?: string;
  activeButtonClassName?: string;
}

interface PaginationItemProps {
  page: number;
  isActive: boolean;
  onClick: () => void;
  children: React.ReactNode;
  buttonClassName?: string;
  activeButtonClassName?: string;
}

// Helper function to generate page numbers with ellipsis
function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    // If total pages is less than max visible, show all pages
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    const leftBound = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const rightBound = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisiblePages / 2)
    );

    // Add ellipsis after first page if needed
    if (leftBound > 2) {
      pages.push("...");
    }

    // Add middle pages
    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    // Add ellipsis before last page if needed
    if (rightBound < totalPages - 1) {
      pages.push("...");
    }

    // Always show last page
    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
}

// Pagination Item Component
function PaginationItem({
  isActive,
  onClick,
  children,
  buttonClassName,
  activeButtonClassName,
}: PaginationItemProps) {
  return (
    <li>
      <a
        aria-current={isActive ? "page" : undefined}
        data-slot="pagination-link"
        data-active={isActive}
        className={cn(
          buttonVariants({
            variant: isActive ? "outline" : "ghost",
            size: "icon",
          }),
          "h-9 w-9",
          buttonClassName,
          isActive && activeButtonClassName
        )}
        onClick={onClick}
        style={{ cursor: "pointer" }}
      >
        {children}
      </a>
    </li>
  );
}

// Main Dynamic Pagination Component
export default function DynamicPagination({
  currentPage,
  totalPages,
  onPageChange,
  maxVisiblePages = 7,
  showFirstLast = true,
  className,
  buttonClassName,
  activeButtonClassName,
}: DynamicPaginationProps) {
  const pageNumbers = generatePageNumbers(
    currentPage,
    totalPages,
    maxVisiblePages
  );

  const handlePageChange = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      onPageChange(page);
    }
  };

  if (totalPages <= 1) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
        {/* Previous Button */}
        <li>
          <a
            aria-label="Go to previous page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pl-2.5",
              currentPage === 1 && "pointer-events-none opacity-50",
              buttonClassName
            )}
            onClick={() => handlePageChange(currentPage - 1)}
            style={{ cursor: currentPage === 1 ? "not-allowed" : "pointer" }}
          >
            <ChevronLeftIcon />
            <span className="hidden sm:block">Previous</span>
          </a>
        </li>

        {/* First Page Button (optional) */}
        {showFirstLast && currentPage > 3 && totalPages > 5 && (
          <PaginationItem
            page={1}
            isActive={false}
            onClick={() => handlePageChange(1)}
            buttonClassName={buttonClassName}
            activeButtonClassName={activeButtonClassName}
          >
            1
          </PaginationItem>
        )}

        {/* Page Numbers */}
        {pageNumbers.map((page, index) => {
          if (page === "...") {
            return (
              <li key={`ellipsis-${index}`}>
                <span
                  aria-hidden
                  className="flex size-9 items-center justify-center"
                >
                  <MoreHorizontalIcon className="size-4" />
                  <span className="sr-only">More pages</span>
                </span>
              </li>
            );
          }

          const pageNumber = page as number;
          return (
            <PaginationItem
              key={pageNumber}
              page={pageNumber}
              isActive={pageNumber === currentPage}
              onClick={() => handlePageChange(pageNumber)}
              buttonClassName={buttonClassName}
              activeButtonClassName={activeButtonClassName}
            >
              {pageNumber}
            </PaginationItem>
          );
        })}

        {/* Last Page Button (optional) */}
        {showFirstLast && currentPage < totalPages - 2 && totalPages > 5 && (
          <PaginationItem
            page={totalPages}
            isActive={false}
            onClick={() => handlePageChange(totalPages)}
            buttonClassName={buttonClassName}
            activeButtonClassName={activeButtonClassName}
          >
            {totalPages}
          </PaginationItem>
        )}

        {/* Next Button */}
        <li>
          <a
            aria-label="Go to next page"
            className={cn(
              buttonVariants({
                variant: "ghost",
                size: "default",
              }),
              "gap-1 px-2.5 sm:pr-2.5",
              currentPage === totalPages && "pointer-events-none opacity-50",
              buttonClassName
            )}
            onClick={() => handlePageChange(currentPage + 1)}
            style={{
              cursor: currentPage === totalPages ? "not-allowed" : "pointer",
            }}
          >
            <span className="hidden sm:block">Next</span>
            <ChevronRightIcon />
          </a>
        </li>
      </ul>
    </nav>
  );
}

export {
  Pagination,
  PaginationContent,
  PaginationLink,
  PaginationItem as PaginationItemBase,
  PaginationPrevious,
  PaginationNext,
  PaginationEllipsis,
} from "../ui/pagination";
