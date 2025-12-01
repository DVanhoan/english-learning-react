import * as React from "react";
import {
  ChevronLeftIcon,
  ChevronRightIcon,
  MoreHorizontalIcon,
} from "lucide-react";
import { useSearchParams } from "react-router-dom";

import { cn } from "../../lib/utils";
import { buttonVariants } from "../ui/button";

interface PaginationProps {
  totalPages: number;
  pageParamName?: string;
  maxVisiblePages?: number;
  showFirstLast?: boolean;
  scrollToTop?: boolean;
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

function generatePageNumbers(
  currentPage: number,
  totalPages: number,
  maxVisiblePages: number
): (number | string)[] {
  const pages: (number | string)[] = [];

  if (totalPages <= maxVisiblePages) {
    for (let i = 1; i <= totalPages; i++) {
      pages.push(i);
    }
  } else {
    pages.push(1);

    const leftBound = Math.max(
      2,
      currentPage - Math.floor(maxVisiblePages / 2)
    );
    const rightBound = Math.min(
      totalPages - 1,
      currentPage + Math.floor(maxVisiblePages / 2)
    );

    if (leftBound > 2) {
      pages.push("...");
    }

    for (let i = leftBound; i <= rightBound; i++) {
      pages.push(i);
    }

    if (rightBound < totalPages - 1) {
      pages.push("...");
    }

    if (totalPages > 1) {
      pages.push(totalPages);
    }
  }

  return pages;
}

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

export default function Pagination({
  totalPages,
  pageParamName = "page",
  maxVisiblePages = 7,
  showFirstLast = true,
  scrollToTop = true,
  className,
  buttonClassName,
  activeButtonClassName,
}: PaginationProps) {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = React.useMemo(() => {
    const pageFromParams = searchParams.get(pageParamName);
    const parsedPage = pageFromParams ? parseInt(pageFromParams, 10) : 1;
    return isNaN(parsedPage) || parsedPage < 1
      ? 1
      : Math.min(parsedPage, totalPages);
  }, [searchParams, pageParamName, totalPages]);

  const pageNumbers = generatePageNumbers(
    currentPage,
    totalPages,
    maxVisiblePages
  );

  const handlePageChange = React.useCallback(
    (page: number) => {
      if (page >= 1 && page <= totalPages && page !== currentPage) {
        setSearchParams((prev) => {
          const newParams = new URLSearchParams(prev);
          if (page === 1) {
            // Remove page param if going to first page
            newParams.delete(pageParamName);
          } else {
            newParams.set(pageParamName, page.toString());
          }
          return newParams;
        });
        if (scrollToTop && typeof window !== "undefined") {
          try {
            window.scrollTo({ top: 0, behavior: "smooth" });
          } catch (e) {
            window.scrollTo(0, 0);
          }
        }
      }
    },
    [currentPage, totalPages, pageParamName, setSearchParams, scrollToTop]
  );

  if (totalPages <= 0) {
    return null;
  }

  return (
    <nav
      role="navigation"
      aria-label="pagination"
      className={cn("mx-auto flex w-full justify-center", className)}
    >
      <ul className="flex flex-row items-center gap-1">
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
            <span className="hidden sm:block">Trang trước</span>
          </a>
        </li>

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
            <span className="hidden sm:block">Trang sau</span>
            <ChevronRightIcon />
          </a>
        </li>
      </ul>
    </nav>
  );
}
