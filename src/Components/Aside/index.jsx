import React, { useState } from "react";
import { Box, IconButton, Tooltip, Paper } from "@mui/material";
import { 
  Groups, 
  People, 
  DirectionsCar, 
  Build, 
  Map, 
  Layers 
} from "@mui/icons-material";
import GroupsList from "../GroupsList";
import PersonnelList from "../PersonnelList";
import VehicleList from "../VehicleList";
import TechniqueList from "../TechniqueList";
import FieldsList from "../FieldsList";
import LayersList from "../LayersList";
import { CalendarMonth } from "@mui/icons-material";
import CalendarList from "../CalendarList";

export default function Aside() {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    { name: "groups", icon: <Groups />, label: "Групи", component: <GroupsList /> },
    { name: "personnel", icon: <People />, label: "Персонал", component: <PersonnelList /> },
    { name: "vehicles", icon: <DirectionsCar />, label: "Транспорт", component: <VehicleList /> },
    { name: "techniques", icon: <Build />, label: "Техніка", component: <TechniqueList /> },
    { name: "fields", icon: <Map />, label: "Поля", component: <FieldsList /> },
    { name: "layers", icon: <Layers />, label: "Шари карти", component: <LayersList /> },
    { name: "calendar", icon: <CalendarMonth />, label: "Календар", component: <CalendarList /> },
  ];

  return (
    <>
      {/* Aside з кнопками */}
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "60px",
          height: "100vh",
          bgcolor: "rgba(33,33,33,0.9)",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          py: 2,
          zIndex: 10,
          borderRadius: 0,
        }}
      >
        {tabs.map((tab) => (
          <Tooltip key={tab.name} title={tab.label} placement="right">
            <IconButton
              onClick={() =>
                setActiveTab((prev) => (prev === tab.name ? null : tab.name))
              }
              sx={{
                mb: 1,
                color: activeTab === tab.name ? "primary.main" : "white",
                bgcolor:
                  activeTab === tab.name ? "rgba(25,118,210,0.2)" : "transparent",
                "&:hover": {
                  bgcolor: "rgba(25,118,210,0.1)",
                  color: "primary.main",
                },
                transition: "all 0.3s",
              }}
            >
              {tab.icon}
            </IconButton>
          </Tooltip>
        ))}
      </Paper>

      {/* Таб, що з’являється праворуч від Aside */}
      {activeTab && (
        <Box
          sx={{
            position: "absolute",
            top: 0,
            left: "60px", // праворуч від Aside
            width: 350,
            height: "100vh",
            bgcolor: "rgba(33,33,33,0.95)",
            overflowY: "auto",
            zIndex: 20,
            p: 2,
          }}
        >
          {tabs.find((tab) => tab.name === activeTab)?.component}
        </Box>
      )}
    </>
  );
}
