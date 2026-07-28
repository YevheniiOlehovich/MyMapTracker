import { useMemo } from "react";
import { usePlotsData } from "../../hooks/usePlotsData";

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
        data: plotsData = [],
        isLoading,
        error,
    } = usePlotsData();

    const rows = useMemo(() => {
        return [...plotsData].sort((a, b) => {

            if (a.ownershipType !== b.ownershipType) {
                return a.ownershipType === "own" ? -1 : 1;
            }

            return (a.owner?.name || "").localeCompare(
                b.owner?.name || "",
                "uk"
            );
        });
    }, [plotsData]);

    const stats = useMemo(() => {

        const result = {
            totalCount: 0,
            totalArea: 0,

            rentCount: 0,
            rentArea: 0,

            ownCount: 0,
            ownArea: 0,

            krokCount: 0,
            krokArea: 0,

            ladaCount: 0,
            ladaArea: 0,
        };

        plotsData.forEach((item) => {

            const area = Number(item.plot?.area || 0);

            result.totalCount++;
            result.totalArea += area;

            if (item.ownershipType === "rent") {

                result.rentCount++;
                result.rentArea += area;

                if (item.source === "КРОК") {
                    result.krokCount++;
                    result.krokArea += area;
                }

                if (item.source === "ЛАДА") {
                    result.ladaCount++;
                    result.ladaArea += area;
                }

            } else {

                result.ownCount++;
                result.ownArea += area;

            }

        });

        return result;

    }, [plotsData]);

    if (isLoading)
        return <Typography sx={{ p: 3 }}>Завантаження...</Typography>;

    if (error)
        return (
            <Typography color="error" sx={{ p: 3 }}>
                {error.message}
            </Typography>
        );

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

            {/* СТАТИСТИКА */}

            <Box
                sx={{
                    mb: 3,
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 2,
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
                        Площа: <b>{stats.totalArea.toFixed(4)} га</b>
                    </Typography>
                </Paper>

                <Paper sx={{ p: 2, minWidth: 220 }}>
                    <Typography
                        variant="h6"
                        color="warning.main"
                    >
                        Оренда
                    </Typography>

                    <Typography>
                        Ділянок: <b>{stats.rentCount}</b>
                    </Typography>

                    <Typography>
                        Площа: <b>{stats.rentArea.toFixed(4)} га</b>
                    </Typography>
                </Paper>

                <Paper sx={{ p: 2, minWidth: 220 }}>
                    <Typography
                        variant="h6"
                        color="success.main"
                    >
                        Власність
                    </Typography>

                    <Typography>
                        Ділянок: <b>{stats.ownCount}</b>
                    </Typography>

                    <Typography>
                        Площа: <b>{stats.ownArea.toFixed(4)} га</b>
                    </Typography>
                </Paper>

                <Paper sx={{ p: 2, minWidth: 240 }}>
                    <Typography variant="h6">
                        Оренда по організаціях
                    </Typography>

                    <Typography color="primary">
                        КРОК:
                        {" "}
                        <b>
                            {stats.krokCount} (
                            {stats.krokArea.toFixed(4)} га)
                        </b>
                    </Typography>

                    <Typography color="secondary">
                        ЛАДА:
                        {" "}
                        <b>
                            {stats.ladaCount} (
                            {stats.ladaArea.toFixed(4)} га)
                        </b>
                    </Typography>
                </Paper>

            </Box>

            {/* ТАБЛИЦЯ */}

            <TableContainer component={Paper}>
                <Table size="small">

                    <TableHead>
                        <TableRow>
                            <TableCell>Тип</TableCell>
                            <TableCell>Власник</TableCell>
                            <TableCell>Організація</TableCell>
                            <TableCell>Кадастровий номер</TableCell>
                            <TableCell>Тип угідь</TableCell>
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
                                key={item._id}
                                hover
                            >

                                <TableCell>

                                    <Typography
                                        fontWeight={700}
                                        color={
                                            item.ownershipType === "own"
                                                ? "success.main"
                                                : "warning.main"
                                        }
                                    >
                                        {item.ownershipType === "own"
                                            ? "Власність"
                                            : "Оренда"}
                                    </Typography>

                                </TableCell>

                                <TableCell>
                                    {item.owner?.name || "-"}
                                </TableCell>

                                <TableCell>

                                    {item.ownershipType === "rent"
                                        ? item.source
                                        : "-"}

                                </TableCell>

                                <TableCell>
                                    {item.plot?.cadnum}
                                </TableCell>

                                <TableCell>
                                    {item.plot?.plotType}
                                </TableCell>

                                <TableCell align="right">
                                    {Number(
                                        item.plot?.area || 0
                                    ).toFixed(4)}
                                </TableCell>

                                <TableCell>

                                    {item.ownershipType === "rent"
                                        ? item.agreement?.endDate
                                        : "-"}

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
)}