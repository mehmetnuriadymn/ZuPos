import {
  Box,
  Stack,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { useState } from "react";
import { Button } from "../Button";
import CustomDrawer from "./CustomDrawer";
import type { FormDrawerProps } from "./types";

export default function FormDrawer({
  children,
  onSubmit,
  onReset,
  submitLabel = "Kaydet",
  resetLabel = "Sıfırla",
  cancelLabel = "İptal",
  isDirty = false,
  isSubmitting = false,
  hasErrors = false,
  showUnsavedWarning = true,
  onClose,
  ...drawerProps
}: FormDrawerProps) {
  const [showWarning, setShowWarning] = useState(false);

  const handleClose = () => {
    if (isDirty && showUnsavedWarning) {
      setShowWarning(true);
    } else {
      onClose();
    }
  };

  const handleConfirmClose = () => {
    setShowWarning(false);
    onClose();
  };

  const handleCancelClose = () => {
    setShowWarning(false);
  };

  const handleSubmit = async () => {
    if (onSubmit) {
      await onSubmit();
    }
  };

  const handleReset = () => {
    if (onReset) {
      onReset();
    }
  };

  // Footer actions - Theme uyumlu
  const footerActions = (
    <Stack direction="row" spacing={2} sx={{ width: "100%" }}>
      {/* Reset Button */}
      <Button
        variant="outline"
        onClick={onReset ? handleReset : undefined}
        disabled={isSubmitting || !isDirty}
        size="large"
        sx={{
          display: onReset ? "inline-flex" : "none",
          borderRadius: 2,
          fontWeight: 500,
          minWidth: 100,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        }}
      >
        {resetLabel}
      </Button>

      <Box sx={{ flex: 1 }} />

      {/* Cancel Button */}
      <Button
        variant="outline"
        onClick={handleClose}
        disabled={isSubmitting}
        size="large"
        sx={{
          borderRadius: 2,
          fontWeight: 500,
          minWidth: 100,
          borderWidth: 2,
          "&:hover": {
            borderWidth: 2,
          },
        }}
      >
        {cancelLabel}
      </Button>

      {/* Submit Button */}
      <Button
        variant="primary"
        onClick={handleSubmit}
        disabled={isSubmitting || hasErrors}
        loading={isSubmitting}
        size="large"
        sx={{
          borderRadius: 2,
          fontWeight: 600,
          minWidth: 120,
          textTransform: "none",
          boxShadow: (theme) => `0 4px 12px ${theme.palette.primary.main}40`,
          "&:hover": {
            boxShadow: (theme) => `0 6px 16px ${theme.palette.primary.main}60`,
            transform: "translateY(-1px)",
          },
          "&:disabled": {
            transform: "none",
            boxShadow: "none",
          },
          transition: "all 200ms ease-in-out",
        }}
      >
        {submitLabel}
      </Button>
    </Stack>
  );

  return (
    <>
      <CustomDrawer
        {...drawerProps}
        onClose={handleClose}
        footerActions={footerActions}
        loading={isSubmitting}
      >
        {children}
      </CustomDrawer>

      {/* Unsaved Changes Warning Dialog - Theme uyumlu */}
      <Dialog
        open={showWarning}
        onClose={handleCancelClose}
        aria-labelledby="unsaved-warning-title"
        maxWidth="sm"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: (theme) =>
              theme.palette.mode === "dark"
                ? "hsla(220, 30%, 5%, 0.7) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.8) 0px 8px 16px -5px"
                : "hsla(220, 30%, 5%, 0.07) 0px 4px 16px 0px, hsla(220, 25%, 10%, 0.07) 0px 8px 16px -5px",
          },
        }}
      >
        <DialogTitle
          id="unsaved-warning-title"
          sx={{
            fontWeight: 600,
            fontSize: "1.25rem",
            color: "error.main",
            pb: 2,
          }}
        >
          ⚠️ Kaydedilmemiş Değişiklikler
        </DialogTitle>
        <DialogContent
          sx={{
            pb: 3,
          }}
        >
          <Box
            sx={{
              p: 2,
              backgroundColor: "error.50",
              borderRadius: 2,
              border: 1,
              borderColor: "error.200",
              ...(theme) =>
                theme.applyStyles("dark", {
                  backgroundColor: "error.900",
                  borderColor: "error.700",
                }),
            }}
          >
            Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinizden emin
            misiniz? Bu işlem geri alınamaz.
          </Box>
        </DialogContent>
        <DialogActions
          sx={{
            p: 3,
            pt: 0,
            gap: 2,
          }}
        >
          <Button
            onClick={handleCancelClose}
            variant="outline"
            size="large"
            sx={{
              borderRadius: 2,
              fontWeight: 500,
              minWidth: 100,
              borderWidth: 2,
              "&:hover": {
                borderWidth: 2,
              },
            }}
          >
            Vazgeç
          </Button>
          <Button
            onClick={handleConfirmClose}
            variant="secondary"
            size="large"
            sx={{
              borderRadius: 2,
              fontWeight: 600,
              minWidth: 100,
              textTransform: "none",
              backgroundColor: "error.main",
              color: "error.contrastText",
              boxShadow: (theme) => `0 4px 12px ${theme.palette.error.main}40`,
              "&:hover": {
                backgroundColor: "error.dark",
                boxShadow: (theme) =>
                  `0 6px 16px ${theme.palette.error.main}60`,
                transform: "translateY(-1px)",
              },
              transition: "all 200ms ease-in-out",
            }}
          >
            Çık
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
}
