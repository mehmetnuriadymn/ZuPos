import { useState, useCallback } from "react";
import { menuService } from "../services/menu";
import type { MenuViewModel, UserMenuResponse } from "../types/menu";

interface MenuState {
  menus: MenuViewModel[];
  userInfo: UserMenuResponse["userInfo"] | null;
  loading: boolean;
  error: string | null;
}

export const useMenu = () => {
  const [menuState, setMenuState] = useState<MenuState>({
    menus: [],
    userInfo: null,
    loading: false,
    error: null,
  });

  const fetchUserMenus = useCallback(async (languageId: string = "1") => {
    setMenuState((prev) => ({ ...prev, loading: true, error: null }));

    try {
      const response = await menuService.getUserMenus(languageId);

      if (response.data && response.statusCode === 200) {
        const menuData = response.data;

        if (menuData && menuData.menus) {
          setMenuState({
            menus: menuData.menus,
            userInfo: menuData.userInfo || null,
            loading: false,
            error: null,
          });
          return menuData;
        } else {
          throw new Error("Menu data structure is invalid");
        }
      } else {
        throw new Error(response.message || "Menü listesi alınamadı");
      }
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
      setMenuState((prev) => ({
        ...prev,
        loading: false,
        error: errorMessage,
      }));
      throw error;
    }
  }, []);

  const fetchMenusByRole = useCallback(
    async (roleId: string, branchId: string, languageId: string = "1") => {
      setMenuState((prev) => ({ ...prev, loading: true, error: null }));

      try {
        const response = await menuService.getMenusByRole(
          roleId,
          branchId,
          languageId
        );

        if (response.data && response.statusCode === 200) {
          setMenuState({
            menus: response.data.menus,
            userInfo: response.data.userInfo,
            loading: false,
            error: null,
          });
          return response.data;
        } else {
          throw new Error(response.message || "Menü listesi alınamadı");
        }
      } catch (error) {
        const errorMessage =
          error instanceof Error ? error.message : "Bilinmeyen bir hata oluştu";
        setMenuState((prev) => ({
          ...prev,
          loading: false,
          error: errorMessage,
        }));
        throw error;
      }
    },
    []
  );

  const clearError = useCallback(() => {
    setMenuState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ...menuState,
    fetchUserMenus,
    fetchMenusByRole,
    clearError,
  };
};
