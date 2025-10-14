import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Stack from "@mui/material/Stack";
import Collapse from "@mui/material/Collapse";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AnalyticsRoundedIcon from "@mui/icons-material/AnalyticsRounded";
import PeopleRoundedIcon from "@mui/icons-material/PeopleRounded";
import AssignmentRoundedIcon from "@mui/icons-material/AssignmentRounded";
import InventoryIcon from "@mui/icons-material/Inventory";
import StoreIcon from "@mui/icons-material/Store";
import CategoryIcon from "@mui/icons-material/Category";
import MenuIcon from "@mui/icons-material/Menu";
import { useMenu } from "../hooks/useMenu";
import { useAuth } from "../../features/auth/hooks/useAuth";
import type { MenuModel } from "../types/menu";

// Backend controller'ları -> Frontend route'ları mapping
const CONTROLLER_TO_ROUTE_MAP: Record<string, string> = {
  // Inventory (Stok Tanımlamaları)
  Store: "/inventory/store-definition",
  AccountPeriod: "/inventory/account-period",
  MainGroup: "/inventory/main-group",
  MainGroup2: "/inventory/main-group-2",
  SubGroup: "/inventory/sub-group",
  "Products.aspx": "/inventory/product-definition",
  "Recipe.aspx": "/inventory/recipes",
  "Groups.aspx": "/inventory/groups",
  UnitType: "/inventory/unit-type",
  "RevenueCenter.aspx": "/inventory/revenue-center",

  // Sales (Satış) - Gelecekte eklenecek
  Sales: "/sales/overview",
  Orders: "/sales/orders",
  Customers: "/sales/customers",

  // Reports (Raporlar) - Gelecekte eklenecek
  Reports: "/reports/overview",
  StockReport: "/reports/stock-report",
  SalesReport: "/reports/sales-report",
} as const;

// Menü ikonu mapping'i - Backend menu adlarına göre
const getMenuIcon = (menuName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    // Dashboard
    Home: <HomeRoundedIcon />,
    "Ana Sayfa": <HomeRoundedIcon />,
    Dashboard: <HomeRoundedIcon />,

    // Stok Tanımlamaları (Inventory)
    "STOK TANIMLARI": <InventoryIcon />,
    "Stok Tanımlamaları": <InventoryIcon />,
    "Depo Tanımlama": <StoreIcon />,
    "Hesap Dönemi": <CategoryIcon />,
    Gruplar: <CategoryIcon />,
    "Ürün Tanımlama": <InventoryIcon />,
    "Gelir Merkezi": <StoreIcon />,
    Reçeteler: <MenuIcon />,
    Çevrimler: <MenuIcon />,
    "Üst Grup Tanımlama": <CategoryIcon />,
    "Ana Grup Tanımlama": <CategoryIcon />,
    "Alt Grup Tanımlama": <CategoryIcon />,

    // Reports
    Analytics: <AnalyticsRoundedIcon />,
    Analitik: <AnalyticsRoundedIcon />,
    Raporlar: <AnalyticsRoundedIcon />,

    // Users/Customers
    Clients: <PeopleRoundedIcon />,
    Müşteriler: <PeopleRoundedIcon />,
    Kullanıcılar: <PeopleRoundedIcon />,

    // Tasks
    Tasks: <AssignmentRoundedIcon />,
    Görevler: <AssignmentRoundedIcon />,
    İşlemler: <AssignmentRoundedIcon />,
  };

  return iconMap[menuName] || <MenuIcon />;
};

