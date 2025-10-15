import {
  Box,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  IconButton,
  Checkbox,
  Skeleton,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  KeyboardArrowUp as ArrowUpIcon,
  KeyboardArrowDown as ArrowDownIcon,
  Inventory as EmptyIcon,
} from "@mui/icons-material";
import { useState, useMemo } from "react";
import type { GridTableProps, GridFilter, GridColumn } from "./types";
import GridMobileCard from "./GridMobileCard";
import GridTableFilters from "./GridTableFilters";
import { Pagination } from "../Pagination";

export default function GridTable<T extends Record<string, unknown>>({
  columns,
  rows,
  keyField,
  title,
  subtitle,
  headerActions,
  loading = false,
  empty,
  pagination,
  onPageChange,
  onPageSizeChange,
  sorting,
  onSortChange,
  filtering = [],
  onFilterChange,
  actions = [],
  selectable = false,
  selection = [],
  onSelectionChange,
  mobileBreakpoint = 768,
  showMobileCards = true,
  mobileCardExpansion = false,
  mobileCardTitle,
  size = "medium",
  stickyHeader = false,
  bordered = true,
  striped = false,
  hover = true,
  onRowClick,
  onRowDoubleClick,
}: GridTableProps<T>) {
  const theme = useTheme();
  const isMobile = useMediaQuery(`(max-width:${mobileBreakpoint}px)`);
  const [internalFilters, setInternalFilters] =
    useState<GridFilter[]>(filtering);

  // Filtreleme, sıralama ve pagination işlemleri
  const { filteredAndSortedRows, paginatedRows } = useMemo(() => {
    let result = [...rows];

    // Filtreleme uygula
    if (internalFilters.length > 0) {
      result = result.filter((row) => {
        return internalFilters.every((filter) => {
          const value = row[filter.field as keyof T];
          const filterValue = filter.value;

          switch (filter.operator) {
            case "contains":
              return String(value)
                .toLowerCase()
                .includes(String(filterValue).toLowerCase());
            case "equals":
              return value === filterValue;
            case "startsWith":
              return String(value)
                .toLowerCase()
                .startsWith(String(filterValue).toLowerCase());
            case "endsWith":
              return String(value)
                .toLowerCase()
                .endsWith(String(filterValue).toLowerCase());
            case "isEmpty":
              return !value || value === "";
            case "isNotEmpty":
              return value && value !== "";
            default:
              return true;
          }
        });
      });
    }

    // Sıralama uygula
    if (sorting?.field && sorting?.direction !== "asc") {
      result.sort((a, b) => {
        const aVal = a[sorting.field as keyof T];
        const bVal = b[sorting.field as keyof T];

        if (aVal === bVal) return 0;

        let comparison = 0;
        if (String(aVal) > String(bVal)) comparison = 1;
        if (String(aVal) < String(bVal)) comparison = -1;

        return sorting.direction === "desc" ? comparison * -1 : comparison;
      });
    }

    // Pagination uygula
    const filteredAndSortedRows = result;
    const paginatedRows = pagination
      ? result.slice(
          pagination.page * pagination.pageSize,
          (pagination.page + 1) * pagination.pageSize
        )
      : result;

    return { filteredAndSortedRows, paginatedRows };
  }, [rows, internalFilters, sorting, pagination]);

  const handleSort = (field: string) => {
    if (!onSortChange) return;

    const isCurrentField = sorting?.field === field;
    let newDirection: "asc" | "desc" = "asc";

    if (isCurrentField) {
      newDirection = sorting?.direction === "asc" ? "desc" : "asc";
    }

    onSortChange({
      field,
      direction: newDirection,
    });
  };

  const handleFilterChange = (filters: GridFilter[]) => {
    setInternalFilters(filters);
    onFilterChange?.(filters);
  };

  const handleSelectAll = (checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      const allKeys = paginatedRows.map((row) => row[keyField] as keyof T);
      onSelectionChange(allKeys);
    } else {
      onSelectionChange([]);
    }
  };

  const handleSelectRow = (rowKey: keyof T, checked: boolean) => {
    if (!onSelectionChange) return;

    if (checked) {
      onSelectionChange([...selection, rowKey]);
    } else {
      onSelectionChange(selection.filter((key) => key !== rowKey));
    }
  };

  const isAllSelected =
    selection.length > 0 && selection.length === paginatedRows.length;
  const isIndeterminate =
    selection.length > 0 && selection.length < paginatedRows.length;

  // Mobil görünümde kartlar göster
  if (isMobile && showMobileCards) {
    return (
      <Box sx={{ width: "100%" }}>
        {/* Header */}
        {(title || subtitle || headerActions) && (
          <Box sx={{ mb: 3 }}>
            {(title || subtitle) && (
              <Box sx={{ mb: 2 }}>
                {title && (
                  <Typography variant="h5" gutterBottom>
                    {title}
                  </Typography>
                )}
                {subtitle && (
                  <Typography variant="body2" color="text.secondary">
                    {subtitle}
                  </Typography>
                )}
              </Box>
            )}
            {headerActions && (
              <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
                {headerActions}
              </Box>
            )}
          </Box>
        )}

        {/* Filters */}
        {(onFilterChange || internalFilters.length > 0) && (
          <GridTableFilters
            columns={columns as GridColumn[]}
            filters={internalFilters}
            onFilterChange={handleFilterChange}
          />
        )}

        {/* Loading */}
        {loading && (
          <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
            <CircularProgress />
          </Box>
        )}

        {/* Empty State */}
        {!loading && filteredAndSortedRows.length === 0 && (
          <Box sx={{ textAlign: "center", py: 6 }}>
            {empty?.icon || (
              <EmptyIcon
                sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
              />
            )}
            <Typography variant="h6" color="text.secondary" gutterBottom>
              {empty?.message || "Hiç veri bulunamadı"}
            </Typography>
            {empty?.description && (
              <Typography variant="body2" color="text.secondary">
                {empty.description}
              </Typography>
            )}
          </Box>
        )}

        {/* Mobile Cards */}
        {!loading && paginatedRows.length > 0 && (
          <Box>
            {paginatedRows.map((row) => (
              <GridMobileCard
                key={String(row[keyField])}
                row={row}
                columns={columns}
                actions={actions}
                onRowClick={onRowClick}
                expandable={mobileCardExpansion}
                titleField={mobileCardTitle}
              />
            ))}
          </Box>
        )}

        {/* Pagination */}
        {pagination && (
          <Pagination
            total={filteredAndSortedRows.length}
            page={pagination.page}
            pageSize={pagination.pageSize}
            pageSizeOptions={pagination.pageSizeOptions || [10, 25, 50, 100]}
            onPageChange={onPageChange}
            onPageSizeChange={onPageSizeChange}
            align="center"
          />
        )}
      </Box>
    );
  }

  // Desktop tablo görünümü
  return (
    <Box sx={{ width: "100%" }}>
      {/* Header */}
      {(title || subtitle || headerActions) && (
        <Box sx={{ mb: 3 }}>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "flex-start",
              mb: 2,
            }}
          >
            <Box>
              {title && (
                <Typography variant="h5" gutterBottom>
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography variant="body2" color="text.secondary">
                  {subtitle}
                </Typography>
              )}
            </Box>
            {headerActions && <Box>{headerActions}</Box>}
          </Box>
        </Box>
      )}

      {/* Filters */}
      {(onFilterChange || internalFilters.length > 0) && (
        <GridTableFilters
          columns={columns as GridColumn[]}
          filters={internalFilters}
          onFilterChange={handleFilterChange}
        />
      )}

      <TableContainer
        component={Paper}
        elevation={bordered ? 1 : 0}
        sx={{
          border: bordered ? 1 : 0,
          borderColor: "divider",
        }}
      >
        <Table sx={{ minWidth: 650 }} size={size} stickyHeader={stickyHeader}>
          <TableHead>
            <TableRow
              sx={{
                backgroundColor: theme.palette.grey[50],
                ...theme.applyStyles("dark", {
                  backgroundColor: theme.palette.grey[900],
                }),
              }}
            >
              {selectable && (
                <TableCell padding="checkbox">
                  <Checkbox
                    indeterminate={isIndeterminate}
                    checked={isAllSelected}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    color="primary"
                  />
                </TableCell>
              )}

              {columns.map((column) => (
                <TableCell
                  key={column.id}
                  align={column.align || "left"}
                  sx={{
                    width: column.width,
                    minWidth: column.minWidth,
                    cursor: column.sortable !== false ? "pointer" : "default",
                    fontWeight: 600,
                    "&:hover":
                      column.sortable !== false
                        ? {
                            backgroundColor: theme.palette.action.hover,
                          }
                        : {},
                  }}
                  onClick={() =>
                    column.sortable !== false && handleSort(column.field)
                  }
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    {column.headerRender ? column.headerRender() : column.label}

                    {column.sortable !== false &&
                      sorting?.field === column.field && (
                        <Box sx={{ display: "flex", flexDirection: "column" }}>
                          {sorting.direction === "desc" ? (
                            <ArrowDownIcon fontSize="small" />
                          ) : (
                            <ArrowUpIcon fontSize="small" />
                          )}
                        </Box>
                      )}
                  </Box>
                </TableCell>
              ))}

              {actions.length > 0 && (
                <TableCell align="center" sx={{ width: actions.length * 48 }}>
                  <Typography variant="subtitle2" fontWeight={600}>
                    İşlemler
                  </Typography>
                </TableCell>
              )}
            </TableRow>
          </TableHead>

          <TableBody>
            {loading ? (
              // Loading skeleton
              Array.from(new Array(5)).map((_, index) => (
                <TableRow key={index}>
                  {selectable && (
                    <TableCell padding="checkbox">
                      <Skeleton variant="rectangular" width={18} height={18} />
                    </TableCell>
                  )}
                  {columns.map((column) => (
                    <TableCell key={column.id}>
                      <Skeleton variant="text" />
                    </TableCell>
                  ))}
                  {actions.length > 0 && (
                    <TableCell>
                      <Box
                        sx={{
                          display: "flex",
                          justifyContent: "center",
                          gap: 1,
                        }}
                      >
                        {actions.map((_, actionIndex) => (
                          <Skeleton
                            key={actionIndex}
                            variant="circular"
                            width={32}
                            height={32}
                          />
                        ))}
                      </Box>
                    </TableCell>
                  )}
                </TableRow>
              ))
            ) : filteredAndSortedRows.length === 0 ? (
              // Empty state
              <TableRow>
                <TableCell
                  colSpan={
                    columns.length +
                    (selectable ? 1 : 0) +
                    (actions.length > 0 ? 1 : 0)
                  }
                  sx={{ textAlign: "center", py: 6 }}
                >
                  <Box>
                    {empty?.icon || (
                      <EmptyIcon
                        sx={{ fontSize: 64, color: "text.secondary", mb: 2 }}
                      />
                    )}
                    <Typography
                      variant="h6"
                      color="text.secondary"
                      gutterBottom
                    >
                      {empty?.message || "Hiç veri bulunamadı"}
                    </Typography>
                    {empty?.description && (
                      <Typography variant="body2" color="text.secondary">
                        {empty.description}
                      </Typography>
                    )}
                  </Box>
                </TableCell>
              </TableRow>
            ) : (
              // Data rows
              paginatedRows.map((row, rowIndex) => {
                const rowKey = row[keyField] as keyof T;
                const isSelected = selection.includes(rowKey);

                return (
                  <TableRow
                    key={String(rowKey)}
                    hover={hover}
                    selected={isSelected}
                    sx={{
                      cursor: onRowClick ? "pointer" : "default",
                      backgroundColor:
                        striped && rowIndex % 2 === 1
                          ? theme.palette.action.hover
                          : "inherit",
                      "&:hover": hover
                        ? {
                            backgroundColor: theme.palette.action.hover,
                          }
                        : {},
                    }}
                    onClick={() => onRowClick?.(row)}
                    onDoubleClick={() => onRowDoubleClick?.(row)}
                  >
                    {selectable && (
                      <TableCell padding="checkbox">
                        <Checkbox
                          checked={isSelected}
                          onChange={(e) =>
                            handleSelectRow(rowKey, e.target.checked)
                          }
                          color="primary"
                        />
                      </TableCell>
                    )}

                    {columns.map((column) => {
                      const value = row[column.field as keyof T];

                      return (
                        <TableCell
                          key={column.id}
                          align={column.align || "left"}
                        >
                          {column.render
                            ? column.render(value, row, column)
                            : String(value || "-")}
                        </TableCell>
                      );
                    })}

                    {actions.length > 0 && (
                      <TableCell align="center">
                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 0.5,
                          }}
                        >
                          {actions
                            .filter((action) => !action.hidden?.(row))
                            .map((action) => (
                              <IconButton
                                key={action.id}
                                size="small"
                                color={action.color || "primary"}
                                disabled={action.disabled?.(row)}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  action.onClick(row);
                                }}
                                title={action.label}
                              >
                                {action.icon}
                              </IconButton>
                            ))}
                        </Box>
                      </TableCell>
                    )}
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>

      {/* Pagination */}
      {pagination && !loading && (
        <Pagination
          total={filteredAndSortedRows.length}
          page={pagination.page}
          pageSize={pagination.pageSize}
          pageSizeOptions={pagination.pageSizeOptions || [10, 25, 50, 100]}
          onPageChange={onPageChange}
          onPageSizeChange={onPageSizeChange}
          loading={loading}
        />
      )}
    </Box>
  );
}
