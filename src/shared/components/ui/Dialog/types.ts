// ZuPOS Dialog Component Types
// Confirmation Dialog ve diğer dialog bileşenleri için type tanımlamaları

export type DialogType = "info" | "warning" | "error" | "success" | "question";

export interface ConfirmationDialogProps {
  /** Dialog açık/kapalı durumu */
  open: boolean;

  /** Dialog kapatılması */
  onClose: () => void;

  /** Onay butonuna tıklandığında çalışacak fonksiyon */
  onConfirm: () => void | Promise<void>;

  /** Dialog türü - tema renklerini belirler */
  type?: DialogType;

  /** Dialog başlığı */
  title: string;

  /** Dialog mesajı */
  message: string;

  /** Onay butonu metni */
  confirmLabel?: string;

  /** İptal butonu metni */
  cancelLabel?: string;

  /** Loading durumu */
  loading?: boolean;

  /** Onay butonunun rengini belirle */
  confirmColor?:
    | "primary"
    | "secondary"
    | "error"
    | "warning"
    | "info"
    | "success";

  /** Dialog boyutu */
  size?: "small" | "medium" | "large";

  /** Icon gösterilsin mi */
  showIcon?: boolean;

  /** Custom icon */
  icon?: React.ReactNode;

  /** Backdrop'a tıklayınca kapansın mı */
  disableBackdropClick?: boolean;

  /** Escape tuşu ile kapansın mı */
  disableEscapeKeyDown?: boolean;
}

export interface BaseDialogProps {
  /** Dialog açık/kapalı durumu */
  open: boolean;

  /** Dialog kapatılması */
  onClose: () => void;

  /** Dialog başlığı */
  title?: string;

  /** Dialog içeriği */
  children: React.ReactNode;

  /** Dialog boyutu */
  size?: "small" | "medium" | "large" | "fullScreen";

  /** Dialog pozisyonu */
  position?: "center" | "top" | "bottom";

  /** Backdrop'a tıklayınca kapansın mı */
  disableBackdropClick?: boolean;

  /** Escape tuşu ile kapansın mı */
  disableEscapeKeyDown?: boolean;

  /** Footer actions */
  actions?: React.ReactNode;

  /** Divider göster */
  showDivider?: boolean;

  /** Scroll type */
  scroll?: "paper" | "body";
}

// Dialog boyutları
export const DIALOG_SIZES = {
  small: 400,
  medium: 600,
  large: 900,
} as const;

export type DialogSize = keyof typeof DIALOG_SIZES;