export default function MenuContent() {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { menus, loading, error, fetchUserMenus } = useMenu();
  const [expandedMenus, setExpandedMenus] = useState<Set<number>>(new Set());
  const [selectedMenu, setSelectedMenu] = useState<number | null>(null);

  useEffect(() => {
    // Kullanıcı giriş yaptıysa menüleri çek
    if (isAuthenticated) {
      fetchUserMenus("1").catch((error) => {
        console.error("Menu fetch error:", error);
        // API çağrısı başarısız olursa, error state'i zaten useMenu hook'unda set ediliyor
      });
    }
  }, [isAuthenticated, fetchUserMenus]);

  const handleMenuClick = (
    menuId: number,
    menuUrl?: string,
    hasSubMenus: boolean = false
  ) => {
    if (hasSubMenus) {
      // Alt menüsü olan menüyü aç/kapat
      setExpandedMenus((prev) => {
        const newSet = new Set(prev);
        if (newSet.has(menuId)) {
          newSet.delete(menuId);
        } else {
          newSet.add(menuId);
        }
        return newSet;
      });
    } else if (menuUrl && menuUrl !== "#") {
      // URL'si olan menüye yönlendir
      setSelectedMenu(menuId);
      navigate(menuUrl);
    }
  };

  const handleSubMenuClick = (subItem: MenuModel) => {
    // Controller'a göre route'u bul
    const route =
      CONTROLLER_TO_ROUTE_MAP[subItem.controller || ""] ||
      CONTROLLER_TO_ROUTE_MAP[subItem.url || ""];

    if (route) {
      setSelectedMenu(subItem.menuId);
      navigate(route);
    } else {
      // Route bulunamazsa console'a uyarı ver
      console.warn(
        `Route not found for controller: ${subItem.controller}, url: ${subItem.url}`
      );

      // Fallback: URL varsa direkt kullan
      if (subItem.url && subItem.url !== "#") {
        setSelectedMenu(subItem.menuId);
        navigate(`/${subItem.url}`);
      }
    }
  };

  if (loading) {
    return (
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress size={24} />
        <Typography variant="caption" sx={{ mt: 1 }}>
          Menüler yükleniyor...
        </Typography>
      </Stack>
    );
  }

  if (error) {
    return (
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="error" align="center">
          {error}
        </Typography>
      </Stack>
    );
  }

  if (!menus.length) {
    return (
      <Stack
        sx={{
          flexGrow: 1,
          p: 1,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Typography variant="caption" color="text.secondary" align="center">
          Menü bulunamadı
        </Typography>
      </Stack>
    );
  }

  return (
    <Stack sx={{ flexGrow: 1, p: 1, justifyContent: "space-between" }}>
      <List dense>
        {menus.map((menuItem) => {
          const mainMenu = menuItem.mainModel;
          const subMenus = menuItem.subMenu;
          const hasSubMenus = subMenus && subMenus.length > 0;
          const isExpanded = expandedMenus.has(mainMenu.menuId);
          const isSelected = selectedMenu === mainMenu.menuId;

          return (
            <Box key={mainMenu.menuId}>
              {/* Ana Menü */}
              <ListItem disablePadding sx={{ display: "block" }}>
                <ListItemButton
                  selected={isSelected}
                  onClick={() =>
                    handleMenuClick(mainMenu.menuId, mainMenu.url, hasSubMenus)
                  }
                  sx={{
                    minHeight: 48,
                    borderRadius: 1,
                    "&.Mui-selected": {
                      backgroundColor: "primary.main",
                      color: "primary.contrastText",
                      "&:hover": {
                        backgroundColor: "primary.dark",
                      },
                    },
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40 }}>
                    {getMenuIcon(mainMenu.name)}
                  </ListItemIcon>
                  <ListItemText
                    primary={mainMenu.name}
                    primaryTypographyProps={{
                      fontSize: "0.875rem",
                      fontWeight: isSelected ? 600 : 400,
                    }}
                  />
                  {hasSubMenus && (
                    <Box sx={{ ml: "auto" }}>
                      {isExpanded ? <ExpandLess /> : <ExpandMore />}
                    </Box>
                  )}
                </ListItemButton>
              </ListItem>

              {/* Alt Menüler */}
              {hasSubMenus && (
                <Collapse in={isExpanded} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    {subMenus.map((subMenu) => {
                      const isSubSelected = selectedMenu === subMenu.menuId;

                      return (
                        <ListItem key={subMenu.menuId} disablePadding>
                          <ListItemButton
                            selected={isSubSelected}
                            onClick={() => handleSubMenuClick(subMenu)}
                            sx={{
                              pl: 4,
                              minHeight: 40,
                              borderRadius: 1,
                              "&.Mui-selected": {
                                backgroundColor: "primary.main",
                                color: "primary.contrastText",
                                "&:hover": {
                                  backgroundColor: "primary.dark",
                                },
                              },
                            }}
                          >
                            <ListItemIcon sx={{ minWidth: 32 }}>
                              {getMenuIcon(subMenu.name)}
                            </ListItemIcon>
                            <ListItemText
                              primary={subMenu.name}
                              primaryTypographyProps={{
                                fontSize: "0.8rem",
                                fontWeight: isSubSelected ? 600 : 400,
                              }}
                            />
                          </ListItemButton>
                        </ListItem>
                      );
                    })}
                  </List>
                </Collapse>
              )}
            </Box>
          );
        })}
      </List>
    </Stack>
  );
}
