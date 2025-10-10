import React from "react";
import MuiButton from "@mui/material/Button";
import CircularProgress from "@mui/material/CircularProgress";
import type { ButtonProps as MuiButtonProps } from "@mui/material/Button";

// Kendi Button tipimizi tanımlayalım
export interface ButtonProps extends Omit<MuiButtonProps, "variant"> {
  /** Button çeşidi - proje spesifik */
  variant?: "primary" | "secondary" | "outline" | "ghost";
  /** Loading durumu */
  loading?: boolean;
  /** Button boyutu */
  size?: "small" | "medium" | "large";
  /** Full width */
  fullWidth?: boolean;
  /** Icon (sol tarafta) */
  startIcon?: React.ReactNode;
  /** Icon (sağ tarafta) */
  endIcon?: React.ReactNode;
}

/**
 * ZuPOS Button Component
 *
 * Proje genelinde kullanılan standart button component'i.
 * Material-UI Button'ın üzerine kurulu ama kendi design system'imiz var.
 */
export const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  loading = false,
  disabled,
  children,
  startIcon,
  endIcon,
  ...props
}) => {
  // Variant'ları Material-UI formatına çevir
  const getMuiVariant = (variant: ButtonProps["variant"]) => {
    switch (variant) {
      case "primary":
        return "contained";
      case "secondary":
        return "contained";
      case "outline":
        return "outlined";
      case "ghost":
        return "text";
      default:
        return "contained";
    }
  };

  // Color'ları belirle
  const getMuiColor = (variant: ButtonProps["variant"]) => {
    switch (variant) {
      case "primary":
        return "primary";
      case "secondary":
        return "secondary";
      case "outline":
        return "primary";
      case "ghost":
        return "primary";
      default:
        return "primary";
    }
  };

  return (
    <MuiButton
      variant={getMuiVariant(variant)}
      color={getMuiColor(variant)}
      disabled={disabled || loading}
      startIcon={
        loading ? <CircularProgress size={20} color="inherit" /> : startIcon
      }
      endIcon={!loading ? endIcon : undefined}
      {...props}
    >
      {children}
    </MuiButton>
  );
};

export default Button;
