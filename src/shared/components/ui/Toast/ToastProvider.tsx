import React, { useState, useCallback } from "react";
import { Toast } from "./Toast";
import { ToastContext } from "./ToastContext";
import type {
  ToastMessage,
  ToastContextType,
  ToastContainerProps,
} from "./types";

/**
 * ZuPOS Toast Provider
 *
 * Toast sistemini uygulamada kullanabilmek için provider component'i.
 * Tüm toast işlemleri bu context üzerinden yönetilir.
 */
export const ToastProvider: React.FC<
  ToastContainerProps & { children: React.ReactNode }
> = ({
  children,
  position = "top-right",
  maxToasts = 5,
  defaultDuration = 6000,
  zIndex = 1400,
}) => {
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  // Toast ID generator
  const generateId = useCallback(() => {
    return `toast_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }, []);

  // Toast göster
  const showToast = useCallback(
    (toast: Omit<ToastMessage, "id">): string => {
      const id = generateId();
      const newToast: ToastMessage = {
        id,
        duration: defaultDuration,
        showCloseButton: true,
        ...toast,
      };

      setToasts((prev) => {
        // Maksimum toast sayısını kontrol et
        const updatedToasts = [...prev, newToast];
        if (updatedToasts.length > maxToasts) {
          // En eskiyi çıkar
          return updatedToasts.slice(-maxToasts);
        }
        return updatedToasts;
      });

      // Auto-dismiss
      if (newToast.duration && newToast.duration > 0) {
        setTimeout(() => {
          setToasts((prev) => prev.filter((toast) => toast.id !== id));
        }, newToast.duration);
      }

      return id;
    },
    [generateId, defaultDuration, maxToasts]
  );

  // Toast kapat
  const dismissToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  // Tüm toast'ları temizle
  const clearAll = useCallback(() => {
    setToasts([]);
  }, []);

  // Shorthand methods
  const success = useCallback(
    (message: string, options?: Partial<ToastMessage>) => {
      return showToast({ type: "success", message, ...options });
    },
    [showToast]
  );

  const error = useCallback(
    (message: string, options?: Partial<ToastMessage>) => {
      return showToast({ type: "error", message, ...options });
    },
    [showToast]
  );

  const warning = useCallback(
    (message: string, options?: Partial<ToastMessage>) => {
      return showToast({ type: "warning", message, ...options });
    },
    [showToast]
  );

  const info = useCallback(
    (message: string, options?: Partial<ToastMessage>) => {
      return showToast({ type: "info", message, ...options });
    },
    [showToast]
  );

  const contextValue: ToastContextType = {
    showToast,
    success,
    error,
    warning,
    info,
    dismissToast,
    clearAll,
    toasts,
  };

  return (
    <ToastContext.Provider value={contextValue}>
      {children}

      {/* Toast Renderer */}
      <div
        style={{
          position: "fixed",
          top: position.includes("top") ? "20px" : "auto",
          bottom: position.includes("bottom") ? "20px" : "auto",
          left: position.includes("left") ? "20px" : "auto",
          right: position.includes("right") ? "20px" : "auto",
          zIndex,
          pointerEvents: "none",
          display: "flex",
          flexDirection: position.includes("top") ? "column" : "column-reverse",
          gap: "12px",
          maxWidth: "420px",
        }}
      >
        {toasts.map((toast) => (
          <Toast
            key={toast.id}
            open={true}
            onClose={() => dismissToast(toast.id)}
            type={toast.type}
            title={toast.title}
            message={toast.message}
            duration={toast.duration}
            showCloseButton={toast.showCloseButton}
            action={toast.action}
            position={position}
          />
        ))}
      </div>
    </ToastContext.Provider>
  );
};

// Export default provider
export default ToastProvider;
