// ZuPOS Toast/Snackbar Component Types
// Toast bildirimleri için type tanımlamaları

export type ToastType = "success" | "error" | "warning" | "info";
export type ToastPosition =
  | "top-left"
  | "top-center"
  | "top-right"
  | "bottom-left"
  | "bottom-center"
  | "bottom-right";

export interface ToastMessage {
  id: string;
  type: ToastType;
  title?: string;
  message: string;
  duration?: number; // ms, 0 = manual close
  showCloseButton?: boolean;
  action?: {
    label: string;
    onClick: () => void;
  };
}

export interface ToastProps extends Omit<ToastMessage, "id"> {
  /** Toast açık/kapalı durumu */
  open: boolean;

  /** Toast kapandığında çalışacak fonksiyon */
  onClose: () => void;

  /** Toast pozisyonu */
  position?: ToastPosition;

  /** Animasyon süresi */
  transitionDuration?: number;

  /** Custom icon */
  icon?: React.ReactNode;
}

export interface ToastContainerProps {
  /** Toast pozisyonu */
  position?: ToastPosition;

  /** Maksimum toast sayısı */
  maxToasts?: number;

  /** Default auto-hide süresi */
  defaultDuration?: number;

  /** Container z-index */
  zIndex?: number;
}

export interface UseToastReturn {
  /** Toast göster */
  showToast: (toast: Omit<ToastMessage, "id">) => string;

  /** Success toast */
  success: (message: string, options?: Partial<ToastMessage>) => string;

  /** Error toast */
  error: (message: string, options?: Partial<ToastMessage>) => string;

  /** Warning toast */
  warning: (message: string, options?: Partial<ToastMessage>) => string;

  /** Info toast */
  info: (message: string, options?: Partial<ToastMessage>) => string;

  /** Toast kapat */
  dismissToast: (id: string) => void;

  /** Tüm toast'ları temizle */
  clearAll: () => void;

  /** Aktif toast'lar */
  toasts: ToastMessage[];
}

// Hook Context Type
export type ToastContextType = UseToastReturn;
