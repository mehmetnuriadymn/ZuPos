import { useState, useCallback, useMemo } from "react";
import type { UsePaginationProps, UsePaginationReturn } from "./types";

export function usePagination({
  total,
  initialPage = 0,
  initialPageSize = 10,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
}: UsePaginationProps): UsePaginationReturn {
  const [page, setPage] = useState(initialPage);
  const [pageSize, setPageSize] = useState(initialPageSize);

  // Hesaplanan değerler
  const totalPages = useMemo(
    () => Math.ceil(total / pageSize),
    [total, pageSize]
  );
  const startIndex = useMemo(() => page * pageSize + 1, [page, pageSize]);
  const endIndex = useMemo(
    () => Math.min((page + 1) * pageSize, total),
    [page, pageSize, total]
  );
  const canGoNext = useMemo(() => page < totalPages - 1, [page, totalPages]);
  const canGoPrev = useMemo(() => page > 0, [page]);

  // Event handlers
  const handlePageChange = useCallback(
    (newPage: number) => {
      if (newPage >= 0 && newPage < totalPages) {
        setPage(newPage);
        onPageChange?.(newPage, pageSize);
      }
    },
    [totalPages, pageSize, onPageChange]
  );

  const handlePageSizeChange = useCallback(
    (newPageSize: number) => {
      const newTotalPages = Math.ceil(total / newPageSize);
      const adjustedPage =
        page >= newTotalPages ? Math.max(0, newTotalPages - 1) : page;

      setPageSize(newPageSize);
      setPage(adjustedPage);
      onPageChange?.(adjustedPage, newPageSize);
    },
    [total, page, onPageChange]
  );

  // Utility functions
  const reset = useCallback(() => {
    setPage(initialPage);
    setPageSize(initialPageSize);
    onPageChange?.(initialPage, initialPageSize);
  }, [initialPage, initialPageSize, onPageChange]);

  const goToFirstPage = useCallback(() => {
    handlePageChange(0);
  }, [handlePageChange]);

  const goToLastPage = useCallback(() => {
    handlePageChange(totalPages - 1);
  }, [handlePageChange, totalPages]);

  return {
    pagination: {
      page,
      pageSize,
      total,
      pageSizeOptions,
    },
    handlePageChange,
    handlePageSizeChange,
    reset,
    goToFirstPage,
    goToLastPage,
    canGoNext,
    canGoPrev,
    totalPages,
    startIndex,
    endIndex,
  };
}
