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
import MenuIcon from "@mui/icons-material/Menu";
import { useMenu } from "../hooks/useMenu";
import { useAuth } from "../../features/auth/hooks/useAuth";

// Menü ikonu mapping'i
const getMenuIcon = (menuName: string) => {
  const iconMap: Record<string, React.ReactElement> = {
    Home: <HomeRoundedIcon />,
    "Ana Sayfa": <HomeRoundedIcon />,
    Dashboard: <HomeRoundedIcon />,
    Analytics: <AnalyticsRoundedIcon />,
    Analitik: <AnalyticsRoundedIcon />,
    Raporlar: <AnalyticsRoundedIcon />,
    Clients: <PeopleRoundedIcon />,
    Müşteriler: <PeopleRoundedIcon />,
    Kullanıcılar: <PeopleRoundedIcon />,
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

  const handleSubMenuClick = (subMenuId: number, subMenuUrl?: string) => {
    if (subMenuUrl && subMenuUrl !== "#") {
      setSelectedMenu(subMenuId);
      navigate(subMenuUrl);
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
                            onClick={() =>
                              handleSubMenuClick(subMenu.menuId, subMenu.url)
                            }
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
