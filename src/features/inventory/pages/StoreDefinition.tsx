import { useState, useEffect } from "react";
import { Typography, Button, Chip, Stack } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
} from "@mui/icons-material";
import PageContainer from "../../../shared/layout/PageContainer";
import {
  GridTable,
  usePagination,
  ConfirmationDialog,
  useToast,
  type GridColumn,
  type GridAction,
  type GridFilter,
} from "../../../shared/components/ui";
import { StoreDefinitionDrawer } from "../components";

// Store Definition Interface - şu anda depo tablosu için kullanılıyor
interface StoreDefinitionRow extends Record<string, unknown> {
  id: number;
  name: string;
  code: string;
  transferType: string;
  status: boolean;
}

// Mock data - İstenen formatta test verileri
const mockStoreData: StoreDefinitionRow[] = [
  {
    id: 1,
    name: "Belediye",
    code: "9",
    transferType: "Sayim",
    status: true,
  },
  {
    id: 2,
    name: "Şehit Mehmetcik",
    code: "8",
    transferType: "Sayim",
    status: true,
  },
  {
    id: 3,
    name: "Günlüklük",
    code: "7",
    transferType: "Sayim",
    status: false,
  },
  {
    id: 4,
    name: "Merkez Depo",
    code: "10",
    transferType: "Devir",
    status: true,
  },
  {
    id: 5,
    name: "Şube 1 Deposu",
    code: "11",
    transferType: "Transfer",
    status: true,
  },
  {
    id: 6,
    name: "Şube 2 Deposu",
    code: "12",
    transferType: "Transfer",
    status: false,
  },
  {
    id: 7,
    name: "Geçici Depo",
    code: "13",
    transferType: "Sayim",
    status: true,
  },
  {
    id: 8,
    name: "Yedek Depo",
    code: "14",
    transferType: "Devir",
    status: false,
  },
  {
    id: 9,
    name: "Ana Depo A",
    code: "15",
    transferType: "Transfer",
    status: true,
  },
  {
    id: 10,
    name: "Ana Depo B",
    code: "16",
    transferType: "Devir",
    status: true,
  },
  {
    id: 11,
    name: "Bölge Deposu 1",
    code: "17",
    transferType: "Sayim",
    status: false,
  },
];

