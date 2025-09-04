import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useFieldsData } from "../../hooks/useFieldsData";
import { setSelectedField, openAddFieldsModal } from "../../store/modalSlice";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  useReactTable,
  flexRender,
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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export default function FieldsTab() {
  const dispatch = useDispatch();
  const { data: fieldsData = [], isLoading, isError, error } = useFieldsData();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  const handleEdit = (field) => {
    dispatch(setSelectedField(field._id));
    dispatch(openAddFieldsModal());
  };

  const columns = useMemo(
    () => [
      { id: "rowNumber", header: "#", accessorFn: (row, index) => index + 1, cell: (info) => info.getValue() },
      columnHelper.accessor((row) => row.properties?.name || "—", { id: "name", header: "Назва" }),
      columnHelper.accessor((row) => row.properties?.region || "—", { id: "region", header: "Регіон" }),
      columnHelper.accessor((row) => row.properties?.area || "—", { id: "area", header: "Площа (заявл.)" }),
      columnHelper.accessor((row) => row.properties?.calculated_area || "—", { id: "calc_area", header: "Площа (розрах.)" }),
      columnHelper.accessor((row) => row.properties?.culture || "—", { id: "culture", header: "Культура" }),
      columnHelper.accessor((row) => row.properties?.sort || "—", { id: "sort", header: "Сорт" }),
      columnHelper.accessor((row) => row.properties?.date || "—", { id: "date", header: "Дата" }),
      columnHelper.accessor((row) => row.properties?.mapkey || "—", { id: "mapkey", header: "Ключ карти" }),
      columnHelper.accessor((row) => row.properties?.note || "—", { id: "note", header: "Примітка" }),
      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" color="primary" onClick={() => handleEdit(info.row.original)}>
              <EditIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleEdit]
  );

  const table = useReactTable({
    data: fieldsData,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
  });

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
      {/* Пошук */}
      <Box sx={{ display: "flex", mb: 2, alignItems: "center" }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Пошук по назві, культурі, ключу..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 320, bgcolor: "rgba(255,255,255,0.85)", borderRadius: 2, "& .MuiOutlinedInput-root": { borderRadius: 2 } }}
        />
      </Box>

      {/* Таблиця */}
      <Paper sx={{ flexGrow: 1, overflow: "hidden", borderRadius: 2, boxShadow: 3, bgcolor: "rgba(255,255,255,0.9)" }}>
        {/* <TableContainer sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
        <TableContainer>
          <Table stickyHeader size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{
                        cursor: header.column.getCanSort() ? "pointer" : "default",
                        fontWeight: "bold",
                        bgcolor: "rgba(240,240,240,0.9)",
                        py: 0.5,
                        px: 1,
                        userSelect: "none",
                      }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getCanSort() &&
                          (header.column.getIsSorted() === "asc" ? (
                            <ArrowUpwardIcon fontSize="small" />
                          ) : header.column.getIsSorted() === "desc" ? (
                            <ArrowDownwardIcon fontSize="small" />
                          ) : (
                            <UnfoldMoreIcon fontSize="small" sx={{ opacity: 0.4 }} />
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
                  sx={{ bgcolor: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)" }}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id} sx={{ py: 0.5, px: 1 }}>
                      {flexRender(cell.column.columnDef.cell, cell.getContext())}
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
