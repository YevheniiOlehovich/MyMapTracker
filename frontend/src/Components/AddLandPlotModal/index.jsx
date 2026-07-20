import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    IconButton,
    Paper,
    Typography,
    Stack,
    TextField,
    Button,
    Box,
    Divider,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import {
    closeAddLandPlotModal,
} from "../../store/modalSlice";
import {
    useAddRent2026,
    useUpdateRent2026,
} from "../../hooks/useRent2026";

export default function AddLandPlotModal() {
    const dispatch = useDispatch();

    const isOpen = useSelector(
        (state) => state.modals.isAddLandPlotModalVisible
    );

    const selectedLandPlot = useSelector(
        (state) => state.modals.selectedLandPlot
    );

    const handleClose = () => {
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

    useEffect(() => {
        if (selectedLandPlot) {
            setFormData(selectedLandPlot);
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
        if (selectedLandPlot) {
            updateMutation.mutate(
                {
                    id: selectedLandPlot._id,
                    data: formData,
                },
                {
                    onSuccess: handleClose,
                }
            );
        } else {
            addMutation.mutate(formData, {
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

                    <Box
                        sx={{
                            width: "50%",
                            p: 3,
                            overflowY: "auto",
                            bgcolor: "#fafafa",
                        }}
                    >
                        {/* ===== Власник ===== */}

                        <FormControl fullWidth>
                            <InputLabel>Джерело</InputLabel>

                            <Select
                                label="Джерело"
                                value={formData.source}
                                onChange={handleRootChange("source")}
                            >
                                <MenuItem value="КРОК">КРОК</MenuItem>
                                <MenuItem value="ЛАДА">ЛАДА</MenuItem>
                            </Select>
                        </FormControl>                   

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                👤 Власник
                            </Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="ПІБ"
                                    fullWidth
                                    value={formData.owner.name}
                                    onChange={handleChange("owner", "name")}
                                />

                                <TextField
                                    label="Телефон"
                                    fullWidth
                                    value={formData.owner.phone}
                                    onChange={handleChange("owner", "phone")}
                                />

                                <TextField
                                    label="ІПН"
                                    fullWidth
                                    value={formData.owner.taxNumber}
                                    onChange={handleChange("owner", "taxNumber")}
                                />

                                <TextField
                                    label="Паспорт"
                                    fullWidth
                                    value={formData.owner.passport}
                                    onChange={handleChange("owner", "passport")}
                                />

                                <TextField
                                    label="Адреса"
                                    fullWidth
                                    multiline
                                    minRows={2}
                                    value={formData.owner.address}
                                    onChange={handleChange("owner", "address")}
                                />
                            </Stack>
                        </Paper>

                        {/* ===== Документ ===== */}

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                📄 Документ
                            </Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="Тип документа"
                                    fullWidth
                                    value={formData.document.documentType}
                                    onChange={handleChange("document", "documentType")}
                                />

                                <TextField
                                    label="Номер документа"
                                    fullWidth
                                    value={formData.document.documentNumber}
                                    onChange={handleChange("document", "documentNumber")}
                                />

                                <TextField
                                    label="Реєстраційний номер"
                                    fullWidth
                                    value={formData.document.registrationNumber}
                                    onChange={handleChange("document", "registrationNumber")}
                                />

                                <TextField
                                    label="Дата реєстрації"
                                    fullWidth
                                    value={formData.document.registrationDate}
                                    onChange={handleChange("document", "registrationDate")}
                                />
                            </Stack>
                        </Paper>

                        {/* ===== Земельна ділянка ===== */}

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                🌾 Земельна ділянка
                            </Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="Кадастровий номер"
                                    fullWidth
                                    value={formData.plot.cadnum}
                                    onChange={handleChange("plot", "cadnum")}
                                />

                                <TextField
                                    label="Площа (га)"
                                    fullWidth
                                    value={formData.plot.area}
                                    onChange={handleChange("plot", "area")}
                                />

                                <TextField
                                    label="Тип угідь"
                                    fullWidth
                                    value={formData.plot.plotType}
                                    onChange={handleChange("plot", "plotType")}
                                />

                                <TextField
                                    label="Нормативна грошова оцінка"
                                    fullWidth
                                    value={formData.plot.normativeValuation}
                                    onChange={handleChange("plot", "normativeValuation")}
                                />
                            </Stack>
                        </Paper>

                        {/* ===== Договір ===== */}

                        <Paper sx={{ p: 2, mb: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                📝 Договір
                            </Typography>

                            <Stack spacing={2}>
                                <TextField
                                    label="Номер договору"
                                    fullWidth
                                    value={formData.agreement.contractNumber}
                                    onChange={handleChange("agreement", "contractNumber")}
                                />

                                <TextField
                                    label="Дата підписання"
                                    fullWidth
                                    value={formData.agreement.signDate}
                                    onChange={handleChange("agreement", "signDate")}
                                />

                                <TextField
                                    label="Дата реєстрації ДЗК"
                                    fullWidth
                                    value={formData.agreement.registrationDateDZK}
                                    onChange={handleChange("agreement", "registrationDateDZK")}
                                />

                                <TextField
                                    label="Дата закінчення"
                                    fullWidth
                                    value={formData.agreement.endDate}
                                    onChange={handleChange("agreement", "endDate")}
                                />

                                <TextField
                                    label="Строк (років)"
                                    fullWidth
                                    value={formData.agreement.termYears}
                                    onChange={handleChange("agreement", "termYears")}
                                />

                                <TextField
                                    label="% орендної плати"
                                    fullWidth
                                    value={formData.agreement.rentPercent}
                                    onChange={handleChange("agreement", "rentPercent")}
                                />

                                <TextField
                                    label="Інформація про припинення"
                                    fullWidth
                                    value={formData.agreement.terminationInfo}
                                    onChange={handleChange("agreement", "terminationInfo")}
                                />
                            </Stack>
                        </Paper>

                        {/* ===== Примітка ===== */}

                        <Paper sx={{ p: 2 }}>
                            <Typography variant="h6" gutterBottom>
                                🗒 Примітка
                            </Typography>

                            <TextField
                                fullWidth
                                multiline
                                minRows={4}
                                value={formData.note}
                                onChange={handleRootChange("note")}
                            />
                        </Paper>
                    </Box>

                    <Divider orientation="vertical" flexItem />

                    {/* ================= RIGHT ================= */}

                    <Box
                        sx={{
                            width: "50%",
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            bgcolor: "#f5f5f5",
                        }}
                    >
                        <Typography
                            variant="h6"
                            color="text.secondary"
                        >
                            Тут буде карта земельної ділянки
                        </Typography>
                    </Box>
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