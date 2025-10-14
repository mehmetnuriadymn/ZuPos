// Menu API response types - Backend'den gelen gerçek yapı
export interface MenuModel {
  menuSeqId: number;
  menuId: number;
  parentMenuId: number;
  contentTypeId: number;
  languageId: number;
  name: string;
  url: string;
  positionId: number;
  displayOrderNumber: number;
  imagePath: string;
  adminUrl?: string;
  title?: string;
  body?: string;
  status: boolean;
  typeId?: number;
  createdDate?: string;
  updateDate?: string;
  createdBy?: string;
  updateBy?: string;
  controller?: string;
  action?: string;
}

export interface MenuViewModel {
  mainModel: MenuModel;
  subMenu: MenuModel[];
}

export interface UserMenuResponse {
  userInfo: {
    roleId: string;
    branchId: string;
    userName: string | null;
    languageId: string;
  };
  menus: MenuViewModel[];
  totalMenuCount?: number;
}

// MenuApiResponse artık gerekli değil - Response<UserMenuResponse> kullanıyoruz
