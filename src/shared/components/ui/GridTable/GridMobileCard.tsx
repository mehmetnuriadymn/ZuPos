import {
  Card,
  CardContent,
  Typography,
  Box,
  Chip,
  IconButton,
  Stack,
  Divider,
  Collapse,
  useTheme,
} from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { useState } from "react";
import type { GridMobileCardProps, GridColumn } from "./types";

export default function GridMobileCard<T extends Record<string, unknown>>({
  row,
  columns,
  actions = [],
  onRowClick,
  expandable = false,
  titleField,
}: GridMobileCardProps<T>) {
  const theme = useTheme();
  const [expanded, setExpanded] = useState(false);

  // Başlık için kullanılacak field'i belirle
  const titleFieldName =
    titleField ||
    columns.find((col) => col.priority === 1)?.field ||
    columns[0]?.field;

  // Mobilde gösterilecek sütunları belirle
  const visibleColumns = expandable
    ? expanded
      ? columns.filter((col) => !col.hideOnMobile) // Açık durumda tüm alanları göster
      : columns.filter((col) => col.field === titleFieldName) // Kapalı durumda sadece başlığı göster
    : columns
        .filter((col) => !col.hideOnMobile)
        .sort((a, b) => (a.priority || 999) - (b.priority || 999))
        .slice(0, 4); // Normal durumda maksimum 4 alan göster

  const handleCardClick = () => {
    if (expandable) {
      setExpanded(!expanded);
    } else if (onRowClick) {
      onRowClick(row);
    }
  };

  const renderFieldValue = (column: GridColumn<T>, value: unknown) => {
    if (column.render) {
      return column.render(value, row, column);
    }

    // Eğer value bir boolean ise chip olarak göster
    if (typeof value === "boolean") {
      return (
        <Chip
          label={value ? "Aktif" : "Pasif"}
          color={value ? "success" : "error"}
          size="small"
          variant="outlined"
        />
      );
    }

    // Eğer value bir string ise direkt göster
    if (typeof value === "string" || typeof value === "number") {
      return (
        <Typography variant="body2" color="text.secondary">
          {String(value)}
        </Typography>
      );
    }

    return (
      <Typography variant="body2" color="text.secondary">
        -
      </Typography>
    );
  };

  return (
    <Card
      sx={{
        cursor: expandable || onRowClick ? "pointer" : "default",
        transition: "all 0.2s ease-in-out",
        "&:hover":
          expandable || onRowClick
            ? {
                transform: "translateY(-2px)",
                boxShadow: theme.shadows[4],
              }
            : {},
        mb: 2,
      }}
      onClick={handleCardClick}
    >
      <CardContent sx={{ pb: 1 }}>
        {/* Expandable Header */}
        {expandable && !expanded && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <Box sx={{ flexGrow: 1 }}>
              <Typography variant="subtitle1" fontWeight="600" color="primary">
                {String(row[titleFieldName as keyof T] || "-")}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                Detayları görmek için tıklayın
              </Typography>
            </Box>
            <IconButton
              size="small"
              sx={{
                transform: "rotate(0deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        )}

        {/* Expanded Header */}
        {expandable && expanded && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 2,
            }}
          >
            <Typography variant="subtitle1" fontWeight="600" color="primary">
              {String(row[titleFieldName as keyof T] || "-")}
            </Typography>
            <IconButton
              size="small"
              sx={{
                transform: "rotate(180deg)",
                transition: "transform 0.3s ease",
              }}
            >
              <ExpandMoreIcon />
            </IconButton>
          </Box>
        )}

        {/* Content - Expandable veya Normal */}
        <Collapse in={!expandable || expanded} timeout="auto">
          <Stack spacing={2}>
            {visibleColumns.map((column, index) => {
              const value = row[column.field as keyof T];
              const isTitle = index === 0; // İlk alan başlık olarak kullanılır

              return (
                <Box key={column.id}>
                  {isTitle ? (
                    <Box sx={{ mb: 1 }}>
                      <Typography
                        variant="subtitle1"
                        fontWeight="600"
                        color="primary"
                      >
                        {renderFieldValue(column, value)}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {column.label}
                      </Typography>
                    </Box>
                  ) : (
                    <Box
                      sx={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Typography variant="body2" color="text.secondary">
                        {column.label}:
                      </Typography>
                      <Box sx={{ textAlign: "right" }}>
                        {renderFieldValue(column, value)}
                      </Box>
                    </Box>
                  )}

                  {/* Son eleman değilse divider ekle */}
                  {!isTitle && index < visibleColumns.length - 1 && (
                    <Divider sx={{ mt: 1, opacity: 0.3 }} />
                  )}
                </Box>
              );
            })}

            {/* Actions */}
            {actions.length > 0 && (
              <>
                <Divider sx={{ my: 1 }} />
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                    gap: 1,
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
                        sx={{
                          borderRadius: 1,
                          "&:hover": {
                            backgroundColor: `${
                              theme.palette[action.color || "primary"].main
                            }15`,
                          },
                        }}
                      >
                        {action.icon}
                      </IconButton>
                    ))}
                </Box>
              </>
            )}
          </Stack>
        </Collapse>
      </CardContent>
    </Card>
  );
}
