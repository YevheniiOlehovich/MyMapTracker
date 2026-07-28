import React, { useMemo, useState } from "react";

import {
    usePlotsData,
    useDeletePlot,
} from "../../hooks/usePlotsData";

import { useDispatch } from "react-redux";
import {
    openAddLandPlotModal,
} from "../../store/modalSlice";
import {
    createColumnHelper,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
    flexRender,
} from "@tanstack/react-table";

import {
    Box,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
} from "@mui/material";

import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import { calculatePlotStats } from "./calculatePlotStats";
import PlotsToolbar from "../PlotsToolbar";
import { createPlotsColumns } from "./createPlotsColumns";

const columnHelper = createColumnHelper();

export default function PlotsTab() {
    const {
        data: plots = [],
        isLoading,
        isError,
        error,
    } = usePlotsData();

    const dispatch = useDispatch();
    const deleteMutation = useDeletePlot();

    const handleAdd = () => {
        dispatch(openAddLandPlotModal());
    };

    const handleEdit = (plot) => {
        dispatch(openAddLandPlotModal(plot));
    };

    const handleDelete = (plot) => {
        if (
            !window.confirm(
                `Видалити ділянку ${plot.plot?.cadnum || ""}?`
            )
        ) {
            return;
        }

        deleteMutation.mutate(plot._id);
    };

    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);

    const stats = useMemo(
        () => calculatePlotStats(plots),
        [plots]
    );

    const columns = useMemo(
        () =>
            createPlotsColumns({
                columnHelper,
                onEdit: handleEdit,
                onDelete: handleDelete,
            }),
        []
    );

    const table = useReactTable({
        data: plots,
        columns,
        state: {
            globalFilter,
            sorting,
        },
        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,
        getCoreRowModel: getCoreRowModel(),
        getFilteredRowModel:
            getFilteredRowModel(),
        getSortedRowModel:
            getSortedRowModel(),
    });

    if (isLoading)
        return <div>Завантаження...</div>;

    if (isError)
        return <div>Помилка: {error.message}</div>;

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                p: 2,
            }}
        >
            <PlotsToolbar
                globalFilter={globalFilter}
                onFilterChange={setGlobalFilter}
                onAdd={handleAdd}
                stats={stats}
            />

            {/* Таблиця */}
            <Paper
                sx={{
                    flexGrow: 1,
                    overflow: "hidden",
                    borderRadius: 2,
                    boxShadow: 3,
                    bgcolor: "rgba(255,255,255,0.9)",
                }}
            >
                <TableContainer sx={{ maxHeight: "100%" }}>
                    <Table stickyHeader size="small">
                        <TableHead>
                            {table.getHeaderGroups().map((headerGroup) => (
                                <TableRow key={headerGroup.id}>
                                    {headerGroup.headers.map((header) => (
                                        <TableCell
                                            key={header.id}
                                            onClick={header.column.getToggleSortingHandler()}
                                            sx={{
                                                cursor: header.column.getCanSort()
                                                    ? "pointer"
                                                    : "default",
                                                fontWeight: "bold",
                                                bgcolor: "rgba(240,240,240,0.95)",
                                                py: 0.75,
                                                px: 1,
                                                userSelect: "none",
                                            }}
                                        >
                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    alignItems: "center",
                                                    gap: 0.5,
                                                }}
                                            >
                                                {flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}

                                                {header.column.getCanSort() &&
                                                    (header.column.getIsSorted() ===
                                                    "asc" ? (
                                                        <ArrowUpwardIcon fontSize="small" />
                                                    ) : header.column.getIsSorted() ===
                                                    "desc" ? (
                                                        <ArrowDownwardIcon fontSize="small" />
                                                    ) : (
                                                        <UnfoldMoreIcon
                                                            fontSize="small"
                                                            sx={{ opacity: 0.4 }}
                                                        />
                                                    ))}
                                            </Box>
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableHead>

                        <TableBody>
                            {table.getRowModel().rows.map((row, i) => (
                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        bgcolor:
                                            i % 2 === 0
                                                ? "rgba(255,255,255,0.65)"
                                                : "rgba(255,255,255,0.95)",
                                    }}
                                >
                                    {row.getVisibleCells().map((cell) => (
                                        <TableCell
                                            key={cell.id}
                                            sx={{
                                                py: 0.75,
                                                px: 1,
                                            }}
                                        >
                                            {flexRender(
                                                cell.column.columnDef.cell,
                                                cell.getContext()
                                            )}
                                        </TableCell>
                                    ))}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            </Paper>
        </Box>
    );
}