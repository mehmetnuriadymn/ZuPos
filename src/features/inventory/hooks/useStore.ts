import { useState, useEffect, useCallback } from "react";
import { storeService } from "../services";
import { useToast } from "../../../shared/components/ui";
import type {
  StoreDefinitionRow,
  StoreModel,
  StockParameter,
  StoreFormData,
} from "../types/inventory.types";

/**
 * Custom Hook - Store CRUD operations
 * Feature-Based Architecture prensiplerine uygun
 * Toast notification entegrasyonu dahil
 */
export function useStore() {
  const toast = useToast();

  // State management
  const [stores, setStores] = useState<StoreDefinitionRow[]>([]);
  const [stockParameters, setStockParameters] = useState<StockParameter[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [userInfo, setUserInfo] = useState<{
    roleId: string;
    branchId: string;
    userName: string;
  } | null>(null);

  /**
   * Store listesini API'den yükle
   */
  const loadStores = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await storeService.getStoreList();

      // Debug: API response'u kontrol et (Development only)
      if (import.meta.env.DEV) {
        console.log("📦 Store API Response:", response);
        console.log("🏪 Stores data:", response.stores);
      }

      // User info'yu sakla
      setUserInfo(response.userInfo);

      // Store modellerini UI formatına dönüştür
      const storeRows: StoreDefinitionRow[] = response.stores.map(
        (store: StoreModel & { _tempStorePeriodClosureTypeName?: string }) => {
          // Backend DataTable'dan gelen _tempStorePeriodClosureTypeName kullan
          const tempName = store._tempStorePeriodClosureTypeName || "";

          // StockParameter listesinden Name'e göre StockParameterID'yi bul
          const transferTypeParam = stockParameters.find(
            (param) => param.name === tempName
          );

          // StockParameterID (int) al
          const transferTypeId = transferTypeParam?.stockParameterId || 0;
          const transferTypeName = transferTypeParam?.name || tempName;

          return {
            id: store.id, // SQL: int PRIMARY KEY
            name: store.name, // SQL: nvarchar(150)
            code: store.code, // SQL: nchar(10) - Alfanumerik
            transferType: transferTypeName, // StockParameter.Name (display)
            transferTypeId: transferTypeId, // StockParameter.StockParameterID (int)
            address: store.address, // SQL: nvarchar(max)
            gsm: store.gsm, // SQL: nchar(11)
            status: store.status, // SQL: bit
          };
        }
      );

      setStores(storeRows);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Store listesi yüklenemedi";
      setError(errorMessage);
      toast.error(errorMessage, {
        title: "Yükleme Hatası",
        duration: 5000,
      });
    } finally {
      setLoading(false);
    }
  }, [stockParameters, toast]);

  /**
   * StockParameter listesini yükle (TypeID=2)
   */
  const loadStockParameters = useCallback(async () => {
    try {
      const response = await storeService.getStockParameters();
      setStockParameters(response.stockParameters);
    } catch (err) {
      console.error("StockParameter yükleme hatası:", err);
      toast.warning("Devir tipi listesi yüklenemedi", {
        title: "Uyarı",
        duration: 4000,
      });
    }
  }, [toast]);

  /**
   * Store detayını getir
   */
  const getStoreById = useCallback(
    async (id: number) => {
      setLoading(true);
      setError(null);

      try {
        const response = await storeService.getStoreById(id);
        return response.store;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Store detayı yüklenemedi";
        setError(errorMessage);
        toast.error(errorMessage, {
          title: "Yükleme Hatası",
        });
        return null;
      } finally {
        setLoading(false);
      }
    },
    [toast]
  );

  /**
   * Yeni store oluştur
   */
  const createStore = useCallback(
    async (formData: StoreFormData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const storeData = {
          code: formData.code,
          name: formData.name,
          storePeriodClosureType: formData.storePeriodClosureType,
          adress: formData.address, // ⚠️ address → adress (backend typo)
          gsm: formData.gsm,
          status: formData.status,
        };

        const request = {
          storeModel: {
            ...storeData,
            processType: 1 as const, // 1 = Insert
          },
          storeListModel: [storeData], // Backend aynı data'yı array'de de istiyor
          stockParameterModelList: stockParameters,
        };

        await storeService.saveOrUpdateStore(request);

        toast.success(`"${formData.name}" deposu başarıyla oluşturuldu!`, {
          title: "İşlem Başarılı",
          duration: 3000,
        });

        // Store listesini yenile
        await loadStores();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Store oluşturulamadı";
        setError(errorMessage);
        toast.error(errorMessage, {
          title: "Oluşturma Hatası",
          duration: 5000,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadStores, toast, stockParameters]
  );

  /**
   * Mevcut store'u güncelle
   */
  const updateStore = useCallback(
    async (id: number, formData: StoreFormData): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        const storeData = {
          id: id,
          code: formData.code,
          name: formData.name,
          storePeriodClosureType: formData.storePeriodClosureType,
          adress: formData.address, // ⚠️ address → adress (backend typo)
          gsm: formData.gsm,
          status: formData.status,
        };

        const request = {
          storeModel: {
            ...storeData,
            processType: 2 as const, // 2 = Update
          },
          storeListModel: [storeData], // Backend aynı data'yı array'de de istiyor
          stockParameterModelList: stockParameters,
        };

        await storeService.saveOrUpdateStore(request);

        toast.success(`"${formData.name}" deposu başarıyla güncellendi!`, {
          title: "İşlem Başarılı",
          duration: 3000,
        });

        // Store listesini yenile
        await loadStores();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Store güncellenemedi";
        setError(errorMessage);
        toast.error(errorMessage, {
          title: "Güncelleme Hatası",
          duration: 5000,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadStores, toast, stockParameters]
  );

  /**
   * Store sil
   */
  const deleteStore = useCallback(
    async (id: number, name: string): Promise<boolean> => {
      setLoading(true);
      setError(null);

      try {
        await storeService.deleteStore(id);

        toast.success(`"${name}" deposu başarıyla silindi!`, {
          title: "İşlem Başarılı",
          duration: 3000,
        });

        // Store listesini yenile
        await loadStores();

        return true;
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Store silinemedi";
        setError(errorMessage);
        toast.error(errorMessage, {
          title: "Silme Hatası",
          duration: 5000,
        });
        return false;
      } finally {
        setLoading(false);
      }
    },
    [loadStores, toast]
  );

  /**
   * StoreModel'i FormData'ya dönüştür (Edit için)
   */
  const modelToFormData = useCallback((store: StoreModel): StoreFormData => {
    return {
      name: store.name,
      code: store.code,
      storePeriodClosureType: store.storePeriodClosureType,
      address: store.address || "",
      gsm: store.gsm || "",
      status: store.status,
    };
  }, []);

  /**
   * İlk yükleme - StockParameters'i yükle
   */
  useEffect(() => {
    loadStockParameters();
  }, [loadStockParameters]);

  /**
   * StockParameters yüklendikten sonra Stores'u yükle
   */
  useEffect(() => {
    if (stockParameters.length > 0) {
      loadStores();
    }
  }, [stockParameters, loadStores]);

  return {
    // State
    stores,
    stockParameters,
    loading,
    error,
    userInfo,

    // Actions
    loadStores,
    loadStockParameters,
    getStoreById,
    createStore,
    updateStore,
    deleteStore,

    // Utilities
    modelToFormData,
  };
}
