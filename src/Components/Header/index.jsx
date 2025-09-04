import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import {
  Map,
  MenuBook,
  TaskAlt,
  MonetizationOn,
  DirectionsCar,
  Terrain,
  MyLocation,
  Logout,
  Menu as MenuIcon,
  Close as CloseIcon,
} from "@mui/icons-material";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  openAddRatesModal,
  openAddMileagle,
  openLandBankReportModal,
} from "../../store/modalSlice";
import { setMapCenter } from "../../store/mapCenterSlice";
import {
  setCurrentLocation,
  setLocationError,
} from "../../store/currentLocationSlice";

export default function Header() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const theme = useTheme();

  const isTablet = useMediaQuery(theme.breakpoints.between("sm", "md"));
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [drawerOpen, setDrawerOpen] = useState(false);

  const handleLogout = () => {
    sessionStorage.removeItem("token");
    window.location.reload();
  };

  const handleLocateMe = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const coordinates = [latitude, longitude];
          dispatch(setMapCenter(coordinates));
          dispatch(setCurrentLocation(coordinates));
        },
        () => {
          dispatch(setLocationError("Не вдалося визначити місцезнаходження."));
        }
      );
    } else {
      dispatch(
        setLocationError(
          "Ваш браузер не підтримує визначення місцезнаходження."
        )
      );
    }
  };

  const buttons = [
    { title: "Карта", icon: <Map />, onClick: () => navigate("/") },
    {
      title: "Бібліотеки",
      icon: <MenuBook />,
      onClick: () => navigate("/libraries"),
    },
    { title: "Завдання", icon: <TaskAlt />, onClick: () => navigate("/tasks") },
    {
      title: "Тарифи",
      icon: <MonetizationOn />,
      onClick: () => dispatch(openAddRatesModal()),
    },
    {
      title: "Пробіг",
      icon: <DirectionsCar />,
      onClick: () => dispatch(openAddMileagle()),
    },
    {
      title: "Земельний банк",
      icon: <Terrain />,
      onClick: () => dispatch(openLandBankReportModal()),
    },
    { title: "Де я?", icon: <MyLocation />, onClick: handleLocateMe },
    {
      title: "Вийти",
      icon: <Logout />,
      onClick: handleLogout,
      isLogout: true,
    },
  ];

  return (
    <>
      {/* <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1, // завжди вище Drawer
        }}
      > */}
      {/* <AppBar
        position="fixed"
        sx={{
          width: "calc(100% - 410px)", // ширина екрана мінус ширина бокової панелі
          marginLeft: "410px", // зсунемо вправо, якщо бокова панель зліва
          bgcolor: "transparent",
          boxShadow: "none",
          zIndex: (theme) => theme.zIndex.drawer + 1,
        }}
      > */}

      <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          zIndex: 10,
        }}
      >

        <Toolbar
          sx={{ display: "flex", justifyContent: "center", gap: 1, minHeight: 48 }}
        >
          {isMobile ? (
            // Мобільна версія з бургером
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "flex-end" }}>
              <IconButton onClick={() => setDrawerOpen(!drawerOpen)}>
                {drawerOpen ? <CloseIcon /> : <MenuIcon />}
              </IconButton>
            </Box>
          ) : (
            // Планшет і десктоп
            buttons.map((btn, idx) => (
              <Box
                key={idx}
                onClick={btn.onClick}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                  border: "1px solid #bbb",
                  borderRadius: 2,
                  px: 1,
                  py: 0.5,
                  bgcolor: "#fff",
                  color: "#888",
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "& svg": { color: "#888", transition: "color 0.2s" },
                  "&:hover": {
                    bgcolor: btn.isLogout ? "#ff4d4d" : "#e0e0e0",
                    borderColor: btn.isLogout ? "#ff1a1a" : "#999",
                    color: btn.isLogout ? "#fff" : "#333",
                    "& svg": { color: btn.isLogout ? "#fff" : "#333" },
                  },
                }}
              >
                {btn.icon}
                {!isTablet && (
                  <Typography variant="caption">{btn.title}</Typography>
                )}
              </Box>
            ))
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer для мобільних */}
      <Drawer
        anchor="right"
        open={drawerOpen}
        onClose={() => setDrawerOpen(false)}
        PaperProps={{
          sx: { width: "100%", height: "100%", bgcolor: "#fff" },
        }}
      >
        <List>
          {buttons.map((btn, idx) => (
            <ListItem
              button
              key={idx}
              onClick={() => {
                btn.onClick();
                setDrawerOpen(false);
              }}
              sx={{
                "&:hover": {
                  bgcolor: btn.isLogout ? "#ff4d4d" : "#f5f5f5",
                  color: btn.isLogout ? "#fff" : "inherit",
                  "& svg": { color: btn.isLogout ? "#fff" : "inherit" },
                },
              }}
            >
              <ListItemIcon>{btn.icon}</ListItemIcon>
              <ListItemText primary={btn.title} />
            </ListItem>
          ))}
        </List>
      </Drawer>
    </>
  );
}
