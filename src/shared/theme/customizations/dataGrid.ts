import type { Theme } from "@mui/material/styles";
import type { DataGridComponents } from "@mui/x-data-grid/themeAugmentation";

export const dataGridCustomizations: DataGridComponents<Theme> = {
  MuiDataGrid: {
    styleOverrides: {
      root: ({ theme }) => ({
        border: `1px solid ${(theme.vars || theme).palette.divider}`,
        borderRadius: (theme.vars || theme).shape.borderRadius,
        "& .MuiDataGrid-columnHeaders": {
          backgroundColor: (theme.vars || theme).palette.grey[50],
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
          ...theme.applyStyles("dark", {
            backgroundColor: (theme.vars || theme).palette.grey[900],
          }),
        },
        "& .MuiDataGrid-cell": {
          borderBottom: `1px solid ${(theme.vars || theme).palette.divider}`,
        },
        "& .MuiDataGrid-row": {
          "&:hover": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(144, 202, 249, 0.08)"
                : "rgba(25, 118, 210, 0.04)",
          },
          "&.Mui-selected": {
            backgroundColor:
              theme.palette.mode === "dark"
                ? "rgba(144, 202, 249, 0.16)"
                : "rgba(25, 118, 210, 0.08)",
            "&:hover": {
              backgroundColor:
                theme.palette.mode === "dark"
                  ? "rgba(144, 202, 249, 0.24)"
                  : "rgba(25, 118, 210, 0.12)",
            },
          },
        },
      }),
    },
  },
};
