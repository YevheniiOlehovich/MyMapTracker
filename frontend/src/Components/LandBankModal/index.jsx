import { useMemo } from "react";
import { useRent2026Data } from "../../hooks/useRent2026";
import { usePropertiesData } from "../../hooks/usePropertiesData";

import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Paper,
    Box,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";

export default function LandBankModal({ onClose }) {
    const {
        data: rentData = [],
        isLoading: rentLoading,
        error: rentError,
    } = useRent2026Data();

    const {
        data: propertyData = [],
        isLoading: propertyLoading,
        error: propertyError,
    } = usePropertiesData();

    const rows = useMemo(() => {
        return [
            ...propertyData.map((item) => ({
                ...item,
                recordType: "Власність",
            })),
            ...rentData.map((item) => ({
                ...item,
                recordType: "Оренда",
            })),
        ];
    }, [propertyData, rentData]);

    const stats = useMemo(() => {
        const result = {
            totalCount: 0,
            totalArea: 0,

            rentCount: 0,
            rentArea: 0,

            propertyCount: 0,
            propertyArea: 0,

            krokArea: 0,
            ladaArea: 0,
        };

        propertyData.forEach((item) => {
            const area = Number(item.plot?.area || 0);

            result.totalCount++;
            result.propertyCount++;

            result.totalArea += area;
            result.propertyArea += area;

            if (item.source === "КРОК")
                result.krokArea += area;

            if (item.source === "ЛАДА")
                result.ladaArea += area;
        });

        rentData.forEach((item) => {
            const area = Number(item.plot?.area || 0);

            result.totalCount++;
            result.rentCount++;

            result.totalArea += area;
            result.rentArea += area;

            if (item.source === "КРОК")
                result.krokArea += area;

            if (item.source === "ЛАДА")
                result.ladaArea += area;
        });

        return result;
    }, [propertyData, rentData]);

    if (rentLoading || propertyLoading)
        return <p>Завантаження...</p>;

    if (rentError)
        return <p>{rentError.message}</p>;

    if (propertyError)
        return <p>{propertyError.message}</p>;


        return (
        <Dialog
            open
            onClose={onClose}
            maxWidth="xl"
            fullWidth
        >
            <DialogTitle
                sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                }}
            >
                Земельний банк

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>

                <Box
                    sx={{
                        mb: 3,
                        display: "flex",
                        flexWrap: "wrap",
                        gap: 3,
                    }}
                >
                    <Paper sx={{ p: 2, minWidth: 220 }}>
                        <Typography variant="h6">
                            Загалом
                        </Typography>

                        <Typography>
                            Ділянок: <b>{stats.totalCount}</b>
                        </Typography>

                        <Typography>
                            Площа:{" "}
                            <b>{stats.totalArea.toFixed(4)} га</b>
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, minWidth: 220 }}>
                        <Typography variant="h6">
                            Оренда
                        </Typography>

                        <Typography>
                            Ділянок: <b>{stats.rentCount}</b>
                        </Typography>

                        <Typography>
                            Площа:{" "}
                            <b>{stats.rentArea.toFixed(4)} га</b>
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, minWidth: 220 }}>
                        <Typography variant="h6">
                            Власність
                        </Typography>

                        <Typography>
                            Ділянок: <b>{stats.propertyCount}</b>
                        </Typography>

                        <Typography>
                            Площа:{" "}
                            <b>{stats.propertyArea.toFixed(4)} га</b>
                        </Typography>
                    </Paper>

                    <Paper sx={{ p: 2, minWidth: 220 }}>
                        <Typography variant="h6">
                            По організаціях
                        </Typography>

                        <Typography color="primary">
                            КРОК:{" "}
                            <b>{stats.krokArea.toFixed(4)} га</b>
                        </Typography>

                        <Typography color="success.main">
                            ЛАДА:{" "}
                            <b>{stats.ladaArea.toFixed(4)} га</b>
                        </Typography>
                    </Paper>
                </Box>

                <TableContainer component={Paper}>
                    <Table size="small">

                        <TableHead>
                            <TableRow>
                                <TableCell>Тип</TableCell>
                                <TableCell>Власник</TableCell>
                                <TableCell>Організація</TableCell>
                                <TableCell>Кадастровий номер</TableCell>
                                <TableCell>Тип ділянки</TableCell>
                                <TableCell align="right">
                                    Площа
                                </TableCell>
                                <TableCell>
                                    Кінець договору
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {rows.map((item) => (
                                <TableRow
                                    key={`${item.recordType}-${item._id}`}
                                    hover
                                >
                                    <TableCell>
                                        <b>{item.recordType}</b>
                                    </TableCell>

                                    <TableCell>
                                        {item.owner?.name}
                                    </TableCell>

                                    <TableCell>
                                        {item.source}
                                    </TableCell>

                                    <TableCell>
                                        {item.plot?.cadnum}
                                    </TableCell>

                                    <TableCell>
                                        {item.plot?.plotType}
                                    </TableCell>

                                    <TableCell align="right">
                                        {Number(item.plot?.area || 0).toFixed(4)}
                                    </TableCell>

                                    <TableCell>
                                        {item.recordType === "Оренда"
                                            ? item.agreement?.endDate
                                            : ""}
                                    </TableCell>
                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                </TableContainer>

            </DialogContent>

            <DialogActions>
                <Button
                    variant="contained"
                    onClick={onClose}
                >
                    Закрити
                </Button>
            </DialogActions>
        </Dialog>
    );
}