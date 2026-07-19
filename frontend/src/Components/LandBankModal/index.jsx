import { useMemo } from "react";
import { useRent2026Data } from "../../hooks/useRent2026";

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
        isLoading,
        error,
    } = useRent2026Data();

    const stats = useMemo(() => {
        let totalArea = 0;
        let krokArea = 0;
        let ladaArea = 0;

        rentData.forEach((item) => {
            const area = Number(item.plot?.area || 0);

            totalArea += area;

            if (item.source === "КРОК")
                krokArea += area;

            if (item.source === "ЛАДА")
                ladaArea += area;
        });

        return {
            totalArea,
            krokArea,
            ladaArea,
        };
    }, [rentData]);

    if (isLoading) return <p>Завантаження...</p>;
    if (error) return <p>{error.message}</p>;

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
                Земельний банк 2026

                <IconButton onClick={onClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>

                <TableContainer component={Paper}>
                    <Table size="small">

                        <TableHead>
                            <TableRow>
                                <TableCell>Власник</TableCell>
                                <TableCell>Організація</TableCell>
                                <TableCell>Кадастровий номер</TableCell>
                                <TableCell>Тип</TableCell>
                                <TableCell align="right">
                                    Площа
                                </TableCell>
                                <TableCell>
                                    Кінець договору
                                </TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {rentData.map((item) => (
                                <TableRow key={item._id} hover>

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
                                        {Number(item.plot?.area).toFixed(4)}
                                    </TableCell>

                                    <TableCell>
                                        {item.agreement?.endDate}
                                    </TableCell>

                                </TableRow>
                            ))}

                        </TableBody>

                    </Table>
                </TableContainer>

                <Box mt={3}>

                    <Typography>
                        Кількість ділянок: <b>{rentData.length}</b>
                    </Typography>

                    <Typography>
                        Загальна площа:{" "}
                        <b>{stats.totalArea.toFixed(4)} га</b>
                    </Typography>

                    <Typography color="primary">
                        КРОК:{" "}
                        <b>{stats.krokArea.toFixed(4)} га</b>
                    </Typography>

                    <Typography color="success.main">
                        ЛАДА:{" "}
                        <b>{stats.ladaArea.toFixed(4)} га</b>
                    </Typography>

                </Box>

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