import React from "react";
import MuiTextField from "@mui/material/TextField";
import FormControl from "@mui/material/FormControl";
import FormLabel from "@mui/material/FormLabel";
import type { TextFieldProps as MuiTextFieldProps } from "@mui/material/TextField";

// Kendi Input tipimizi tanımlayalım
export interface InputProps extends Omit<MuiTextFieldProps, "variant"> {
  /** Input etiketi */
  label?: string;
  /** Hata durumu */
  error?: boolean;
  /** Hata mesajı */
  errorMessage?: string;
  /** Input tipi */
  type?: "text" | "password" | "email" | "number" | "tel";
  /** Placeholder */
  placeholder?: string;
  /** Required field */
  required?: boolean;
  /** Full width */
  fullWidth?: boolean;
  /** Auto focus */
  autoFocus?: boolean;
}

/**
 * ZuPOS Input Component
 *
 * Proje genelinde kullanılan standart input component'i.
 * Material-UI TextField'ın üzerine kurulu ama kendi design system'imiz var.
 */
export const Input: React.FC<InputProps> = ({
  label,
  error = false,
  errorMessage,
  required = false,
  fullWidth = true,
  ...props
}) => {
  return (
    <FormControl fullWidth={fullWidth}>
      {label && (
        <FormLabel htmlFor={props.id} required={required}>
          {label}
        </FormLabel>
      )}
      <MuiTextField
        error={error}
        helperText={errorMessage}
        required={required}
        fullWidth={fullWidth}
        variant="outlined"
        color={error ? "error" : "primary"}
        {...props}
      />
    </FormControl>
  );
};

export default Input;
