import React from "react";
import MuiCard from "@mui/material/Card";
import { styled } from "@mui/material/styles";
import type { CardProps as MuiCardProps } from "@mui/material/Card";

// Kendi Card tipimizi tanımlayalım
export interface CardProps extends MuiCardProps {
  /** Card boyutu */
  size?: "small" | "medium" | "large";
  /** Card içeriği merkeze hizalansın mı? */
  centered?: boolean;
  /** Maksimum genişlik */
  maxWidth?: number;
}

// Size için padding ve gap değerleri
const getSizeStyles = (size: "small" | "medium" | "large") => {
  switch (size) {
    case "small":
      return { padding: 2, gap: 1 };
    case "large":
      return { padding: 6, gap: 3 };
    default:
      return { padding: 4, gap: 2 };
  }
};

// Styled Card - Design system'imize uygun
const StyledCard = styled(MuiCard, {
  shouldForwardProp: (prop) =>
    prop !== "centered" && prop !== "maxWidth" && prop !== "size",
})<{
  centered?: boolean;
  maxWidth?: number;
  size?: "small" | "medium" | "large";
}>(({ theme, centered, maxWidth, size = "medium" }) => {
  const sizeStyles = getSizeStyles(size);

  return {
    display: "flex",
    flexDirection: "column",
    alignSelf: centered ? "center" : "flex-start",
    width: "100%",
    maxWidth: maxWidth ? `${maxWidth}px` : undefined,
    padding: theme.spacing(sizeStyles.padding),
    gap: theme.spacing(sizeStyles.gap),
    boxShadow:
      "hsla(220, 30%, 5%, 0.05) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.05) 0px 15px 35px -5px",
    [theme.breakpoints.up("sm")]: {
      width: maxWidth ? `${maxWidth}px` : "450px",
    },
    ...theme.applyStyles("dark", {
      boxShadow:
        "hsla(220, 30%, 5%, 0.5) 0px 5px 15px 0px, hsla(220, 25%, 10%, 0.08) 0px 15px 35px -5px",
    }),
  };
});

/**
 * ZuPOS Card Component
 *
 * Proje genelinde kullanılan standart card component'i.
 * Material-UI Card'ın üzerine kurulu ama kendi design system'imiz var.
 */
export const Card: React.FC<CardProps> = ({
  size = "medium",
  centered = true,
  maxWidth = 450,
  children,
  ...props
}) => {
  return (
    <StyledCard
      variant="outlined"
      centered={centered}
      maxWidth={maxWidth}
      size={size}
      {...props}
    >
      {children}
    </StyledCard>
  );
};

export default Card;
