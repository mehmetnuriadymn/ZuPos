import { useState, useEffect } from "react";
import {
  Box,
  Typography,
  Button,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Chip,
  Stack,
  Alert,
} from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import PageContainer from "../../../shared/layout/PageContainer";
import type { Store } from "../types/inventory.types";

// Mock data - Gerçek API integration için
const mockStores: Store[] = [
  {
    storeId: 1,
    storeCode: "STORE001",
    storeName: "Ana Depo",
    storeType: "MAIN",
    branchId: 253,
    isActive: true,
    address: "Merkez Mahallesi, İstanbul",
    phone: "+90 212 555 0001",
    email: "ana.depo@zupos.com",
    createdDate: "2024-01-15T10:30:00Z",
  },
  {
    storeId: 2,
    storeCode: "STORE002",
    storeName: "Şube Deposu 1",
    storeType: "BRANCH",
    branchId: 253,
    isActive: true,
    address: "Kadıköy, İstanbul",
    phone: "+90 212 555 0002",
    createdDate: "2024-02-10T14:15:00Z",
  },
  {
    storeId: 3,
    storeCode: "STORE003",
    storeName: "Sanal Depo",
    storeType: "VIRTUAL",
    branchId: 253,
    isActive: false,
    address: "Online Platform",
    createdDate: "2024-03-05T09:45:00Z",
  },
];

export default function StoreDefinition() {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      setStores(mockStores);
      setLoading(false);
    }, 1000);
  }, []);

  const handleAddStore = () => {
    // TODO: Modal açılacak veya form sayfasına yönlendirilecek
    alert("Yeni Depo Ekleme - Henüz implement edilmedi");
  };

  const handleEditStore = (store: Store) => {
    // TODO: Edit modal açılacak
    alert(`Depo Düzenle: ${store.storeName}`);
  };

  const handleDeleteStore = (store: Store) => {
    if (
      confirm(
        `"${store.storeName}" deposunu silmek istediğinizden emin misiniz?`
      )
    ) {
      setStores((prev) => prev.filter((s) => s.storeId !== store.storeId));
    }
  };

  const getStoreTypeLabel = (type: Store["storeType"]) => {
    const typeLabels = {
      MAIN: "Ana Depo",
      BRANCH: "Şube Deposu",
      VIRTUAL: "Sanal Depo",
    };
    return typeLabels[type];
  };

  const getStoreTypeColor = (type: Store["storeType"]) => {
    const colors = {
      MAIN: "primary" as const,
      BRANCH: "secondary" as const,
      VIRTUAL: "info" as const,
    };
    return colors[type];
  };

  if (loading) {
    return (
      <PageContainer title="Depo Tanımlama">
        <Typography>Yükleniyor...</Typography>
      </PageContainer>
    );
  }

  return (
    <PageContainer title="Depo Tanımlama">
      <Stack spacing={3}>
        {/* Header Actions */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <StoreIcon color="primary" />
            <Typography variant="h6" color="text.secondary">
              Toplam {stores.length} depo kayıtlı
            </Typography>
          </Box>

          <Button
            variant="contained"
            startIcon={<AddIcon />}
            onClick={handleAddStore}
            size="large"
          >
            Yeni Depo Ekle
          </Button>
        </Box>

        {/* Info Alert */}
        <Alert severity="info" sx={{ mb: 2 }}>
          Bu sayfa henüz geliştirme aşamasındadır. Şu anda mock veriler
          görüntülenmektedir.
        </Alert>

        {/* Stores Table */}
        <TableContainer component={Paper} elevation={2}>
          <Table sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow sx={{ backgroundColor: "grey.50" }}>
                <TableCell>
                  <strong>Depo Kodu</strong>
                </TableCell>
                <TableCell>
                  <strong>Depo Adı</strong>
                </TableCell>
                <TableCell>
                  <strong>Tip</strong>
                </TableCell>
                <TableCell>
                  <strong>Durum</strong>
                </TableCell>
                <TableCell>
                  <strong>Adres</strong>
                </TableCell>
                <TableCell>
                  <strong>Telefon</strong>
                </TableCell>
                <TableCell>
                  <strong>Oluşturma Tarihi</strong>
                </TableCell>
                <TableCell align="center">
                  <strong>İşlemler</strong>
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {stores.map((store) => (
                <TableRow
                  key={store.storeId}
                  hover
                  sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
                >
                  <TableCell>
                    <Typography variant="body2" fontWeight="600">
                      {store.storeCode}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2">{store.storeName}</Typography>
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={getStoreTypeLabel(store.storeType)}
                      color={getStoreTypeColor(store.storeType)}
                      size="small"
                      variant="outlined"
                    />
                  </TableCell>
                  <TableCell>
                    <Chip
                      label={store.isActive ? "Aktif" : "Pasif"}
                      color={store.isActive ? "success" : "error"}
                      size="small"
                    />
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {store.address || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {store.phone || "-"}
                    </Typography>
                  </TableCell>
                  <TableCell>
                    <Typography variant="body2" color="text.secondary">
                      {new Date(store.createdDate).toLocaleDateString("tr-TR")}
                    </Typography>
                  </TableCell>
                  <TableCell align="center">
                    <Box
                      sx={{ display: "flex", gap: 1, justifyContent: "center" }}
                    >
                      <IconButton
                        size="small"
                        onClick={() => handleEditStore(store)}
                        color="primary"
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
                      <IconButton
                        size="small"
                        onClick={() => handleDeleteStore(store)}
                        color="error"
                      >
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Box>
                  </TableCell>
                </TableRow>
              ))}

              {stores.length === 0 && (
                <TableRow>
                  <TableCell colSpan={8} align="center">
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ py: 4 }}
                    >
                      Henüz hiç depo kaydı bulunmuyor. Yeni depo eklemek için
                      yukarıdaki butonu kullanın.
                    </Typography>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Stack>
    </PageContainer>
  );
}
