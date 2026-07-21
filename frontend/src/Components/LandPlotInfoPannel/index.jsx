import React from "react";
import {
    Box,
    Paper,
    Typography,
    Stack,
    TextField,
    FormControl,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";

export default function LandPlotInfoPanel({
    formData,
    handleChange,
    handleRootChange,
}) {
    return (
        <Box
            sx={{
                width: "50%",
                p: 3,
                overflowY: "auto",
                bgcolor: "#fafafa",
            }}
        >
            <FormControl fullWidth sx={{ mb: 2 }}>
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

            {/* ================= OWNER ================= */}

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

            {/* ================= DOCUMENT ================= */}

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    📄 Документ
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Тип документа"
                        fullWidth
                        value={formData.document.documentType}
                        onChange={handleChange(
                            "document",
                            "documentType"
                        )}
                    />

                    <TextField
                        label="Номер документа"
                        fullWidth
                        value={formData.document.documentNumber}
                        onChange={handleChange(
                            "document",
                            "documentNumber"
                        )}
                    />

                    <TextField
                        label="Реєстраційний номер"
                        fullWidth
                        value={formData.document.registrationNumber}
                        onChange={handleChange(
                            "document",
                            "registrationNumber"
                        )}
                    />

                    <TextField
                        label="Дата реєстрації"
                        fullWidth
                        value={formData.document.registrationDate}
                        onChange={handleChange(
                            "document",
                            "registrationDate"
                        )}
                    />
                </Stack>
            </Paper>

            {/* ================= LAND PLOT ================= */}

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
                        onChange={handleChange(
                            "plot",
                            "normativeValuation"
                        )}
                    />
                </Stack>
            </Paper>

            {/* ================= AGREEMENT ================= */}

            <Paper sx={{ p: 2, mb: 2 }}>
                <Typography variant="h6" gutterBottom>
                    📝 Договір
                </Typography>

                <Stack spacing={2}>
                    <TextField
                        label="Номер договору"
                        fullWidth
                        value={formData.agreement.contractNumber}
                        onChange={handleChange(
                            "agreement",
                            "contractNumber"
                        )}
                    />

                    <TextField
                        label="Дата підписання"
                        fullWidth
                        value={formData.agreement.signDate}
                        onChange={handleChange(
                            "agreement",
                            "signDate"
                        )}
                    />

                    <TextField
                        label="Дата реєстрації ДЗК"
                        fullWidth
                        value={formData.agreement.registrationDateDZK}
                        onChange={handleChange(
                            "agreement",
                            "registrationDateDZK"
                        )}
                    />

                    <TextField
                        label="Дата закінчення"
                        fullWidth
                        value={formData.agreement.endDate}
                        onChange={handleChange(
                            "agreement",
                            "endDate"
                        )}
                    />

                    <TextField
                        label="Строк (років)"
                        fullWidth
                        value={formData.agreement.termYears}
                        onChange={handleChange(
                            "agreement",
                            "termYears"
                        )}
                    />

                    <TextField
                        label="% орендної плати"
                        fullWidth
                        value={formData.agreement.rentPercent}
                        onChange={handleChange(
                            "agreement",
                            "rentPercent"
                        )}
                    />

                    <TextField
                        label="Інформація про припинення"
                        fullWidth
                        value={formData.agreement.terminationInfo}
                        onChange={handleChange(
                            "agreement",
                            "terminationInfo"
                        )}
                    />
                </Stack>
            </Paper>

            {/* ================= NOTE ================= */}

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
    );
}