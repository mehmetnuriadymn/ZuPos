import { Box, Stack } from "@mui/material";
import { useState } from "react";
import { Button } from "../Button";
import { ConfirmationDialog } from "../Dialog";
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

      {/* Unsaved Changes Warning Dialog */}
      <ConfirmationDialog
        open={showWarning}
        onClose={handleCancelClose}
        onConfirm={handleConfirmClose}
        type="warning"
        title="Kaydedilmemiş Değişiklikler"
        message="Kaydedilmemiş değişiklikleriniz var. Çıkmak istediğinizden emin misiniz? Bu işlem geri alınamaz."
        confirmLabel="Çık"
        cancelLabel="Vazgeç"
        confirmColor="error"
        size="medium"
        showIcon={true}
      />
    </>
  );
}
