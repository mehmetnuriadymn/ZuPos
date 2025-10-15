import { apiClient } from "../../../shared/services/api";
import type { Response } from "../../../shared/types/api";
import type {
  GetStoreListResponse,
  GetStoreByIdResponse,
  GetStockParametersResponse,
  SaveOrUpdateStoreRequest,
  DeleteStoreResponse,
  StoreViewModel,
  StoreModel,
} from "../types/inventory.types";

/**
 * Backend DataTable Row Format (UPDATED)
 * Backend'den gelen DataTable yapısı - Backend formatı değişti!
 */
interface DataTableRow {
  column1: string; // ✅ ID (yeni eklendi! Backend düzeltildi)
  column2: string; // Name
  column3: string; // Code
  column4: string; // StorePeriodClosureType Name
  column5: string; // Status HTML
  column6: string; // Actions HTML
  column7?: string; // Ek alanlar (şu an kullanılmıyor)
  column8?: string;
  column9?: string;
  column10?: string;
  column11?: string;
  column12?: string;
  column13?: string;
  column14?: string;
  column15?: string;
  column16?: string;
}

/**
 * Backend Raw API Response
 */
interface RawStoreListResponse {
  userInfo: {
    roleId: string;
    branchId: string;
    userName: string | null;
  };
  stores: DataTableRow[];
  totalRecords: number;
  filteredRecords: number;
}

/**
 * Store Service - Depo işlemleri için API servis katmanı
 * Feature-Based Architecture prensiplerine uygun
 */
export class StoreService {
  private readonly endpoints = {
    getStoreList: "/api/Store/getStoreList",
    getStoreById: "/api/Store/getStoreById",
    getStockParameters: "/api/Store/getStockParameters",
    saveOrUpdate: "/api/Store/saveOrUpdateStore",
    delete: "/api/Store/deleteStore",
  } as const;

  /**
   * DataTable kolonlarını StoreModel'e parse eder
   * Backend DataTable formatı (UPDATED - Backend düzeltildi!):
   * column1 = ID (int) - ✅ Backend'den gerçek ID geliyor artık!
   * column2 = Name (nvarchar(150))
   * column3 = Code (nchar(10)) - Alfanumerik
   * column4 = StorePeriodClosureType NAME (string, ID değil!)
   * column5 = Status (HTML: <img src="checkbox_true/false.png" />)
   * column6 = Actions (HTML buttons)
   *
   * ⚠️ NOT: Address ve GSM backend'de döndürülmüyor (sadece list'te)
   */
  private parseDataTableToStoreModel(
    dataTableRow: DataTableRow
  ): StoreModel {
    // Status HTML'den boolean çıkar
    const statusHtml = dataTableRow.column5 || "";
    const status = statusHtml.includes("checkbox_true.png");

    return {
      id: parseInt(dataTableRow.column1) || 0, // ✅ Backend'den gerçek ID geliyor!
      name: (dataTableRow.column2 || "").trim(), // SQL: nvarchar(150)
      code: (dataTableRow.column3 || "").trim(), // SQL: nchar(10) - Alfanumerik
      storePeriodClosureType: 0, // Column4'ten map edilecek (StockParameter Name → ID)
      status: status, // SQL: bit
      address: "", // Backend list'te döndürülmüyor (edit'te gelir)
      gsm: "", // Backend list'te döndürülmüyor (edit'te gelir)
      // StorePeriodClosureType Name'i geçici olarak sakla (mapping için)
      _tempStorePeriodClosureTypeName: (dataTableRow.column4 || "").trim(),
    } as StoreModel & { _tempStorePeriodClosureTypeName?: string };
  }

  /**
   * Store listesini getirir
   * JWT Token'daki bilgilere göre otomatik şube bazlı veri döner
   */
  async getStoreList(): Promise<GetStoreListResponse> {
    try {
      const response = await apiClient.get<RawStoreListResponse>(
        this.endpoints.getStoreList
      );

      if (!response.data) {
        throw new Error("Store listesi alınamadı");
      }

      // DataTable formatını StoreModel'e dönüştür
      const stores = (response.data.stores || []).map(
        (row: DataTableRow) => this.parseDataTableToStoreModel(row)
      );

      return {
        userInfo: {
          roleId: response.data.userInfo?.roleId || "",
          branchId: response.data.userInfo?.branchId || "",
          userName: response.data.userInfo?.userName || "Unknown",
        },
        stores: stores,
        totalRecords: response.data.totalRecords || stores.length,
        filteredRecords: response.data.filteredRecords || stores.length,
      };
    } catch (error) {
      console.error("GetStoreList Error:", error);
      throw this.handleError(error, "Store listesi alınırken hata oluştu");
    }
  }

