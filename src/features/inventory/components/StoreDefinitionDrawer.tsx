import { useState, useEffect } from "react";
import {
  Box,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Switch,
  FormControlLabel,
  Typography,
  Chip,
  Stack,
} from "@mui/material";
import { FormDrawer } from "../../../shared/components/ui";
import type { FormDrawerProps } from "../../../shared/components/ui";

// StoreDefinitionRow type'ını import edelim
interface StoreDefinitionRow {
  id: number;
  name: string;
  code: string;
  transferType: string;
  status: boolean;
}

interface StoreDefinitionDrawerProps extends Omit<FormDrawerProps, "children"> {
  store?: StoreDefinitionRow | null; // Düzenleme modunda gelen veri
  mode: "create" | "edit"; // Oluşturma veya düzenleme modu
  onSave: (data: Omit<StoreDefinitionRow, "id">) => Promise<void>;
}

export default function StoreDefinitionDrawer({
  store = null,
  mode = "create",
  onSave,
  open,
  onClose,
  ...drawerProps
}: StoreDefinitionDrawerProps) {
  // Form state
  const [formData, setFormData] = useState({
    name: "",
    code: "",
    transferType: "Sayim",
    status: true,
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store data'sını form'a yükle (edit mode)
  useEffect(() => {
    if (store && mode === "edit") {
      setFormData({
        name: store.name,
        code: store.code,
        transferType: store.transferType,
        status: store.status,
      });
    } else if (mode === "create") {
      // Yeni oluştururken temiz form
      setFormData({
        name: "",
        code: "",
        transferType: "Sayim",
        status: true,
      });
    }
    setErrors({});
  }, [store, mode, open]);

  // Form validation
  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Depo adı zorunludur";
    } else if (formData.name.length < 2) {
      newErrors.name = "Depo adı en az 2 karakter olmalıdır";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Depo kodu zorunludur";
    } else if (!/^\d+$/.test(formData.code)) {
      newErrors.code = "Depo kodu sadece sayı olmalıdır";
    }

    if (!formData.transferType) {
      newErrors.transferType = "Devir tipi seçilmelidir";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean
  ) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors((prev) => ({
        ...prev,
        [field]: "",
      }));
    }
  };

  // Form submit
  const handleSubmit = async () => {
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onSave(formData);
      onClose();
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      // Hata handling burada yapılabilir
    } finally {
      setIsSubmitting(false);
    }
  };

  // Form reset
  const handleReset = () => {
    if (mode === "edit" && store) {
      setFormData({
        name: store.name,
        code: store.code,
        transferType: store.transferType,
        status: store.status,
      });
    } else {
      setFormData({
        name: "",
        code: "",
        transferType: "Sayim",
        status: true,
      });
    }
    setErrors({});
  };

  // Form dirty check
  const isDirty = () => {
    if (mode === "create") {
      return (
        formData.name !== "" ||
        formData.code !== "" ||
        formData.transferType !== "Sayim" ||
        formData.status !== true
      );
    } else if (store) {
      return (
        formData.name !== store.name ||
        formData.code !== store.code ||
        formData.transferType !== store.transferType ||
        formData.status !== store.status
      );
    }
    return false;
  };

  const hasErrors = Object.values(errors).some((error) => error !== "");

  return (
    <FormDrawer
      {...drawerProps}
      open={open}
      onClose={onClose}
      title={mode === "create" ? "Yeni Depo Ekle" : "Depo Düzenle"}
      subtitle={
        mode === "create"
          ? "Yeni depo tanımı oluşturun"
          : `"${store?.name}" deposunu düzenleyin`
      }
      size="medium"
      onSubmit={handleSubmit}
      onReset={handleReset}
      isDirty={isDirty()}
      isSubmitting={isSubmitting}
      hasErrors={hasErrors}
      submitLabel={mode === "create" ? "Oluştur" : "Güncelle"}
    >
      <Stack spacing={3}>
        {/* Depo Adı */}
        <TextField
          label="Depo Adı"
          fullWidth
          required
          size="medium"
          value={formData.name}
          onChange={(e) => handleInputChange("name", e.target.value)}
          error={!!errors.name}
          helperText={errors.name}
          placeholder="Depo adı girin"
        />

        {/* Depo Kodu */}
        <TextField
          label="Depo Kodu"
          fullWidth
          required
          size="medium"
          value={formData.code}
          onChange={(e) => handleInputChange("code", e.target.value)}
          error={!!errors.code}
          helperText={errors.code}
          placeholder="Sadece sayı"
          inputProps={{
            pattern: "[0-9]*",
            inputMode: "numeric",
          }}
        />

        {/* Devir Tipi */}
        <FormControl fullWidth required error={!!errors.transferType}>
          <InputLabel>Devir Tipi</InputLabel>
          <Select
            value={formData.transferType}
            onChange={(e) => handleInputChange("transferType", e.target.value)}
            label="Devir Tipi"
            size="medium"
          >
            <MenuItem value="Sayim">
              <Chip label="Sayim" color="info" size="small" sx={{ mr: 1 }} />
              Sayım İşlemleri
            </MenuItem>
            <MenuItem value="Devir">
              <Chip label="Devir" color="warning" size="small" sx={{ mr: 1 }} />
              Devir İşlemleri
            </MenuItem>
            <MenuItem value="Transfer">
              <Chip
                label="Transfer"
                color="success"
                size="small"
                sx={{ mr: 1 }}
              />
              Transfer İşlemleri
            </MenuItem>
          </Select>
        </FormControl>

        {/* Durum */}
        <FormControlLabel
          control={
            <Switch
              checked={formData.status}
              onChange={(e) => handleInputChange("status", e.target.checked)}
              color="primary"
            />
          }
          label={
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography>Durum</Typography>
              <Chip
                label={formData.status ? "Aktif" : "Pasif"}
                color={formData.status ? "success" : "error"}
                size="small"
              />
            </Box>
          }
        />
      </Stack>
    </FormDrawer>
  );
}
