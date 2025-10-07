import { useState } from "react";
import Header from "../Header";
import { Box, Tabs, Tab, Paper } from "@mui/material";

import UnitTab from "../UnitTab";
import PersonnelTab from "../PersonnellTab";
import VehicleTab from "../VehicleTab";
import TechniqeTab from "../TechniqueTab";
import FieldsTab from "../FieldsTab";
import OperationsTab from "../OperationsTab";
import CropsTab from "../CropsTab";
import VarietiesTab from "../VarietiesTab";
import RentTab from "../RentTab";
import PropertiesTab from "../PropertiesTab";
import Modals from "../Modals";
import bgPic from '../../assets/field_2.webp';

const tabs = [
  { key: "groups", label: "Підрозділи", component: <UnitTab /> },
  { key: "personnel", label: "Співробітники", component: <PersonnelTab /> },
  { key: "vehicles", label: "Транспорт", component: <VehicleTab /> },
  { key: "trailers", label: "Причепи", component: <TechniqeTab /> },
  { key: "fields", label: "Поля", component: <FieldsTab /> },
  { key: "rent", label: "Оренда", component: <RentTab /> },
  { key: "properties", label: "Власність", component: <PropertiesTab /> },
  { key: "operations", label: "Операції", component: <OperationsTab /> },
  { key: "crops", label: "Культури", component: <CropsTab /> },
  { key: "sorts", label: "Сорти", component: <VarietiesTab /> },
];

export default function Libraries() {
  const [activeTab, setActiveTab] = useState(0);

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${bgPic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />

      <Box
        sx={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          width: "100%",
          maxHeight: "calc(100vh - 40px)",
          display: "flex",
          flexDirection: "column",
          padding: "80px 20px 20px 20px",
          flexGrow: 1,
        }}
      >
        {/* Меню табів */}
        <Paper
          elevation={2}
          sx={{
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            border: "1px solid #ddd",
            bgcolor: "rgba(255,255,255,0.85)",
            mb: 0,
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(_, newValue) => setActiveTab(newValue)}
            variant="fullWidth"
            aria-label="library tabs"
            sx={{
              "& .MuiTabs-flexContainer": {
                justifyContent: "space-between",
              },
            }}
          >
            {tabs.map((tab) => (
              <Tab
                key={tab.key}
                label={tab.label}
                sx={{ fontSize: 13, textTransform: "none" }}
              />
            ))}
          </Tabs>
        </Paper>

        {/* Контент табів */}
        <Box
          sx={{
            flexGrow: 1,
            border: "1px solid #ddd",
            borderTop: "none", // щоб не було подвійного бордера
            borderBottomLeftRadius: 8,
            borderBottomRightRadius: 8,
            borderTopLeftRadius: 0,
            borderTopRightRadius: 0,
            overflowY: "auto",
            p: 2,
            bgcolor: "rgba(255,255,255,0.9)",
          }}
        >
          {tabs[activeTab].component}
        </Box>
      </Box>

      <Modals />
    </Box>
  );
}