  /**
   * Belirli bir store'un detayını getirir
   * @param id Store ID (SQL: int)
   */
  async getStoreById(id: number): Promise<GetStoreByIdResponse> {
    try {
      if (!id) {
        throw new Error("Store ID gerekli");
      }

      const response = await apiClient.get<GetStoreByIdResponse>(
        `${this.endpoints.getStoreById}?id=${encodeURIComponent(String(id))}`
      );

      if (!response.data) {
        throw new Error("Store detayı alınamadı");
      }

      return response.data;
    } catch (error) {
      console.error("GetStoreById Error:", error);
      throw this.handleError(error, "Store detayı alınırken hata oluştu");
    }
  }

  /**
   * StockParameter listesini getirir (TypeID=2)
   * Form'da StorePeriodClosureType select box için kullanılır
   */
  async getStockParameters(): Promise<GetStockParametersResponse> {
    try {
      const response = await apiClient.get<GetStockParametersResponse>(
        this.endpoints.getStockParameters
      );

      if (!response.data) {
        throw new Error("StockParameter listesi alınamadı");
      }

      return response.data;
    } catch (error) {
      console.error("GetStockParameters Error:", error);
      throw this.handleError(
        error,
        "StockParameter listesi alınırken hata oluştu"
      );
    }
  }

  /**
   * Yeni store oluşturur veya mevcut store'u günceller
   * @param viewModel Store ViewModel
   */
  async saveOrUpdateStore(
    viewModel: SaveOrUpdateStoreRequest
  ): Promise<Response<StoreViewModel>> {
    try {
      // ProcessType kontrolü
      if (
        viewModel.storeModel.processType !== 1 &&
        viewModel.storeModel.processType !== 2 &&
        viewModel.storeModel.processType !== 3
      ) {
        throw new Error(
          "ProcessType (1=Insert, 2=Update, 3=Delete) belirtilmeli"
        );
      }

      // Debug: Request'i konsola yazdır
      console.log(
        "📤 Backend'e gönderilen request:",
        JSON.stringify(viewModel, null, 2)
      );

      const response = await apiClient.post<
        StoreViewModel,
        SaveOrUpdateStoreRequest
      >(this.endpoints.saveOrUpdate, viewModel);

      return response;
    } catch (error) {
      console.error("❌ SaveOrUpdateStore Error:", error);
      // Error details'i ayrıştır
      if (error && typeof error === "object" && "details" in error) {
        const errorWithDetails = error as { details: string };
        try {
          const parsedDetails = JSON.parse(errorWithDetails.details);
          console.error("📋 Error Details:", parsedDetails);
          // Validation errors'ı detaylı yazdır
          if (parsedDetails.errors) {
            console.error("🔴 Validation Errors:", JSON.stringify(parsedDetails.errors, null, 2));
          }
        } catch {
          console.error("📋 Error Details (raw):", errorWithDetails.details);
        }
      }
      throw this.handleError(
        error,
        "Store kaydetme/güncelleme işleminde hata oluştu"
      );
    }
  }

  /**
   * Store siler
   * @param id Store ID (SQL: int)
   */
  async deleteStore(id: number): Promise<DeleteStoreResponse> {
    try {
      if (!id) {
        throw new Error("Store ID gerekli");
      }

      const response = await apiClient.delete<DeleteStoreResponse>(
        `${this.endpoints.delete}?id=${encodeURIComponent(String(id))}`
      );

      if (!response.data) {
        throw new Error("Store silme işlemi başarısız");
      }

      return response.data;
    } catch (error) {
      console.error("DeleteStore Error:", error);
      throw this.handleError(error, "Store silme işleminde hata oluştu");
    }
  }

  /**
   * Error handling utility
   */
  private handleError(error: unknown, defaultMessage: string): Error {
    if (error instanceof Error) {
      return error;
    }

    if (error && typeof error === "object") {
      if ("message" in error && typeof error.message === "string") {
        return new Error(error.message);
      }

      if ("statusCode" in error) {
        const statusCode = error.statusCode as number;
        switch (statusCode) {
          case 400:
            return new Error("Geçersiz istek. Lütfen bilgileri kontrol edin.");
          case 401:
            return new Error(
              "Yetkilendirme hatası. Lütfen tekrar giriş yapın."
            );
          case 403:
            return new Error("Bu işlem için yetkiniz yok.");
          case 404:
            return new Error("Kayıt bulunamadı.");
          case 500:
            return new Error(
              "Sunucu hatası. Lütfen daha sonra tekrar deneyin."
            );
        }
      }
    }

    return new Error(defaultMessage);
  }
}

// Singleton instance export
export const storeService = new StoreService();
