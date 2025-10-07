import React, { useState } from "react";
import { Box, IconButton, Tooltip, Paper } from "@mui/material";
import { Groups, People, DirectionsCar, Build } from "@mui/icons-material";
import GroupsList from "../GroupsList";
import PersonnelList from "../PersonnelList";
import VehicleList from "../VehicleList";
import TechniqueList from "../TechniqueList";

export default function GroupsContainer() {
  const [activeTab, setActiveTab] = useState(null);

  const tabs = [
    { name: "groups", icon: <Groups />, label: "Групи" },
    { name: "personnel", icon: <People />, label: "Персонал" },
    { name: "vehicles", icon: <DirectionsCar />, label: "Транспорт" },
    { name: "techniques", icon: <Build />, label: "Техніка" },
  ];

  return (
    <Box sx={{ display: "flex", position: "relative", width: "100%" }}>
      {/* Контейнер кнопок */}
      <Paper
        elevation={0} // без тіні, щоб не «перетирало» фон Aside
        sx={{
          position: "relative",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          bgcolor: "transparent",
          p: 1,
          width: "100%",
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

      {/* Випадаючий список */}
      {activeTab && (
        <Box
          sx={{
            position: "relative",
            top: 0,
            left: 0, // праворуч від кнопок
            height: "100vh",
            width: 300,
            zIndex: 20, // вище за кнопки
          }}
        >
          {activeTab === "groups" && <GroupsList />}
          {activeTab === "personnel" && <PersonnelList />}
          {activeTab === "vehicles" && <VehicleList />}
          {activeTab === "techniques" && <TechniqueList />}
        </Box>
      )}
    </Box>
  );
}
