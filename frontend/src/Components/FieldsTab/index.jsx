import React, { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";

import { useFieldsData } from "../../hooks/useFieldsData";
import {
    setSelectedField,
    openAddFieldsModal,
} from "../../store/modalSlice";

import {
    createColumnHelper,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getSortedRowModel,
    useReactTable,
} from "@tanstack/react-table";

import {
    Box,
    Paper,
    TextField,
    IconButton,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    InputAdornment,
    Typography,
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

const columnHelper = createColumnHelper();

export default function FieldsTab() {

    const dispatch = useDispatch();

    const {
        data: fieldsData = [],
        isLoading,
        isError,
        error,
    } = useFieldsData();

    const [globalFilter, setGlobalFilter] = useState("");
    const [sorting, setSorting] = useState([]);

    const handleEdit = useCallback((field) => {
        dispatch(setSelectedField(field._id));
        dispatch(openAddFieldsModal());
    }, [dispatch]);

    const columns = useMemo(() => [
        {
            id: "rowNumber",
            header: "#",
            accessorFn: (_, index) => index + 1,
            cell: (info) => info.getValue(),
            size: 50,
        },

        columnHelper.accessor(
            (row) => row.properties?.name || "—",
            {
                id: "name",
                header: "Назва",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.region || "—",
            {
                id: "region",
                header: "Регіон",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.area || "—",
            {
                id: "area",
                header: "Площа (заявл.)",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.calculated_area || "—",
            {
                id: "calc_area",
                header: "Площа (розрах.)",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.culture || "—",
            {
                id: "culture",
                header: "Культура",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.sort || "—",
            {
                id: "sort",
                header: "Сорт",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.date || "—",
            {
                id: "date",
                header: "Дата",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.mapkey || "—",
            {
                id: "mapkey",
                header: "Ключ карти",
            }
        ),

        columnHelper.accessor(
            (row) => row.properties?.note || "—",
            {
                id: "note",
                header: "Примітка",
            }
        ),

        {
            id: "actions",
            header: "Дії",
            enableSorting: false,

            cell: ({ row }) => (
                <IconButton
                    size="small"
                    color="primary"
                    onClick={() => handleEdit(row.original)}
                >
                    <EditIcon fontSize="small" />
                </IconButton>
            ),
        },

    ], [handleEdit]);

    const table = useReactTable({
        data: fieldsData,
        columns,

        state: {
            globalFilter,
            sorting,
        },

        onGlobalFilterChange: setGlobalFilter,
        onSortingChange: setSorting,

        getCoreRowModel: getCoreRowModel(),
        getSortedRowModel: getSortedRowModel(),
        getFilteredRowModel: getFilteredRowModel(),
    });

    if (isLoading) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Typography>Завантаження...</Typography>
            </Box>
        );
    }

    if (isError) {
        return (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    height: "100%",
                }}
            >
                <Typography color="error">
                    Помилка: {error?.message}
                </Typography>
            </Box>
        );
    }

    return (
              <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
                minHeight: 0,
                gap: 2,
            }}
        >
            {/* Пошук */}

            <Box>
                <TextField
                    size="small"
                    placeholder="Пошук..."
                    value={globalFilter}
                    onChange={(e) => setGlobalFilter(e.target.value)}
                    sx={{
                        width: 320,
                        bgcolor: "background.paper",
                    }}
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon color="action" />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            {/* Таблиця */}

            <Paper
                elevation={2}
                sx={{
                    flex: 1,
                    minHeight: 0,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                    borderRadius: 2,
                }}
            >
                <TableContainer
                    sx={{
                        flex: 1,
                        minHeight: 0,
                    }}
                >
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
                                                userSelect: "none",
                                                fontWeight: 700,
                                                whiteSpace: "nowrap",
                                                bgcolor: "grey.100",
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

                                                {header.column.getCanSort() && (
                                                    header.column.getIsSorted() === "asc" ? (
                                                        <ArrowUpwardIcon fontSize="small" />
                                                    ) : header.column.getIsSorted() === "desc" ? (
                                                        <ArrowDownwardIcon fontSize="small" />
                                                    ) : (
                                                        <UnfoldMoreIcon
                                                            fontSize="small"
                                                            sx={{ opacity: 0.35 }}
                                                        />
                                                    )
                                                )}

                                            </Box>

                                        </TableCell>

                                    ))}

                                </TableRow>

                            ))}

                        </TableHead>

                        <TableBody>

                            {table.getRowModel().rows.map((row, index) => (

                                <TableRow
                                    key={row.id}
                                    hover
                                    sx={{
                                        "&:nth-of-type(even)": {
                                            bgcolor: "grey.50",
                                        },
                                    }}
                                >

                                    {row.getVisibleCells().map((cell) => (

                                        <TableCell
                                            key={cell.id}
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