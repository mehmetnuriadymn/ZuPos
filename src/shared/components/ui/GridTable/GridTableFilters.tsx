import {
  Box,
  TextField,
  IconButton,
  Chip,
  Stack,
  Collapse,
  Paper,
  Typography,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
} from "@mui/material";
import {
  FilterList as FilterIcon,
  Clear as ClearIcon,
  Add as AddIcon,
} from "@mui/icons-material";
import { useState } from "react";
import type { GridFilterProps, GridFilter } from "./types";

export default function GridTableFilters({
  columns,
  filters,
  onFilterChange,
}: GridFilterProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [quickSearchValue, setQuickSearchValue] = useState("");

  const filterableColumns = columns.filter((col) => col.filterable !== false);

  const handleQuickSearch = (value: string) => {
    setQuickSearchValue(value);

    if (!value.trim()) {
      // Quick search temizlenince tüm text tabanlı filtreleri temizle
      const nonTextFilters = filters.filter(
        (f) => !filterableColumns.some((col) => col.field === f.field)
      );
      onFilterChange(nonTextFilters);
      return;
    }

    // Tüm metin alanlarında arama yap
    const textColumns = filterableColumns.filter(
      (col) => typeof col.field === "string"
    );

    const newFilters = filters.filter(
      (f) => !textColumns.some((col) => col.field === f.field)
    );

    // Her text sütunu için contains filtresi ekle
    textColumns.forEach((col) => {
      newFilters.push({
        field: col.field,
        operator: "contains",
        value: value.trim(),
      });
    });

    onFilterChange(newFilters);
  };

  const addFilter = () => {
    if (filterableColumns.length === 0) return;

    const newFilter: GridFilter = {
      field: filterableColumns[0].field,
      operator: "contains",
      value: "",
    };

    onFilterChange([...filters, newFilter]);
  };

  const updateFilter = (index: number, updatedFilter: GridFilter) => {
    const newFilters = [...filters];
    newFilters[index] = updatedFilter;
    onFilterChange(newFilters);
  };

  const removeFilter = (index: number) => {
    const newFilters = filters.filter((_, i) => i !== index);
    onFilterChange(newFilters);
  };

  const clearAllFilters = () => {
    onFilterChange([]);
    setQuickSearchValue("");
  };

  const hasActiveFilters = filters.length > 0 || quickSearchValue.trim() !== "";

  return (
    <Box sx={{ mb: 2 }}>
      {/* Quick Search ve Filter Toggle */}
      <Stack direction="row" spacing={2} alignItems="center" sx={{ mb: 2 }}>
        <TextField
          placeholder="Ara..."
          value={quickSearchValue}
          onChange={(e) => handleQuickSearch(e.target.value)}
          size="small"
          sx={{ minWidth: 250, flexGrow: 1 }}
        />

        <IconButton
          onClick={() => setShowFilters(!showFilters)}
          color={showFilters || hasActiveFilters ? "primary" : "default"}
          sx={{
            border: 1,
            borderColor:
              showFilters || hasActiveFilters ? "primary.main" : "divider",
          }}
        >
          <FilterIcon />
        </IconButton>

        {hasActiveFilters && (
          <IconButton
            onClick={clearAllFilters}
            color="error"
            size="small"
            title="Tüm filtreleri temizle"
          >
            <ClearIcon />
          </IconButton>
        )}
      </Stack>

      {/* Active Filters Display */}
      {hasActiveFilters && (
        <Stack direction="row" spacing={1} sx={{ mb: 2, flexWrap: "wrap" }}>
          {quickSearchValue && (
            <Chip
              label={`Arama: "${quickSearchValue}"`}
              onDelete={() => handleQuickSearch("")}
              color="primary"
              variant="outlined"
              size="small"
            />
          )}
          {filters.map((filter, index) => {
            const column = filterableColumns.find(
              (col) => col.field === filter.field
            );
            return (
              <Chip
                key={index}
                label={`${column?.label}: ${filter.value}`}
                onDelete={() => removeFilter(index)}
                color="secondary"
                variant="outlined"
                size="small"
              />
            );
          })}
        </Stack>
      )}

      {/* Advanced Filters Panel */}
      <Collapse in={showFilters}>
        <Paper sx={{ p: 2, mt: 2 }} variant="outlined">
          <Stack spacing={2}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="subtitle2" color="text.secondary">
                Gelişmiş Filtreler
              </Typography>
              <Button
                startIcon={<AddIcon />}
                onClick={addFilter}
                size="small"
                disabled={filterableColumns.length === 0}
              >
                Filtre Ekle
              </Button>
            </Box>

            {filters.map((filter, index) => {
              return (
                <Stack
                  key={index}
                  direction="row"
                  spacing={2}
                  alignItems="center"
                >
                  <FormControl size="small" sx={{ minWidth: 150 }}>
                    <InputLabel>Alan</InputLabel>
                    <Select
                      value={filter.field}
                      label="Alan"
                      onChange={(e) =>
                        updateFilter(index, {
                          ...filter,
                          field: e.target.value,
                        })
                      }
                    >
                      {filterableColumns.map((col) => (
                        <MenuItem key={col.field} value={col.field}>
                          {col.label}
                        </MenuItem>
                      ))}
                    </Select>
                  </FormControl>

                  <FormControl size="small" sx={{ minWidth: 120 }}>
                    <InputLabel>Operatör</InputLabel>
                    <Select
                      value={filter.operator}
                      label="Operatör"
                      onChange={(e) =>
                        updateFilter(index, {
                          ...filter,
                          operator: e.target.value as GridFilter["operator"],
                        })
                      }
                    >
                      <MenuItem value="contains">İçerir</MenuItem>
                      <MenuItem value="equals">Eşittir</MenuItem>
                      <MenuItem value="startsWith">İle Başlar</MenuItem>
                      <MenuItem value="endsWith">İle Biter</MenuItem>
                      <MenuItem value="isEmpty">Boş</MenuItem>
                      <MenuItem value="isNotEmpty">Boş Değil</MenuItem>
                    </Select>
                  </FormControl>

                  {filter.operator !== "isEmpty" &&
                    filter.operator !== "isNotEmpty" && (
                      <TextField
                        size="small"
                        placeholder="Değer"
                        value={filter.value || ""}
                        onChange={(e) =>
                          updateFilter(index, {
                            ...filter,
                            value: e.target.value,
                          })
                        }
                        sx={{ flexGrow: 1 }}
                      />
                    )}

                  <IconButton
                    onClick={() => removeFilter(index)}
                    color="error"
                    size="small"
                  >
                    <ClearIcon />
                  </IconButton>
                </Stack>
              );
            })}

            {filters.length === 0 && (
              <Typography
                variant="body2"
                color="text.secondary"
                textAlign="center"
                sx={{ py: 2 }}
              >
                Henüz filtre eklenmemiş. Yukarıdaki "Filtre Ekle" butonunu
                kullanın.
              </Typography>
            )}
          </Stack>
        </Paper>
      </Collapse>
    </Box>
  );
}
