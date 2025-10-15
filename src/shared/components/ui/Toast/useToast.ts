import { useContext } from "react";
import type { ToastContextType } from "./types";
import { ToastContext } from "./ToastContext";

/**
 * ZuPOS Toast Hook
 *
 * Toast operasyonlarını component'lerde kullanmak için hook.
 *
 * @example
 * ```tsx
 * const toast = useToast();
 *
 * // Basit kullanım
 * toast.success("İşlem başarılı!");
 * toast.error("Bir hata oluştu!");
 *
 * // Gelişmiş kullanım
 * toast.showToast({
 *   type: "warning",
 *   title: "Uyarı",
 *   message: "Bu işlem geri alınamaz!",
 *   duration: 0, // Manuel kapatma
 *   action: {
 *     label: "Geri Al",
 *     onClick: () => console.log("Undo clicked")
 *   }
 * });
 * ```
 */
export const useToast = (): ToastContextType => {
  const context = useContext(ToastContext);

  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }

  return context;
};
