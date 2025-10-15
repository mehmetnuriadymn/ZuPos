import {
  Drawer as MuiDrawer,
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
  LinearProgress,
  useTheme,
  useMediaQuery,
  alpha,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { forwardRef } from "react";
import type { CustomDrawerProps, DrawerSize } from "./types";
import { DRAWER_SIZES } from "./types";

const CustomDrawer = forwardRef<HTMLDivElement, CustomDrawerProps>(
  (
    {
      open,
      onClose,
      title,
      subtitle,
      children,
      size = "medium",
      anchor = "right",
      headerActions,
      footerActions,
      showCloseButton = true,
      backdrop = true,
      persistent = false,
      disableEscapeKeyDown = false,
      maxWidth,
      fullHeight = false,
      onBackdropClick,
      onEscapeKeyDown,
      loading = false,
      "aria-label": ariaLabel,
      "aria-labelledby": ariaLabelledby,
      "aria-describedby": ariaDescribedby,
    },
    ref
  ) => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

    // Drawer boyutunu hesapla
    const getDrawerWidth = (drawerSize: DrawerSize): number => {
      if (isMobile) {
        return Math.min(DRAWER_SIZES[drawerSize], window.innerWidth - 32);
      }
      return maxWidth
        ? typeof maxWidth === "number"
          ? maxWidth
          : parseInt(maxWidth)
        : DRAWER_SIZES[drawerSize];
    };

    const drawerWidth = getDrawerWidth(size);

    // Event handlers
    const handleClose = (reason?: "backdropClick" | "escapeKeyDown") => {
      if (persistent && reason === "backdropClick") return;
      if (disableEscapeKeyDown && reason === "escapeKeyDown") return;

      if (reason === "backdropClick" && onBackdropClick) {
        onBackdropClick();
      } else if (reason === "escapeKeyDown" && onEscapeKeyDown) {
        onEscapeKeyDown();
      } else {
        onClose();
      }
    };

    // Drawer boyut ayarları - üstte boşluk bırakarak
    const paperProps = {
      sx: {
        width: isMobile ? "100vw" : drawerWidth,
        height: fullHeight || isMobile ? "100vh" : "calc(100vh - 64px)", // Desktop'ta üstte 64px boşluk
        maxHeight: "100vh",
        marginTop: fullHeight || isMobile ? 0 : "64px", // Üst boşluk
        display: "flex",
        flexDirection: "column" as const,
        borderTopLeftRadius: isMobile ? 0 : 16,
        borderBottomLeftRadius: isMobile ? 0 : 16,
        borderTopRightRadius: 0,
        borderBottomRightRadius: 0,
      },
    };

    return (
      <MuiDrawer
        ref={ref}
        anchor={anchor}
        open={open}
        onClose={(_, reason) => handleClose(reason)}
        SlideProps={{
          direction:
            anchor === "left"
              ? "right"
              : anchor === "right"
              ? "left"
              : anchor === "top"
              ? "down"
              : "up",
          timeout: { enter: 350, exit: 300 },
        }}
        ModalProps={{
          keepMounted: false,
          disablePortal: false,
          hideBackdrop: !backdrop,
        }}
        PaperProps={paperProps}
        aria-label={ariaLabel}
        aria-labelledby={ariaLabelledby}
        aria-describedby={ariaDescribedby}
      >
        {/* Loading Progress Bar */}
        {loading && (
          <Box
            sx={{
              position: "absolute",
              top: 0,
              left: 0,
              right: 0,
              zIndex: 10,
              height: 3,
            }}
          >
            <LinearProgress
              color="primary"
              sx={{
                height: 3,
                borderRadius: theme.shape.borderRadius,
              }}
            />
          </Box>
        )}

        {/* Header */}
        {(title || subtitle || headerActions || showCloseButton) && (
          <Box
            sx={{
              display: "flex",
              alignItems: "flex-start",
              justifyContent: "space-between",
              p: 3,
              pb: 2,
              minHeight: 80,
              flexShrink: 0,
              backgroundColor: alpha(theme.palette.primary.main, 0.02),
              borderBottom: `1px solid ${theme.palette.divider}`,
              ...theme.applyStyles("dark", {
                backgroundColor: alpha(theme.palette.primary.main, 0.05),
              }),
            }}
          >
            <Box sx={{ flex: 1, pr: 2 }}>
              {title && (
                <Typography
                  variant="h5"
                  component="h2"
                  color="text.primary"
                  sx={{
                    fontWeight: 600,
                    lineHeight: 1.3,
                    mb: subtitle ? 0.5 : 0,
                  }}
                  id={ariaLabelledby}
                >
                  {title}
                </Typography>
              )}
              {subtitle && (
                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{
                    lineHeight: 1.4,
                  }}
                  id={ariaDescribedby}
                >
                  {subtitle}
                </Typography>
              )}
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                gap: 1,
                flexShrink: 0,
              }}
            >
              {headerActions}
              {showCloseButton && (
                <IconButton
                  onClick={() => handleClose()}
                  size="large"
                  sx={{
                    color: theme.palette.text.secondary,
                    backgroundColor: alpha(theme.palette.action.hover, 0.5),
                    border: `1px solid ${alpha(theme.palette.divider, 0.5)}`,
                    borderRadius: theme.shape.borderRadius,
                    "&:hover": {
                      backgroundColor: theme.palette.action.hover,
                      color: theme.palette.text.primary,
                      borderColor: theme.palette.divider,
                    },
                  }}
                  aria-label="Close drawer"
                >
                  <CloseIcon />
                </IconButton>
              )}
            </Box>
          </Box>
        )}

        {/* Content */}
        <Box
          sx={{
            flex: 1,
            overflow: "auto",
            p: 3,
            pt: title || subtitle ? 2 : 3,
            display: "flex",
            flexDirection: "column",
            gap: 2,
          }}
        >
          <Fade in={open && !loading} timeout={400}>
            <Box sx={{ flex: 1 }}>{children}</Box>
          </Fade>
        </Box>

        {/* Footer */}
        {footerActions && (
          <>
            <Divider />
            <Box
              sx={{
                p: 3,
                pt: 2,
                flexShrink: 0,
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                gap: 2,
                backgroundColor: alpha(theme.palette.background.default, 0.8),
                backdropFilter: "blur(8px)",
                borderTop: `1px solid ${theme.palette.divider}`,
              }}
            >
              {footerActions}
            </Box>
          </>
        )}
      </MuiDrawer>
    );
  }
);

CustomDrawer.displayName = "CustomDrawer";

export default CustomDrawer;
