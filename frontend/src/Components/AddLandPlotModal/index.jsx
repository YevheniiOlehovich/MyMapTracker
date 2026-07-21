import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Typography,
    Button,
    Box,
    Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
    closeAddLandPlotModal,
} from "../../store/modalSlice";
import {
    useAddRent2026,
    useUpdateRent2026,
} from "../../hooks/useRent2026";

import LandPlotInfoPanel from "../LandPlotInfoPannel";
import LandPlotGeometryPanel from "../LandPlotGeometryPanel";
import {
    buildVerticesFromGeometry,
    buildGeometryFromVertices,
} from "./geometryHelpers";

export default function AddLandPlotModal() {
    const dispatch = useDispatch();

    const isOpen = useSelector(
        (state) => state.modals.isAddLandPlotModalVisible
    );

    const selectedLandPlot = useSelector(
        (state) => state.modals.selectedLandPlot
    );

    const handleClose = () => {
        setVertices([]);
        dispatch(closeAddLandPlotModal());
    };


    const [formData, setFormData] = useState({
        source: "",

        owner: {
            name: "",
            phone: "",
            taxNumber: "",
            passport: "",
            address: "",
        },

        document: {
            documentType: "",
            documentNumber: "",
            registrationNumber: "",
            registrationDate: "",
        },

        plot: {
            cadnum: "",
            area: "",
            plotType: "",
            normativeValuation: "",
        },

        agreement: {
            contractNumber: "",
            signDate: "",
            registrationDateDZK: "",
            endDate: "",
            termYears: "",
            rentPercent: "",
            terminationInfo: "",
        },

        note: "",
    });

    const [vertices, setVertices] = useState([]);

    useEffect(() => {
        if (selectedLandPlot) {
            setFormData(selectedLandPlot);

            setVertices(
                buildVerticesFromGeometry(
                    selectedLandPlot.geometry
                )
            );
        } else {
            setFormData({
                source: "",

                owner: {
                    name: "",
                    phone: "",
                    taxNumber: "",
                    passport: "",
                    address: "",
                },

                document: {
                    documentType: "",
                    documentNumber: "",
                    registrationNumber: "",
                    registrationDate: "",
                },

                plot: {
                    cadnum: "",
                    area: "",
                    plotType: "",
                    normativeValuation: "",
                },

                agreement: {
                    contractNumber: "",
                    signDate: "",
                    registrationDateDZK: "",
                    endDate: "",
                    termYears: "",
                    rentPercent: "",
                    terminationInfo: "",
                },

                note: "",
            });

            setVertices([]);
        }
    }, [selectedLandPlot]);

    const handleChange = (section, field) => (e) => {
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            [section]: {
                ...prev[section],
                [field]: value,
            },
        }));
    };

    const handleRootChange = (field) => (e) => {
        const value = e.target.value;

        setFormData((prev) => ({
            ...prev,
            [field]: value,
        }));
    };

    const addMutation = useAddRent2026();
    const updateMutation = useUpdateRent2026();

    const handleSave = () => {
        const data = {
            ...formData,
            geometry: buildGeometryFromVertices(vertices),
        };

        if (selectedLandPlot) {
            updateMutation.mutate(
                {
                    id: selectedLandPlot._id,
                    data,
                },
                {
                    onSuccess: handleClose,
                }
            );
        } else {
            addMutation.mutate(data, {
                onSuccess: handleClose,
            });
        }
    };

    return (
        <Dialog
            open={isOpen}
            onClose={handleClose}
            maxWidth="xl"
            fullWidth
            PaperProps={{
                sx: {
                    width: "95vw",
                    maxWidth: 1700,
                    height: "90vh",
                },
            }}
        >
            {/* ================= HEADER ================= */}

            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    borderBottom: "1px solid",
                    borderColor: "divider",
                    px: 3,
                    py: 2,
                }}
            >
                <Typography variant="h6" fontWeight={700}>
                    {selectedLandPlot
                        ? "Редагування земельної ділянки"
                        : "Нова земельна ділянка"}
                </Typography>

                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* ================= BODY ================= */}

            <DialogContent
                dividers
                sx={{
                    p: 0,
                    overflow: "hidden",
                }}
            >
                <Box
                    sx={{
                        display: "flex",
                        height: "100%",
                    }}
                >
                    {/* ================= LEFT ================= */}

                    <LandPlotInfoPanel
                        formData={formData}
                        handleChange={handleChange}
                        handleRootChange={handleRootChange}
                    />

                    <Divider orientation="vertical" flexItem />

                    {/* ================= RIGHT ================= */}

                    <LandPlotGeometryPanel
                        vertices={vertices}
                        setVertices={setVertices}
                    />

                </Box>
            </DialogContent>

            {/* ================= FOOTER ================= */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                    borderTop: "1px solid",
                    borderColor: "divider",
                }}
            >
                <Button
                    onClick={handleClose}
                    color="inherit"
                >
                    Скасувати
                </Button>

                <Button
                    variant="contained"
                    onClick={handleSave}
                >
                    {selectedLandPlot ? "Зберегти" : "Створити"}
                </Button>
            </DialogActions>
        </Dialog>
    );
}