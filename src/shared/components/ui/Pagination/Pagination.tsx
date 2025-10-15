import {
  TablePagination as MuiTablePagination,
  Box,
  Typography,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  Stack,
  useTheme,
  useMediaQuery,
  CircularProgress,
} from "@mui/material";
import {
  FirstPage as FirstPageIcon,
  LastPage as LastPageIcon,
  KeyboardArrowLeft as PrevIcon,
  KeyboardArrowRight as NextIcon,
} from "@mui/icons-material";
import type { PaginationProps } from "./types";

export default function Pagination({
  total,
  page,
  pageSize,
  pageSizeOptions = [5, 10, 25, 50, 100],
  onPageChange,
  onPageSizeChange,
  showFirstButton = false,
  showLastButton = false,
  showPageSizeSelector = true,
  labelRowsPerPage = "Sayfa başına:",
  labelDisplayedRows = ({ from, to, count }) => `${from}-${to} / ${count}`,
  size = "medium",
  variant = "standard",
  color = "primary",
  component = "div",
  align = "right",
  disabled = false,
  loading = false,
}: PaginationProps) {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const totalPages = Math.ceil(total / pageSize);
  const startIndex = page * pageSize + 1;
  const endIndex = Math.min((page + 1) * pageSize, total);
  const canGoNext = page < totalPages - 1;
  const canGoPrev = page > 0;

  const handlePageChange = (newPage: number) => {
    if (!disabled && !loading && newPage >= 0 && newPage < totalPages) {
      onPageChange?.(newPage);
    }
  };

  const handlePageSizeChange = (newPageSize: number) => {
    if (!disabled && !loading) {
      onPageSizeChange?.(newPageSize);
    }
  };

  // Mobil görünüm için kompakt pagination
  if (isMobile) {
    return (
      <Box
        component={component}
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 2,
          alignItems: "center",
          py: 2,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        {/* Bilgi satırı */}
        <Typography variant="body2" color="text.secondary">
          {loading ? (
            <Stack direction="row" spacing={1} alignItems="center">
              <CircularProgress size={16} />
              <span>Yükleniyor...</span>
            </Stack>
          ) : (
            labelDisplayedRows({ from: startIndex, to: endIndex, count: total })
          )}
        </Typography>

        {/* Navigation */}
        <Stack direction="row" spacing={1} alignItems="center">
          {showPageSizeSelector && (
            <FormControl size="small" sx={{ minWidth: 70 }}>
              <Select
                value={pageSize}
                onChange={(e) => handlePageSizeChange(Number(e.target.value))}
                disabled={disabled || loading}
                variant="outlined"
                size="small"
              >
                {pageSizeOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          )}

          {showFirstButton && (
            <IconButton
              onClick={() => handlePageChange(0)}
              disabled={!canGoPrev || disabled || loading}
              size={size}
              color={color}
            >
              <FirstPageIcon />
            </IconButton>
          )}

          <IconButton
            onClick={() => handlePageChange(page - 1)}
            disabled={!canGoPrev || disabled || loading}
            size={size}
            color={color}
          >
            <PrevIcon />
          </IconButton>

          <Typography variant="body2" sx={{ px: 2 }}>
            {page + 1} / {totalPages}
          </Typography>

          <IconButton
            onClick={() => handlePageChange(page + 1)}
            disabled={!canGoNext || disabled || loading}
            size={size}
            color={color}
          >
            <NextIcon />
          </IconButton>

          {showLastButton && (
            <IconButton
              onClick={() => handlePageChange(totalPages - 1)}
              disabled={!canGoNext || disabled || loading}
              size={size}
              color={color}
            >
              <LastPageIcon />
            </IconButton>
          )}
        </Stack>
      </Box>
    );
  }

  // Desktop görünüm - Material-UI TablePagination kullan
  if (variant === "standard") {
    return (
      <Box
        sx={{
          display: "flex",
          justifyContent: align === "center" ? "center" : `flex-${align}`,
          opacity: disabled ? 0.5 : 1,
        }}
      >
        <MuiTablePagination
          component={component}
          count={total}
          page={page}
          onPageChange={(_, newPage) => handlePageChange(newPage)}
          rowsPerPage={pageSize}
          onRowsPerPageChange={(e) =>
            handlePageSizeChange(parseInt(e.target.value))
          }
          rowsPerPageOptions={pageSizeOptions}
          labelRowsPerPage={labelRowsPerPage}
          labelDisplayedRows={labelDisplayedRows}
          showFirstButton={showFirstButton}
          showLastButton={showLastButton}
          size={size}
          disabled={disabled || loading}
        />
      </Box>
    );
  }

  // Custom outlined variant
  return (
    <Box
      component={component}
      sx={{
        display: "flex",
        justifyContent: align === "center" ? "center" : `flex-${align}`,
        alignItems: "center",
        gap: 2,
        p: 2,
        border: 1,
        borderColor: "divider",
        borderRadius: 1,
        backgroundColor: theme.palette.background.paper,
        opacity: disabled ? 0.5 : 1,
      }}
    >
      {/* Sayfa başına kayıt seçici */}
      {showPageSizeSelector && (
        <Stack direction="row" spacing={1} alignItems="center">
          <Typography variant="body2" color="text.secondary">
            {labelRowsPerPage}
          </Typography>
          <FormControl size="small" sx={{ minWidth: 70 }}>
            <Select
              value={pageSize}
              onChange={(e) => handlePageSizeChange(Number(e.target.value))}
              disabled={disabled || loading}
              variant="outlined"
              size="small"
            >
              {pageSizeOptions.map((option) => (
                <MenuItem key={option} value={option}>
                  {option}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Stack>
      )}

      {/* Bilgi görüntüleme */}
      <Typography variant="body2" color="text.secondary">
        {loading ? (
          <Stack direction="row" spacing={1} alignItems="center">
            <CircularProgress size={16} />
            <span>Yükleniyor...</span>
          </Stack>
        ) : (
          labelDisplayedRows({ from: startIndex, to: endIndex, count: total })
        )}
      </Typography>

      {/* Navigation controls */}
      <Stack direction="row" spacing={0.5}>
        {showFirstButton && (
          <IconButton
            onClick={() => handlePageChange(0)}
            disabled={!canGoPrev || disabled || loading}
            size={size}
            color={color}
            sx={{ borderRadius: 1 }}
          >
            <FirstPageIcon />
          </IconButton>
        )}

        <IconButton
          onClick={() => handlePageChange(page - 1)}
          disabled={!canGoPrev || disabled || loading}
          size={size}
          color={color}
          sx={{ borderRadius: 1 }}
        >
          <PrevIcon />
        </IconButton>

        <Box sx={{ px: 2, display: "flex", alignItems: "center" }}>
          <Typography variant="body2">
            Sayfa {page + 1} / {totalPages}
          </Typography>
        </Box>

        <IconButton
          onClick={() => handlePageChange(page + 1)}
          disabled={!canGoNext || disabled || loading}
          size={size}
          color={color}
          sx={{ borderRadius: 1 }}
        >
          <NextIcon />
        </IconButton>

        {showLastButton && (
          <IconButton
            onClick={() => handlePageChange(totalPages - 1)}
            disabled={!canGoNext || disabled || loading}
            size={size}
            color={color}
            sx={{ borderRadius: 1 }}
          >
            <LastPageIcon />
          </IconButton>
        )}
      </Stack>
    </Box>
  );
}
