import React, { useState } from "react";
import {
  AppBar,
  Toolbar,
  Box,
  Typography,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  useMediaQuery,
  useTheme,
  IconButton,
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
      <AppBar
        position="fixed"
        sx={{
          bgcolor: "transparent",
          boxShadow: "none",
          zIndex: 10,
        }}
      >
        <Toolbar
          sx={{
            display: "flex",
            justifyContent: "center",
            gap: 1,
            minHeight: 48,
          }}
        >
          {!isMobile &&
            buttons.map((btn, idx) => (
              <Box
                key={idx}
                onClick={btn.onClick}
                sx={{
                  display: "flex",
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 0.5,
                  border: "1px solid #ccc",
                  borderRadius: 2,
                  px: 1.5,
                  py: 0.7,
                  bgcolor: btn.isLogout ? "#ff4d4d" : "#ffffff",
                  color: btn.isLogout ? "#fff" : "#000",
                  fontWeight: 600,
                  cursor: "pointer",
                  transition: "all 0.2s",
                  "& svg": {
                    color: btn.isLogout ? "#fff" : "#000",
                    transition: "color 0.2s",
                  },
                  "&:hover": {
                    bgcolor: btn.isLogout ? "#e60000" : "#f0f0f0",
                    borderColor: btn.isLogout ? "#cc0000" : "#000",
                    "& svg": { color: btn.isLogout ? "#fff" : "#000" },
                  },
                }}
              >
                {btn.icon}
                {!isTablet && (
                  <Typography variant="caption">{btn.title}</Typography>
                )}
              </Box>
            ))}
        </Toolbar>
      </AppBar>

      {/* Бургер завжди зверху */}
      {isMobile && (
        <IconButton
          onClick={() => setDrawerOpen(!drawerOpen)}
          sx={{
            position: "fixed",
            top: 12,
            right: 12,
            width: 44,
            height: 44,
            borderRadius: "50%",
            bgcolor: "#fff",
            boxShadow: 3,
            zIndex: 2000,
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            gap: 0.6,
            transition: "all 0.3s ease",
          }}
        >
          {/* Верхня риска */}
          <Box
            sx={{
              width: 22,
              height: 2,
              bgcolor: "#000",
              borderRadius: 1,
              transition: "0.3s",
              transform: drawerOpen
                ? "rotate(45deg) translate(4px, 4px)"
                : "none",
            }}
          />
          {/* Середня риска */}
          <Box
            sx={{
              width: 22,
              height: 2,
              bgcolor: "#000",
              borderRadius: 1,
              transition: "0.3s",
              opacity: drawerOpen ? 0 : 1,
            }}
          />
          {/* Нижня риска */}
          <Box
            sx={{
              width: 22,
              height: 2,
              bgcolor: "#000",
              borderRadius: 1,
              transition: "0.3s",
              transform: drawerOpen
                ? "rotate(-45deg) translate(5px, -5px)"
                : "none",
            }}
          />
        </IconButton>
      )}

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
