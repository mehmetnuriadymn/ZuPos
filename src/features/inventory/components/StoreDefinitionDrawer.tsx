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
import type {
  StoreDefinitionRow,
  StoreFormData,
  StockParameter,
} from "../types/inventory.types";

interface StoreDefinitionDrawerProps extends Omit<FormDrawerProps, "children"> {
  store?: StoreDefinitionRow | null; // Düzenleme modunda gelen veri
  mode: "create" | "edit"; // Oluşturma veya düzenleme modu
  stockParameters: StockParameter[]; // API'den gelen StockParameter listesi (TypeID=2)
  onSave: (data: StoreFormData) => Promise<void>;
}

export default function StoreDefinitionDrawer({
  store = null,
  mode = "create",
  stockParameters,
  onSave,
  open,
  onClose,
  ...drawerProps
}: StoreDefinitionDrawerProps) {
  // Form state - SQL schema'ya uygun
  const [formData, setFormData] = useState<StoreFormData>({
    name: "", // SQL: nvarchar(150)
    code: "", // SQL: nchar(10) - Alfanumerik
    storePeriodClosureType: 0, // SQL: int - StockParameterID
    address: "", // SQL: nvarchar(max)
    gsm: "", // SQL: nchar(11)
    status: true, // SQL: bit
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Store data'sını form'a yükle (edit mode)
  useEffect(() => {
    if (store && mode === "edit") {
      setFormData({
        name: store.name,
        code: store.code,
        storePeriodClosureType: store.transferTypeId, // Gerçek StockParameter ID
        address: store.address || "",
        gsm: store.gsm || "",
        status: store.status,
      });
    } else if (mode === "create") {
      // Yeni oluştururken temiz form
      // İlk StockParameter'ı default olarak seç (varsa)
      const defaultStockParamId =
        stockParameters.length > 0 ? stockParameters[0].stockParameterId : 0;

      setFormData({
        name: "",
        code: "",
        storePeriodClosureType: defaultStockParamId, // SQL: int
        address: "",
        gsm: "",
        status: true,
      });
    }
    setErrors({});
  }, [store, mode, open, stockParameters]);

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
    } else if (formData.code.length > 10) {
      newErrors.code =
        "Depo kodu maksimum 10 karakter olabilir (SQL: nchar(10))";
    }

    if (!formData.storePeriodClosureType) {
      newErrors.storePeriodClosureType = "Devir tipi seçilmelidir";
    }

    // GSM opsiyonel ama girilmişse format ve uzunluk kontrolü
    if (formData.gsm) {
      // Sadece rakam kontrol et
      const cleanGsm = formData.gsm.replace(/[\s\-+()]/g, "");
      if (!/^[0-9]*$/.test(cleanGsm)) {
        newErrors.gsm = "Telefon sadece rakam içermelidir";
      } else if (cleanGsm.length > 11) {
        newErrors.gsm = "Telefon maksimum 11 rakam olabilir (SQL: nchar(11))";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Input change handler
  const handleInputChange = (
    field: keyof typeof formData,
    value: string | boolean | number
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
        storePeriodClosureType: store.transferTypeId,
        address: store.address || "",
        gsm: store.gsm || "",
        status: store.status,
      });
    } else {
      const defaultStockParamId =
        stockParameters.length > 0 ? stockParameters[0].stockParameterId : 0;

      setFormData({
        name: "",
        code: "",
        storePeriodClosureType: defaultStockParamId, // SQL: int
        address: "",
        gsm: "",
        status: true,
      });
    }
    setErrors({});
  };

  // Form dirty check
  const isDirty = () => {
    if (mode === "create") {
      const defaultStockParamId =
        stockParameters.length > 0 ? stockParameters[0].stockParameterId : 0;

      return (
        formData.name !== "" ||
        formData.code !== "" ||
        formData.storePeriodClosureType !== defaultStockParamId ||
        formData.address !== "" ||
        formData.gsm !== "" ||
        formData.status !== true
      );
    } else if (store) {
      return (
        formData.name !== store.name ||
        formData.code !== store.code ||
        formData.storePeriodClosureType !== store.transferTypeId ||
        formData.address !== (store.address || "") ||
        formData.gsm !== (store.gsm || "") ||
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
          helperText={
            errors.code || "Alfanumerik, max 10 karakter (SQL: nchar(10))"
          }
          placeholder="Örn: ABC123, DEF456"
          inputProps={{
            maxLength: 10,
          }}
        />

        {/* Devir Tipi - StockParameter Selection (TypeID=2) */}
        <FormControl fullWidth required error={!!errors.storePeriodClosureType}>
          <InputLabel>Devir Tipi (Stok Parametre)</InputLabel>
          <Select
            value={formData.storePeriodClosureType}
            onChange={(e) =>
              handleInputChange("storePeriodClosureType", e.target.value)
            }
            label="Devir Tipi (Stok Parametre)"
            size="medium"
            disabled={stockParameters.length === 0}
          >
            {stockParameters.length === 0 ? (
              <MenuItem value={0} disabled>
                <Typography color="text.secondary">Yükleniyor...</Typography>
              </MenuItem>
            ) : (
              stockParameters.map((param) => (
                <MenuItem
                  key={param.stockParameterId}
                  value={param.stockParameterId}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Chip
                      label={param.code}
                      color="info"
                      size="small"
                      variant="outlined"
                    />
                    <Typography>{param.name}</Typography>
                  </Box>
                </MenuItem>
              ))
            )}
          </Select>
          {errors.storePeriodClosureType && (
            <Typography variant="caption" color="error" sx={{ mt: 0.5, ml: 2 }}>
              {errors.storePeriodClosureType}
            </Typography>
          )}
        </FormControl>

        {/* Adres */}
        <TextField
          label="Adres"
          fullWidth
          multiline
          rows={2}
          size="medium"
          value={formData.address}
          onChange={(e) => handleInputChange("address", e.target.value)}
          error={!!errors.address}
          helperText={errors.address}
          placeholder="Depo adresi (opsiyonel)"
        />

        {/* GSM */}
        <TextField
          label="Telefon (GSM)"
          fullWidth
          size="medium"
          value={formData.gsm}
          onChange={(e) => handleInputChange("gsm", e.target.value)}
          error={!!errors.gsm}
          helperText={
            errors.gsm || "Örn: 05551234567, max 11 rakam (SQL: nchar(11))"
          }
          placeholder="05551234567"
          inputProps={{
            inputMode: "tel",
            maxLength: 11,
          }}
        />

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
