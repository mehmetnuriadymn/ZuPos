// Pagination Configuration
export interface PaginationConfig {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}

// Pagination Component Props
export interface PaginationProps {
  // Data
  total: number;
  page: number;
  pageSize: number;

  // Options
  pageSizeOptions?: number[];

  // Events
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  // Display
  showFirstButton?: boolean;
  showLastButton?: boolean;
  showPageSizeSelector?: boolean;

  // Labels (Türkçe default)
  labelRowsPerPage?: string;
  labelDisplayedRows?: (params: {
    from: number;
    to: number;
    count: number;
  }) => string;

  // Styling
  size?: "small" | "medium";
  variant?: "standard" | "outlined";
  color?: "primary" | "secondary";

  // Layout
  component?: React.ElementType;
  align?: "left" | "center" | "right";

  // Advanced
  disabled?: boolean;
  loading?: boolean;
}

// Pagination Hook Return Type
export interface UsePaginationReturn {
  pagination: PaginationConfig;
  handlePageChange: (page: number) => void;
  handlePageSizeChange: (pageSize: number) => void;
  reset: () => void;
  goToFirstPage: () => void;
  goToLastPage: () => void;
  canGoNext: boolean;
  canGoPrev: boolean;
  totalPages: number;
  startIndex: number;
  endIndex: number;
}

// Pagination Hook Props
export interface UsePaginationProps {
  total: number;
  initialPage?: number;
  initialPageSize?: number;
  pageSizeOptions?: number[];
  onPageChange?: (page: number, pageSize: number) => void;
}
