import { useMemo } from "react";
import { useSearchParams } from "react-router-dom";

interface UsePaginationProps {
  totalPages: number;
  pageParamName?: string;
}

interface UsePaginationReturn {
  currentPage: number;
  setPage: (page: number) => void;
}

export function usePagination({
  totalPages,
  pageParamName = "page",
}: UsePaginationProps): UsePaginationReturn {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = useMemo(() => {
    const pageFromParams = searchParams.get(pageParamName);
    const parsedPage = pageFromParams ? parseInt(pageFromParams, 10) : 1;
    return isNaN(parsedPage) || parsedPage < 1
      ? 1
      : Math.min(parsedPage, totalPages);
  }, [searchParams, pageParamName, totalPages]);

  const setPage = (page: number) => {
    if (page >= 1 && page <= totalPages && page !== currentPage) {
      setSearchParams((prev) => {
        const newParams = new URLSearchParams(prev);
        if (page === 1) {
          newParams.delete(pageParamName);
        } else {
          newParams.set(pageParamName, page.toString());
        }
        return newParams;
      });
    }
  };

  return {
    currentPage,
    setPage,
  };
}
