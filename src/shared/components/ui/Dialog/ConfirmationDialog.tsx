import React from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Typography,
  Box,
  useTheme,
} from "@mui/material";
import {
  Warning as WarningIcon,
  Error as ErrorIcon,
  Info as InfoIcon,
  CheckCircle as SuccessIcon,
  HelpOutline as QuestionIcon,
} from "@mui/icons-material";
import { Button } from "../Button";
import type { ConfirmationDialogProps, DialogType } from "./types";

/**
 * ZuPOS Confirmation Dialog Component
 *
 * Theme uyumlu onay dialog'u. Farklı türlerde (warning, error, success vs)
 * confirmation mesajları gösterebilir.
 */
export const ConfirmationDialog: React.FC<ConfirmationDialogProps> = ({
  open,
  onClose,
  onConfirm,
  type = "question",
  title,
  message,
  confirmLabel = "Onayla",
  cancelLabel = "İptal",
  loading = false,
  confirmColor,
  size = "medium",
  showIcon = true,
  icon,
  disableBackdropClick = false,
  disableEscapeKeyDown = false,
}) => {
  const theme = useTheme();

  // Dialog türüne göre renk ve icon belirleme
  const getTypeConfig = (dialogType: DialogType) => {
    const configs = {
      info: {
        color: theme.palette.info.main,
        backgroundColor: theme.palette.info.main + "10",
        borderColor: theme.palette.info.main + "30",
        icon: <InfoIcon />,
        confirmColor: "primary" as const,
      },
      warning: {
        color: theme.palette.warning.main,
        backgroundColor: theme.palette.warning.main + "10",
        borderColor: theme.palette.warning.main + "30",
        icon: <WarningIcon />,
        confirmColor: "secondary" as const,
      },
      error: {
        color: theme.palette.error.main,
        backgroundColor: theme.palette.error.main + "10",
        borderColor: theme.palette.error.main + "30",
        icon: <ErrorIcon />,
        confirmColor: "secondary" as const,
      },
      success: {
        color: theme.palette.success.main,
        backgroundColor: theme.palette.success.main + "10",
        borderColor: theme.palette.success.main + "30",
        icon: <SuccessIcon />,
        confirmColor: "primary" as const,
      },
      question: {
        color: theme.palette.primary.main,
        backgroundColor: theme.palette.primary.main + "10",
        borderColor: theme.palette.primary.main + "30",
        icon: <QuestionIcon />,
        confirmColor: "primary" as const,
      },
    };
    return configs[dialogType];
  };

  const typeConfig = getTypeConfig(type);
  const finalConfirmColor = confirmColor || typeConfig.confirmColor;

  const handleConfirm = async () => {
    try {
      await onConfirm();
    } catch (error) {
      console.error("Confirmation action failed:", error);
    }
  };

  const handleClose = (
    _event: object,
    reason?: "backdropClick" | "escapeKeyDown"
  ) => {
    if (loading) return; // Loading sırasında kapatma
    if (disableBackdropClick && reason === "backdropClick") return;
    if (disableEscapeKeyDown && reason === "escapeKeyDown") return;
    onClose();
  };

  // Dialog boyutu
  const getMaxWidth = () => {
    if (size === "small") return "sm";
    if (size === "large") return "md";
    return "sm"; // medium default
  };

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      maxWidth={getMaxWidth()}
      fullWidth
      disableEscapeKeyDown={disableEscapeKeyDown}
      PaperProps={{
        sx: {
          borderRadius: 3,
          minWidth: size === "small" ? 350 : size === "large" ? 500 : 400,
          boxShadow:
            theme.palette.mode === "dark"
              ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
              : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
        },
      }}
    >
      {/* Header */}
      <DialogTitle
        sx={{
          display: "flex",
          alignItems: "center",
          gap: 2,
          fontWeight: 600,
          fontSize: "1.25rem",
          color: "text.primary",
          pb: 2,
        }}
      >
        {showIcon && (
          <Box
            sx={{
              color: typeConfig.color,
              display: "flex",
              alignItems: "center",
            }}
          >
            {icon || typeConfig.icon}
          </Box>
        )}
        {title}
      </DialogTitle>

      {/* Content */}
      <DialogContent sx={{ pb: 3 }}>
        <Box
          sx={{
            p: 2.5,
            backgroundColor: typeConfig.backgroundColor,
            borderRadius: 2,
            border: 1,
            borderColor: typeConfig.borderColor,
            ...theme.applyStyles("dark", {
              backgroundColor: typeConfig.color + "20",
              borderColor: typeConfig.color + "40",
            }),
          }}
        >
          <Typography
            sx={{
              lineHeight: 1.6,
              color: "text.primary",
            }}
          >
            {message}
          </Typography>
        </Box>
      </DialogContent>

      {/* Actions */}
      <DialogActions
        sx={{
          p: 3,
          pt: 0,
          gap: 2,
          justifyContent: "flex-end",
        }}
      >
        <Button
          variant="outline"
          onClick={onClose}
          disabled={loading}
          size="large"
          sx={{
            borderRadius: 2,
            fontWeight: 500,
            minWidth: 100,
          }}
        >
          {cancelLabel}
        </Button>

        <Button
          variant={finalConfirmColor === "primary" ? "primary" : "secondary"}
          onClick={handleConfirm}
          loading={loading}
          size="large"
          sx={{
            borderRadius: 2,
            fontWeight: 600,
            minWidth: 120,
            textTransform: "none",
            ...(type === "error" && {
              backgroundColor: "error.main",
              color: "error.contrastText",
              "&:hover": {
                backgroundColor: "error.dark",
              },
            }),
            ...(type === "warning" && {
              backgroundColor: "warning.main",
              color: "warning.contrastText",
              "&:hover": {
                backgroundColor: "warning.dark",
              },
            }),
            boxShadow: `0 4px 12px ${typeConfig.color}40`,
            "&:hover": {
              boxShadow: `0 6px 16px ${typeConfig.color}60`,
              transform: "translateY(-1px)",
            },
            "&:disabled": {
              transform: "none",
              boxShadow: "none",
            },
            transition: "all 200ms ease-in-out",
          }}
        >
          {confirmLabel}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default ConfirmationDialog;
