import { useState } from "react";
import { Box, Tabs, Tab, Paper } from "@mui/material";

import Header from "../Header";
import Modals from "../Modals";

import UnitTab from "../UnitTab";
import PersonnelTab from "../PersonnellTab";
import VehicleTab from "../VehicleTab";
import TechniqeTab from "../TechniqueTab";
import FieldsTab from "../FieldsTab";
import OperationsTab from "../OperationsTab";
import CropsTab from "../CropsTab";
import VarietiesTab from "../VarietiesTab";
import PlotsTab from "../PlotsTab";

import bgPic from "../../assets/field_2.webp";

const tabs = [
    { key: "groups", label: "Підрозділи", component: UnitTab },
    { key: "personnel", label: "Співробітники", component: PersonnelTab },
    { key: "vehicles", label: "Транспорт", component: VehicleTab },
    { key: "trailers", label: "Причепи", component: TechniqeTab },
    { key: "fields", label: "Поля", component: FieldsTab },
    { key: "plots", label: "Ділянки", component: PlotsTab },
    { key: "operations", label: "Операції", component: OperationsTab },
    { key: "crops", label: "Культури", component: CropsTab },
    { key: "sorts", label: "Сорти", component: VarietiesTab },
];

export default function Libraries() {

    const [activeTab, setActiveTab] = useState(0);

    const ActiveTab = tabs[activeTab].component;

    return (
        <Box
            sx={{
                height: "100vh",
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
                    flex: 1,
                    minHeight: 0,
                    pt: 10,
                    px: 2,
                    pb: 2,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        flex: 1,
                        minHeight: 0,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                        bgcolor: "rgba(255,255,255,0.9)",
                        borderRadius: 2,
                    }}
                >
                    <Tabs
                        value={activeTab}
                        onChange={(_, value) => setActiveTab(value)}
                        variant="scrollable"
                        scrollButtons="auto"
                        allowScrollButtonsMobile
                        sx={{
                            borderBottom: "1px solid",
                            borderColor: "divider",
                            bgcolor: "rgba(255,255,255,0.85)",

                            "& .MuiTab-root": {
                                textTransform: "none",
                                minHeight: 52,
                                fontSize: 13,
                                fontWeight: 500,
                            },
                        }}
                    >
                        {tabs.map((tab) => (
                            <Tab
                                key={tab.key}
                                label={tab.label}
                            />
                        ))}
                    </Tabs>

                    <Box
                        sx={{
                            flex: 1,
                            minHeight: 0,
                            overflow: "auto",
                            p: 2,
                        }}
                    >
                        <ActiveTab />
                    </Box>
                </Paper>
            </Box>

            <Modals />
        </Box>
    );
}