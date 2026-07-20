import React, { useMemo, useState } from "react";
import {
    useRent2026Data,
    useDeleteRent2026,
} from "../../hooks/useRent2026";
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
    TextField,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    InputAdornment,
} from "@mui/material";

import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";
import IconButton from "@mui/material/IconButton";
import Button from "@mui/material/Button";
import AddIcon from "@mui/icons-material/Add";

export default function Rent2026Tab() {
    
    const {
        data: rent2026Data = [],
        isLoading,
        isError,
        error,
    } = useRent2026Data();

    const dispatch = useDispatch();
    const deleteMutation = useDeleteRent2026();

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

    const columnHelper = createColumnHelper();

    const totalArea = useMemo(() => {
        return rent2026Data
            .reduce((sum, rent) => {
                return sum + Number(rent.plot?.area || 0);
            }, 0)
            .toFixed(4);
    }, [rent2026Data]);

    const stats = useMemo(() => {
      let totalArea = 0;

      let krokArea = 0;
      let ladaArea = 0;

      let krokCount = 0;
      let ladaCount = 0;

      rent2026Data.forEach((item) => {
          const area = Number(item.plot?.area || 0);

          totalArea += area;

          if (item.source === "КРОК") {
              krokArea += area;
              krokCount++;
          }

          if (item.source === "ЛАДА") {
              ladaArea += area;
              ladaCount++;
          }
      });

      return {
          totalArea,
          totalCount: rent2026Data.length,

          krokArea,
          ladaArea,

          krokCount,
          ladaCount,
      };
  }, [rent2026Data]);

    const columns = useMemo(
        () => [
            {
                id: "rowNumber",
                header: "#",
                accessorFn: (row, index) => index + 1,
                cell: (info) => info.getValue(),
                size: 50,
            },

            columnHelper.accessor(
                (row) => row.source || "—",
                {
                    id: "source",
                    header: "Організація",
                }
            ),

            columnHelper.accessor(
                (row) => row.owner?.name || "—",
                {
                    id: "owner",
                    header: "Власник",
                }
            ),

            columnHelper.accessor(
                (row) => row.plot?.cadnum || "—",
                {
                    id: "cadnum",
                    header: "Кадастровий номер",
                }
            ),

            columnHelper.accessor(
                (row) => row.plot?.plotType || "—",
                {
                    id: "plotType",
                    header: "Тип угідь",
                }
            ),

            columnHelper.accessor(
                (row) => row.plot?.area,
                {
                    id: "area",
                    header: "Площа (га)",

                    cell: (info) => {
                        const value = Number(info.getValue());

                        return isNaN(value)
                            ? "—"
                            : value.toFixed(4);
                    },
                }
            ),

            columnHelper.accessor(
                (row) => row.plot?.normativeValuation,
                {
                    id: "valuation",
                    header: "Норм. оцінка",

                    cell: (info) => {
                        const value = Number(info.getValue());

                        return isNaN(value)
                            ? "—"
                            : value.toLocaleString("uk-UA", {
                                maximumFractionDigits: 0,
                            });
                    },
                }
            ),

            columnHelper.accessor(
                (row) => row.agreement?.rentPercent,
                {
                    id: "rentPercent",
                    header: "Оренда (%)",

                    cell: (info) =>
                        info.getValue() != null
                            ? `${info.getValue()} %`
                            : "—",
                }
            ),

            columnHelper.accessor(
                (row) => row.agreement?.endDate || "—",
                {
                    id: "endDate",
                    header: "Закінчення договору",
                }
            ),

            columnHelper.accessor(
                (row) => row.note || "—",
                {
                    id: "note",
                    header: "Нотатка",
                }
            ),

            columnHelper.display({
                id: "actions",
                header: "",

                size: 110,
                minSize: 110,
                maxSize: 110,

                enableSorting: false,

                cell: ({ row }) => (
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            gap: 0.5,
                        }}
                    >
                        <IconButton
                            size="small"
                            onClick={() => handleEdit(row.original)}
                        >
                            <EditOutlinedIcon
                                fontSize="small"
                                color="primary"
                            />
                        </IconButton>

                        <IconButton
                            size="small"
                            onClick={() => handleDelete(row.original)}
                        >
                            <DeleteOutlineIcon
                                fontSize="small"
                                color="error"
                            />
                        </IconButton>
                    </Box>
                ),
            }),
        ],
        []
    );

    const table = useReactTable({
        data: rent2026Data,
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
                            setGlobalFilter(e.target.value)
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
                        onClick={handleAdd}
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
                    <Paper
                        variant="outlined"
                        sx={{
                            width: 90,
                            py: 0.8,
                            px: 1,
                            textAlign: "center",
                            borderRadius: 2,
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                                lineHeight: 1,
                            }}
                        >
                            Всього
                        </Box>

                        <Box
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                        >
                            {stats.totalCount}
                        </Box>

                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                            }}
                        >
                            {stats.totalArea.toFixed(1)} га
                        </Box>
                    </Paper>

                    <Paper
                        variant="outlined"
                        sx={{
                            width: 90,
                            py: 0.8,
                            px: 1,
                            textAlign: "center",
                            borderRadius: 2,
                            borderTop: "3px solid",
                            borderColor: "primary.main",
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                                lineHeight: 1,
                            }}
                        >
                            КРОК
                        </Box>

                        <Box
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                        >
                            {stats.krokCount}
                        </Box>

                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                            }}
                        >
                            {stats.krokArea.toFixed(1)} га
                        </Box>
                    </Paper>

                    <Paper
                        variant="outlined"
                        sx={{
                            width: 90,
                            py: 0.8,
                            px: 1,
                            textAlign: "center",
                            borderRadius: 2,
                            borderTop: "3px solid",
                            borderColor: "success.main",
                        }}
                    >
                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                                lineHeight: 1,
                            }}
                        >
                            ЛАДА
                        </Box>

                        <Box
                            sx={{
                                fontSize: 18,
                                fontWeight: 700,
                                lineHeight: 1.2,
                            }}
                        >
                            {stats.ladaCount}
                        </Box>

                        <Box
                            sx={{
                                fontSize: 11,
                                color: "text.secondary",
                            }}
                        >
                            {stats.ladaArea.toFixed(1)} га
                        </Box>
                    </Paper>
                </Box>
            </Paper>

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