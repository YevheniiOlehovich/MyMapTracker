import {
    Box,
    Button,
    InputAdornment,
    Paper,
    TextField,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";

import StatCard from "../StatCard";

export default function PlotsToolbar({
    globalFilter,
    onFilterChange,
    onAdd,
    stats,
}) {
    return (
        <Paper
            sx={{
                mb: 2,
                p: 1.5,
                borderRadius: 2,
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: 2,
                boxShadow: 2,
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    alignItems: "center",
                    gap: 1.5,
                }}
            >
                <TextField
                    size="small"
                    variant="outlined"
                    placeholder="Пошук..."
                    value={globalFilter}
                    onChange={(e) =>
                        onFilterChange(e.target.value)
                    }
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        width: 350,
                    }}
                />

                <Button
                    variant="contained"
                    startIcon={<AddIcon />}
                    onClick={onAdd}
                    sx={{
                        height: 40,
                        px: 2,
                        whiteSpace: "nowrap",
                        borderRadius: 2,
                        textTransform: "none",
                        fontWeight: 600,
                    }}
                >
                    Додати ділянку
                </Button>
            </Box>

            <Box
                sx={{
                    display: "flex",
                    gap: 1,
                    ml: "auto",
                }}
            >
                <StatCard
                    title="Всього"
                    count={stats.total.count}
                    area={stats.total.area}
                />

                <StatCard
                    title="Оренда"
                    count={stats.rent.count}
                    area={stats.rent.area}
                    color="warning.main"
                />

                <StatCard
                    title="Власність"
                    count={stats.own.count}
                    area={stats.own.area}
                    color="success.dark"
                />

                <StatCard
                    title="КРОК"
                    count={stats.krok.count}
                    area={stats.krok.area}
                    color="primary.main"
                />

                <StatCard
                    title="ЛАДА"
                    count={stats.lada.count}
                    area={stats.lada.area}
                    color="success.main"
                />

                <StatCard
                    title="Без геометрії"
                    count={stats.noGeometry.count}
                    area={stats.noGeometry.area}
                    color="error.main"
                />
            </Box>
        </Paper>
    );
}