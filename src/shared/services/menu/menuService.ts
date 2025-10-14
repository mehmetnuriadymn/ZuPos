import { apiClient } from "../api/apiClient";
import type { Response } from "../../types/api";
import type { UserMenuResponse } from "../../types/menu";

export class MenuService {
  /**
   * JWT Token'daki roleID'ye göre kullanıcının menü listesini çeker
   * @param languageId Dil ID (varsayılan: "1")
   * @returns Promise<Response<UserMenuResponse>>
   */
  async getUserMenus(
    languageId: string = "1"
  ): Promise<Response<UserMenuResponse>> {
    return apiClient.get<UserMenuResponse>(
      `/api/Menu/getMenuList?languageID=${languageId}`
    );
  }

  /**
   * Belirli bir role göre menü listesini çeker
   * @param roleId Rol ID
   * @param branchId Şube ID
   * @param languageId Dil ID (varsayılan: "1")
   * @returns Promise<Response<UserMenuResponse>>
   */
  async getMenusByRole(
    roleId: string,
    branchId: string,
    languageId: string = "1"
  ): Promise<Response<UserMenuResponse>> {
    return apiClient.get<UserMenuResponse>(
      `/api/Menu/getMenusByRole?roleId=${roleId}&branchId=${branchId}&languageID=${languageId}`
    );
  }
}

// Singleton instance
export const menuService = new MenuService();