export default function StoreDefinition() {
  const toast = useToast();
  const [stores, setStores] = useState<StoreDefinitionRow[]>([]);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<GridFilter[]>([]);

  // Drawer states
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [drawerMode, setDrawerMode] = useState<"create" | "edit">("create");
  const [selectedStore, setSelectedStore] = useState<StoreDefinitionRow | null>(
    null
  );

  // Confirmation dialog states
  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    store: null as StoreDefinitionRow | null,
  });

  // Pagination hook kullanımı
  const { pagination, handlePageChange, handlePageSizeChange } = usePagination({
    total: stores.length,
    initialPage: 0,
    initialPageSize: 10,
    pageSizeOptions: [5, 10, 25, 50],
  });

  useEffect(() => {
    // Mock data loading
    setLoading(true);
    setTimeout(() => {
      setStores(mockStoreData);
      setLoading(false);
    }, 1000);
  }, []);

  // Grid kolonları tanımlaması
  const columns: GridColumn<StoreDefinitionRow>[] = [
    {
      id: "name",
      label: "Adı",
      field: "name",
      sortable: true,
      filterable: true,
      minWidth: 200,
      priority: 1, // Mobilde göster
      render: (value) => (
        <Typography variant="body2" fontWeight="600" color="primary">
          {String(value)}
        </Typography>
      ),
    },
    {
      id: "code",
      label: "Kodu",
      field: "code",
      sortable: true,
      filterable: true,
      align: "center",
      width: 100,
      priority: 2,
      render: (value) => (
        <Chip
          label={String(value)}
          variant="outlined"
          color="secondary"
          size="small"
        />
      ),
    },
    {
      id: "transferType",
      label: "Devir Tipi",
      field: "transferType",
      sortable: true,
      filterable: true,
      align: "center",
      width: 120,
      priority: 3,
      render: (value) => (
        <Chip
          label={String(value)}
          color="info"
          variant="outlined"
          size="small"
        />
      ),
    },
    {
      id: "status",
      label: "Durum",
      field: "status",
      sortable: true,
      filterable: false,
      align: "center",
      width: 100,
      priority: 4,
      render: (value) => (
        <Chip
          label={value ? "Aktif" : "Aktif Değil"}
          color={value ? "success" : "error"}
          size="small"
          variant="filled"
        />
      ),
    },
  ];

  // Drawer handlers
  const handleAddNew = () => {
    setDrawerMode("create");
    setSelectedStore(null);
    setDrawerOpen(true);
  };

  const handleEdit = (row: StoreDefinitionRow) => {
    setDrawerMode("edit");
    setSelectedStore(row);
    setDrawerOpen(true);
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setSelectedStore(null);
  };

  const handleSave = async (data: Omit<StoreDefinitionRow, "id">) => {
    try {
      if (drawerMode === "create") {
        // Yeni kayıt ekleme
        const newId =
          stores.length > 0 ? Math.max(...stores.map((s) => s.id)) + 1 : 1;
        const newStore = {
          id: newId,
          ...data,
        } as StoreDefinitionRow;
        setStores((prev) => [...prev, newStore]);
        toast.success(`"${data.name}" deposu başarıyla oluşturuldu!`);
      } else if (drawerMode === "edit" && selectedStore) {
        // Mevcut kaydı güncelleme
        setStores((prev) =>
          prev.map((s) => (s.id === selectedStore.id ? { ...s, ...data } : s))
        );
        toast.success(`"${data.name}" deposu başarıyla güncellendi!`);
      }
    } catch (error) {
      console.error("Kaydetme hatası:", error);
      toast.error("Kaydetme işleminde bir hata oluştu!");
      throw error; // Drawer'da hata gösterilsin
    }
  };

  // Delete handlers
  const handleDeleteClick = (row: StoreDefinitionRow) => {
    setDeleteDialog({
      open: true,
      store: row,
    });
  };

  const handleDeleteConfirm = () => {
    if (deleteDialog.store) {
      setStores((prev) => prev.filter((s) => s.id !== deleteDialog.store!.id));
      toast.success(`"${deleteDialog.store.name}" deposu başarıyla silindi!`);
      setDeleteDialog({ open: false, store: null });
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, store: null });
  };

  // Grid actions tanımlaması
  const actions: GridAction<StoreDefinitionRow>[] = [
    {
      id: "edit",
      label: "Güncelle",
      icon: <EditIcon />,
      color: "primary",
      onClick: handleEdit,
    },
    {
      id: "delete",
      label: "Sil",
      icon: <DeleteIcon />,
      color: "error",
      onClick: handleDeleteClick,
    },
  ];

  const handleFilterChange = (newFilters: GridFilter[]) => {
    setFilters(newFilters);
  };

  return (
    <PageContainer title="Depo Tanımlama">
      <Stack spacing={3}>
        {/* Grid Table */}
        <GridTable<StoreDefinitionRow>
          columns={columns}
          rows={stores}
          keyField="id"
          title="Depo Listesi"
          subtitle={`Toplam ${stores.length} depo kaydı bulunmaktadır`}
          headerActions={
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              onClick={handleAddNew}
              size="large"
            >
              Yeni Depo Ekle
            </Button>
          }
          loading={loading}
          actions={actions}
          filtering={filters}
          onFilterChange={handleFilterChange}
          // Pagination
          pagination={pagination}
          onPageChange={handlePageChange}
          onPageSizeChange={handlePageSizeChange}
          // Mobile Settings
          showMobileCards={true}
          mobileCardExpansion={true}
          mobileCardTitle="name"
          // Table Settings
          hover={true}
          stickyHeader={false}
          empty={{
            message: "Henüz depo tanımı bulunamadı",
            description:
              "Yeni depo eklemek için yukarıdaki butonu kullanabilirsiniz.",
            icon: <StoreIcon sx={{ fontSize: 64, color: "text.secondary" }} />,
          }}
          onRowClick={(row) => {
            console.log("Satır tıklandı:", row);
          }}
        />

        {/* Store Definition Drawer */}
        <StoreDefinitionDrawer
          open={drawerOpen}
          onClose={handleDrawerClose}
          mode={drawerMode}
          store={selectedStore}
          onSave={handleSave}
        />

        {/* Delete Confirmation Dialog */}
        <ConfirmationDialog
          open={deleteDialog.open}
          onClose={handleDeleteCancel}
          onConfirm={handleDeleteConfirm}
          type="error"
          title="Depo Silme Onayı"
          message={`"${
            deleteDialog.store?.name || ""
          }" deposunu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz.`}
          confirmLabel="Sil"
          cancelLabel="İptal"
          confirmColor="error"
          size="medium"
          showIcon={true}
        />
      </Stack>
    </PageContainer>
  );
}
