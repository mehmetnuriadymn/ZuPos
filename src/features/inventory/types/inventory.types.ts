// ============================================
// Backend API Response Types (Controller'dan dönen)
// ============================================

/**
 * StockParameter - TypeID=2 olan kayıtlar StorePeriodClosureType için kullanılır
 * SQL Schema: StockParameterID (int PK), Code (nvarchar(15)), Name (nvarchar(150)),
 *             Value (nvarchar(50)), TypeID (int), Status (bit), OrderBy (int)
 */
export interface StockParameter {
  stockParameterId: number; // SQL: int PRIMARY KEY
  code: string; // SQL: nvarchar(15)
  name: string; // SQL: nvarchar(150) - Display name
  value: string; // SQL: nvarchar(50)
  typeId: number; // SQL: int - TypeID=2 for StorePeriodClosureType
  status: boolean; // SQL: bit
  orderBy?: number; // SQL: int
  createdBy?: string; // SQL: nvarchar(256)
  createdDate?: string; // SQL: datetime
  updatedBy?: string; // SQL: nvarchar(256)
  updatedDate?: string; // SQL: datetime
}

/**
 * Store Model - Backend'den dönen store yapısı
 * SQL Schema: ID (int PK), Code (nchar(10)), Name (nvarchar(150)),
 *             StorePeriodClosureType (int FK), Adress (nvarchar(max)),
 *             Image (nvarchar(max)), Gsm (nchar(11)), Status (bit)
 */
export interface StoreModel {
  id: number; // SQL: int PRIMARY KEY (NOT NULL)
  code: string; // SQL: nchar(10) - Alfanumerik, sayısal olmak zorunda değil
  name: string; // SQL: nvarchar(150)
  storePeriodClosureType: number; // SQL: int - StockParameterID foreign key
  address?: string; // SQL: nvarchar(max) - Backend'de 'Adress' (typo)
  image?: string; // SQL: nvarchar(max)
  gsm?: string; // SQL: nchar(11) - Format: 05551234567
  status: boolean; // SQL: bit
  createdBy?: string; // SQL: nvarchar(256)
  createdDate?: string; // SQL: datetime
  updatedBy?: string; // SQL: nvarchar(256)
  updatedDate?: string; // SQL: datetime
  processType?: "I" | "U" | "D"; // Insert, Update, Delete (backend için)
}

/**
 * Store ViewModel - Backend'den dönen tam yapı
 */
export interface StoreViewModel {
  storeModel: StoreModel;
  stockParameterModelList: StockParameter[]; // TypeID=2 olanlar
}

/**
 * GetStoreList API Response Data
 */
export interface GetStoreListResponse {
  userInfo: {
    roleId: string;
    branchId: string;
    userName: string;
  };
  stores: StoreModel[];
  totalRecords: number;
  filteredRecords: number;
}

/**
 * GetStoreById API Response Data
 */
export interface GetStoreByIdResponse {
  userInfo: {
    roleId: string;
    branchId: string;
    userName: string;
  };
  store: StoreModel;
  stockParameters: StockParameter[];
}

/**
 * GetStockParameters API Response Data
 */
export interface GetStockParametersResponse {
  stockParameters: StockParameter[];
  totalCount: number;
}

/**
 * SaveOrUpdate Request - Backend'e gönderilecek
 * Backend C# API format: { storeModel: {...}, storeListModel: [...], stockParameterModelList: [...] }
 * ⚠️ NOT: Backend hem storeModel hem storeListModel istiyor (garip ama öyle)
 * ⚠️ NOT: Backend'de "address" → "adress" (typo)
 * ⚠️ NOT: processType storeModel içinde olmalı
 */
export interface SaveOrUpdateStoreRequest {
  storeModel: {
    id?: number; // SQL: int PRIMARY KEY (Update için gerekli)
    code: string; // SQL: nchar(10)
    name: string; // SQL: nvarchar(150)
    storePeriodClosureType: number; // SQL: int - StockParameterID
    adress?: string; // ⚠️ Backend typo: "adress" (tek 'd')
    image?: string; // SQL: nvarchar(max)
    gsm?: string; // SQL: nchar(11)
    status: boolean; // SQL: bit
    processType: 1 | 2 | 3; // 1=Insert, 2=Update, 3=Delete (Backend requirement)
  };
  storeListModel: Array<{
    id?: number;
    code: string;
    name: string;
    storePeriodClosureType: number;
    adress?: string;
    image?: string;
    gsm?: string;
    status: boolean;
  }>; // Backend required (garip ama hem storeModel hem bu istiyor)
  stockParameterModelList: StockParameter[]; // Backend required
}

/**
 * Delete Response Data
 */
export interface DeleteStoreResponse {
  success: boolean;
  result: boolean;
  title: string;
  message: string;
  deletedId: string;
}

// ============================================
// Frontend UI Types (Grid ve Form için)
// ============================================

/**
 * Grid için kullanılacak Store Row
 */
export interface StoreDefinitionRow extends Record<string, unknown> {
  id: number; // SQL: int PRIMARY KEY
  name: string; // SQL: nvarchar(150)
  code: string; // SQL: nchar(10) - Alfanumerik
  transferType: string; // StockParameter.Name (display için)
  transferTypeId: number; // StockParameter.StockParameterID (gerçek ID)
  address?: string; // SQL: nvarchar(max)
  gsm?: string; // SQL: nchar(11)
  status: boolean; // SQL: bit
}

/**
 * Drawer Form Data
 */
export interface StoreFormData {
  name: string; // SQL: nvarchar(150) - Required
  code: string; // SQL: nchar(10) - Alfanumerik, required
  storePeriodClosureType: number; // SQL: int - StockParameterID selection
  address: string; // SQL: nvarchar(max) - Optional
  gsm: string; // SQL: nchar(11) - Optional, format: 05551234567
  status: boolean; // SQL: bit - Active/Inactive
}

// Account Period (Hesap Dönemi) related types
export interface AccountPeriod {
  periodId: number;
  periodName: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
  isCurrent: boolean;
  branchId: number;
  createdDate: string;
}

export interface CreateAccountPeriodRequest {
  periodName: string;
  startDate: string;
  endDate: string;
  branchId: number;
}

// Product Group (Grup) related types
export interface ProductGroup {
  groupId: number;
  groupCode: string;
  groupName: string;
  parentGroupId?: number;
  groupLevel: number;
  isActive: boolean;
  displayOrder: number;
  createdDate: string;
}

export interface CreateProductGroupRequest {
  groupCode: string;
  groupName: string;
  parentGroupId?: number;
  displayOrder?: number;
}

// Product (Ürün) related types
export interface Product {
  productId: number;
  productCode: string;
  productName: string;
  barcode?: string;
  groupId: number;
  unitTypeId: number;
  buyPrice: number;
  sellPrice: number;
  stockAmount: number;
  minStockLevel: number;
  maxStockLevel: number;
  isActive: boolean;
  description?: string;
  imagePath?: string;
  createdDate: string;
}

export interface CreateProductRequest {
  productCode: string;
  productName: string;
  barcode?: string;
  groupId: number;
  unitTypeId: number;
  buyPrice: number;
  sellPrice: number;
  minStockLevel?: number;
  maxStockLevel?: number;
  description?: string;
}

// API Response wrappers
export interface InventoryApiResponse<T> {
  message: string;
  statusCode: number;
  data: T;
}

export interface PaginatedResponse<T> {
  items: T[];
  totalCount: number;
  pageSize: number;
  currentPage: number;
  totalPages: number;
}
