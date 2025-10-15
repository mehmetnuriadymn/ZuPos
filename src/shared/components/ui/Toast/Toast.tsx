import React from "react";
import {
  Snackbar,
  Alert,
  AlertTitle,
  IconButton,
  Box,
  useTheme,
  Slide,
  type SlideProps,
} from "@mui/material";
import {
  CheckCircle as SuccessIcon,
  Error as ErrorIcon,
  Warning as WarningIcon,
  Info as InfoIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import type { ToastProps, ToastType } from "./types";

// Slide transition component for top-right position
function SlideTransition(props: SlideProps) {
  return <Slide {...props} direction="down" />;
}

/**
 * ZuPOS Toast Component
 *
 * Theme uyumlu toast bildirimleri. Success, error, warning, info türlerinde
 * bildirimler gösterebilir.
 */
export const Toast: React.FC<ToastProps> = ({
  open,
  onClose,
  type = "info",
  title,
  message,
  duration = 6000,
  showCloseButton = true,
  action,
  position = "top-right",
  transitionDuration = 300,
  icon,
}) => {
  const theme = useTheme();

  // Toast türüne göre icon belirleme
  const getDefaultIcon = (toastType: ToastType) => {
    const icons = {
      success: <SuccessIcon />,
      error: <ErrorIcon />,
      warning: <WarningIcon />,
      info: <InfoIcon />,
    };
    return icons[toastType];
  };

  // Position'dan Snackbar anchor'ını çıkar
  const getAnchorOrigin = (pos: string) => {
    const [vertical, horizontal] = pos.split("-");
    return {
      vertical: vertical as "top" | "bottom",
      horizontal:
        horizontal === "center"
          ? ("center" as const)
          : (horizontal as "left" | "right"),
    };
  };

  const anchorOrigin = getAnchorOrigin(position);

  // Auto hide duration (0 = manual close)
  const autoHideDuration = duration === 0 ? null : duration;

  return (
    <Snackbar
      open={open}
      autoHideDuration={autoHideDuration}
      onClose={(_event, reason) => {
        if (reason === "clickaway" && duration === 0) return; // Manual close only
        onClose();
      }}
      anchorOrigin={anchorOrigin}
      TransitionComponent={SlideTransition}
      TransitionProps={{
        timeout: transitionDuration,
      }}
      sx={{
        // Toast container positioning
        position: "fixed",
        zIndex: theme.zIndex.snackbar,
        pointerEvents: "none",
        "& .MuiSnackbar-root": {
          pointerEvents: "auto",
        },
      }}
    >
      <Alert
        onClose={showCloseButton ? onClose : undefined}
        severity={type}
        icon={icon || getDefaultIcon(type)}
        variant="filled"
        action={
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            {/* Custom Action Button */}
            {action && (
              <Box
                component="button"
                onClick={action.onClick}
                sx={{
                  background: "transparent",
                  border: "none",
                  color: "inherit",
                  cursor: "pointer",
                  textDecoration: "underline",
                  fontSize: "0.875rem",
                  fontWeight: 500,
                  padding: 0,
                  "&:hover": {
                    opacity: 0.8,
                  },
                }}
              >
                {action.label}
              </Box>
            )}

            {/* Close Button */}
            {showCloseButton && (
              <IconButton
                size="small"
                aria-label="close"
                color="inherit"
                onClick={onClose}
                sx={{
                  p: 0.5,
                  "&:hover": {
                    backgroundColor: "rgba(255, 255, 255, 0.1)",
                  },
                }}
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </Box>
        }
        sx={{
          minWidth: 350,
          maxWidth: 500,
          borderRadius: 3,
          backdropFilter: "blur(20px)",
          border: "1px solid",
          boxShadow:
            theme.palette.mode === "dark"
              ? "0 25px 50px -12px rgba(0, 0, 0, 0.8), 0 0 0 1px rgba(255, 255, 255, 0.05)"
              : "0 25px 50px -12px rgba(0, 0, 0, 0.25), 0 0 0 1px rgba(255, 255, 255, 0.3)",

          // Enhanced theme-aware colors with gradients
          "&.MuiAlert-filledSuccess": {
            background: `linear-gradient(135deg, ${theme.palette.success.main}, ${theme.palette.success.dark})`,
            borderColor: theme.palette.success.light,
            color: theme.palette.success.contrastText,
            "& .MuiAlert-icon": {
              color: theme.palette.success.contrastText,
            },
          },
          "&.MuiAlert-filledError": {
            background: `linear-gradient(135deg, ${theme.palette.error.main}, ${theme.palette.error.dark})`,
            borderColor: theme.palette.error.light,
            color: theme.palette.error.contrastText,
            "& .MuiAlert-icon": {
              color: theme.palette.error.contrastText,
            },
          },
          "&.MuiAlert-filledWarning": {
            background: `linear-gradient(135deg, ${theme.palette.warning.main}, ${theme.palette.warning.dark})`,
            borderColor: theme.palette.warning.light,
            color: theme.palette.warning.contrastText,
            "& .MuiAlert-icon": {
              color: theme.palette.warning.contrastText,
            },
          },
          "&.MuiAlert-filledInfo": {
            background: `linear-gradient(135deg, ${theme.palette.info.main}, ${theme.palette.info.dark})`,
            borderColor: theme.palette.info.light,
            color: theme.palette.info.contrastText,
            "& .MuiAlert-icon": {
              color: theme.palette.info.contrastText,
            },
          },

          // Enhanced message styling
          "& .MuiAlert-message": {
            padding: "4px 0",
            width: "100%",
            display: "flex",
            flexDirection: "column",
            gap: 0.5,
          },

          // Icon styling
          "& .MuiAlert-icon": {
            fontSize: "1.5rem",
            marginRight: 2,
            opacity: 0.9,
          },

          // Action area styling
          "& .MuiAlert-action": {
            paddingTop: 0,
            alignItems: "flex-start",
            marginRight: 0,
          },

          // Animation
          transform: "translateX(0)",
          transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
          "&:hover": {
            transform: "translateX(-4px)",
            boxShadow:
              theme.palette.mode === "dark"
                ? "0 32px 64px -12px rgba(0, 0, 0, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.1)"
                : "0 32px 64px -12px rgba(0, 0, 0, 0.35), 0 0 0 1px rgba(255, 255, 255, 0.4)",
          },
        }}
      >
        {title && (
          <AlertTitle
            sx={{
              fontWeight: 700,
              fontSize: "1rem",
              mb: title && message ? 0.5 : 0,
              letterSpacing: "-0.025em",
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 1px 2px rgba(0, 0, 0, 0.5)"
                  : "none",
            }}
          >
            {title}
          </AlertTitle>
        )}

        {message && (
          <Box
            sx={{
              fontSize: "0.9rem",
              lineHeight: 1.6,
              opacity: 0.95,
              fontWeight: 500,
              textShadow:
                theme.palette.mode === "dark"
                  ? "0 1px 2px rgba(0, 0, 0, 0.3)"
                  : "none",
            }}
          >
            {message}
          </Box>
        )}
      </Alert>
    </Snackbar>
  );
};

export default Toast;
