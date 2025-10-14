// Store (Depo) related types
export interface Store {
  storeId: number;
  storeCode: string;
  storeName: string;
  storeType: "MAIN" | "BRANCH" | "VIRTUAL";
  branchId: number;
  isActive: boolean;
  address?: string;
  phone?: string;
  email?: string;
  createdDate: string;
  updatedDate?: string;
}

export interface CreateStoreRequest {
  storeCode: string;
  storeName: string;
  storeType: "MAIN" | "BRANCH" | "VIRTUAL";
  branchId: number;
  address?: string;
  phone?: string;
  email?: string;
}

export interface UpdateStoreRequest extends Partial<CreateStoreRequest> {
  storeId: number;
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
