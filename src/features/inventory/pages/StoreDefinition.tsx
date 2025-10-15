import { useState } from "react";
import { Typography, Button, Chip, Stack, Alert } from "@mui/material";
import {
  Add as AddIcon,
  Edit as EditIcon,
  Delete as DeleteIcon,
  Store as StoreIcon,
  Refresh as RefreshIcon,
} from "@mui/icons-material";
import PageContainer from "../../../shared/layout/PageContainer";
import {
  GridTable,
  usePagination,
  ConfirmationDialog,
  type GridColumn,
  type GridAction,
  type GridFilter,
} from "../../../shared/components/ui";
import { StoreDefinitionDrawer } from "../components";
import { useStore } from "../hooks";
import type { StoreDefinitionRow } from "../types/inventory.types";

export default function StoreDefinition() {
  // Custom hook - API entegrasyonu
  const {
    stores,
    stockParameters,
    loading,
    error,
    userInfo,
    loadStores,
    createStore,
    updateStore,
    deleteStore,
  } = useStore();

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

  const handleSave = async (
    formData: import("../types/inventory.types").StoreFormData
  ) => {
    try {
      let success = false;

      if (drawerMode === "create") {
        // Yeni kayıt ekleme - API çağrısı
        success = await createStore(formData);
      } else if (drawerMode === "edit" && selectedStore) {
        // Mevcut kaydı güncelleme - API çağrısı
        success = await updateStore(selectedStore.id, formData);
      }

      if (success) {
        handleDrawerClose();
      }
    } catch (error) {
      console.error("Kaydetme hatası:", error);
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

  const handleDeleteConfirm = async () => {
    if (deleteDialog.store) {
      const success = await deleteStore(
        deleteDialog.store.id,
        deleteDialog.store.name
      );

      if (success) {
        setDeleteDialog({ open: false, store: null });
      }
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialog({ open: false, store: null });
  };

  // Refresh handler
  const handleRefresh = () => {
    loadStores();
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
        {/* User Info Badge (Debugging - opsiyonel) */}
        {userInfo && (
          <Stack direction="row" spacing={2} sx={{ mb: 1 }}>
            <Chip label={`Şube: ${userInfo.branchId}`} size="small" />
            <Chip label={`Kullanıcı: ${userInfo.userName}`} size="small" />
            <Chip label={`Rol: ${userInfo.roleId}`} size="small" />
          </Stack>
        )}

        {/* Error Display */}
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        {/* Grid Table */}
        <GridTable<StoreDefinitionRow>
          columns={columns}
          rows={stores}
          keyField="id"
          title="Depo Listesi"
          subtitle={`Toplam ${stores.length} depo kaydı bulunmaktadır`}
          headerActions={
            <Stack direction="row" spacing={2}>
              <Button
                variant="outlined"
                startIcon={<RefreshIcon />}
                onClick={handleRefresh}
                size="large"
                disabled={loading}
              >
                Yenile
              </Button>
              <Button
                variant="contained"
                startIcon={<AddIcon />}
                onClick={handleAddNew}
                size="large"
                disabled={loading}
              >
                Yeni Depo Ekle
              </Button>
            </Stack>
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
          stockParameters={stockParameters}
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
