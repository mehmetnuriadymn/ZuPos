import type { ReactNode } from "react";

// Drawer boyutları
export type DrawerSize = "small" | "medium" | "large" | "xlarge";

// Drawer pozisyonu
export type DrawerAnchor = "left" | "right" | "top" | "bottom";

// Drawer Component Props
export interface CustomDrawerProps {
  // Temel props
  open: boolean;
  onClose: () => void;

  // İçerik
  title?: string;
  subtitle?: string;
  children: ReactNode;

  // Boyut ve pozisyon
  size?: DrawerSize;
  anchor?: DrawerAnchor;

  // Header ve Footer
  headerActions?: ReactNode;
  footerActions?: ReactNode;
  showCloseButton?: boolean;

  // Davranış
  backdrop?: boolean;
  persistent?: boolean; // Backdrop'a tıklayınca kapanmasın
  disableEscapeKeyDown?: boolean;

  // Styling
  maxWidth?: number | string;
  fullHeight?: boolean;

  // Events
  onBackdropClick?: () => void;
  onEscapeKeyDown?: () => void;

  // Loading state
  loading?: boolean;

  // Accessibility
  "aria-label"?: string;
  "aria-labelledby"?: string;
  "aria-describedby"?: string;
}

// Drawer boyut haritası
export const DRAWER_SIZES = {
  small: 320,
  medium: 480,
  large: 640,
  xlarge: 800,
} as const;

// Form Drawer Props (form'lu drawer'lar için)
export interface FormDrawerProps
  extends Omit<CustomDrawerProps, "footerActions"> {
  // Form davranışı
  onSubmit?: () => void | Promise<void>;
  onReset?: () => void;
  submitLabel?: string;
  resetLabel?: string;
  cancelLabel?: string;

  // Form durumu
  isDirty?: boolean;
  isSubmitting?: boolean;
  hasErrors?: boolean;

  // Validation
  showUnsavedWarning?: boolean;
}
