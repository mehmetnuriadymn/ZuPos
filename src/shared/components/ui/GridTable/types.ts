import type { ReactNode } from "react";
import type { SortDirection } from "@mui/material";

// Grid Table Column Definition
export interface GridColumn<T = Record<string, unknown>> {
  id: string;
  label: string;
  field: string;
  width?: string | number;
  minWidth?: number;
  sortable?: boolean;
  filterable?: boolean;
  align?: "left" | "center" | "right";
  render?: (value: unknown, row: T, column: GridColumn<T>) => ReactNode;
  headerRender?: () => ReactNode;
  hideOnMobile?: boolean;
  priority?: number; // 1-5, düşük numara = yüksek öncelik (mobilde gösterilir)
}

// Grid Table Row Actions
export interface GridAction<T = Record<string, unknown>> {
  id: string;
  label: string;
  icon?: ReactNode;
  color?: "primary" | "secondary" | "error" | "warning" | "info" | "success";
  variant?: "contained" | "outlined" | "text";
  onClick: (row: T) => void;
  disabled?: (row: T) => boolean;
  hidden?: (row: T) => boolean;
}

// Pagination Config
export interface GridPagination {
  page: number;
  pageSize: number;
  total: number;
  pageSizeOptions?: number[];
}

// Sorting Config
export interface GridSort {
  field: string;
  direction: SortDirection;
}

// Filtering Config
export interface GridFilter {
  field: string;
  operator:
    | "contains"
    | "equals"
    | "startsWith"
    | "endsWith"
    | "isEmpty"
    | "isNotEmpty";
  value: unknown;
}

// Grid Table Props
export interface GridTableProps<T = Record<string, unknown>> {
  // Data
  columns: GridColumn<T>[];
  rows: T[];
  keyField: keyof T;

  // UI Configuration
  title?: string;
  subtitle?: string;
  headerActions?: ReactNode;
  loading?: boolean;
  empty?: {
    message?: string;
    description?: string;
    icon?: ReactNode;
  };

  // Features
  pagination?: GridPagination;
  onPageChange?: (page: number) => void;
  onPageSizeChange?: (pageSize: number) => void;

  sorting?: GridSort;
  onSortChange?: (sort: GridSort) => void;

  filtering?: GridFilter[];
  onFilterChange?: (filters: GridFilter[]) => void;

  actions?: GridAction<T>[];

  // Selection
  selectable?: boolean;
  selection?: (keyof T)[];
  onSelectionChange?: (selection: (keyof T)[]) => void;

  // Responsive
  mobileBreakpoint?: number;
  showMobileCards?: boolean; // Mobilde tablo yerine card görünümü
  mobileCardExpansion?: boolean; // Mobil kartların açılıp kapanması
  mobileCardTitle?: string; // Mobil kart başlığı için kullanılacak field

  // Styling
  size?: "small" | "medium";
  stickyHeader?: boolean;
  bordered?: boolean;
  striped?: boolean;
  hover?: boolean;

  // Events
  onRowClick?: (row: T) => void;
  onRowDoubleClick?: (row: T) => void;
}

// Mobile Card View Props
export interface GridMobileCardProps<T = Record<string, unknown>> {
  row: T;
  columns: GridColumn<T>[];
  actions?: GridAction<T>[];
  onRowClick?: (row: T) => void;
  expandable?: boolean; // Kartın açılıp kapanabilir olması
  titleField?: string; // Başlık için kullanılacak field
}

// Filter Component Props
export interface GridFilterProps {
  columns: GridColumn[];
  filters: GridFilter[];
  onFilterChange: (filters: GridFilter[]) => void;
}
