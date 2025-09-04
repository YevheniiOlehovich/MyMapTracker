import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useVehiclesData, useDeleteVehicle } from "../../hooks/useVehiclesData";
import { useGroupsData } from "../../hooks/useGroupsData";
import { openAddVehicleModal } from "../../store/modalSlice";
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
  Button,
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
import DeleteIcon from "@mui/icons-material/Delete";
import SearchIcon from "@mui/icons-material/Search";
import AddIcon from "@mui/icons-material/Add";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

import { vehicleTypes } from "../../helpres";

export default function VehiclesTab() {
  const dispatch = useDispatch();
  const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
  const { data: groups = [] } = useGroupsData();
  const deleteVehicle = useDeleteVehicle();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  const groupMap = useMemo(
    () => groups.reduce((acc, group) => ({ ...acc, [group._id]: group.name }), {}),
    [groups]
  );

  const vehicleTypeMap = useMemo(
    () => vehicleTypes.reduce((acc, vt) => ({ ...acc, [vt._id]: vt.name }), []),
    []
  );

  const handleAdd = () => dispatch(openAddVehicleModal({}));
  const handleEdit = (vehicleId) => dispatch(openAddVehicleModal({ vehicleId }));
  const handleDelete = (vehicleId) => {
    if (window.confirm("Ви дійсно хочете видалити цей транспортний засіб?")) {
      deleteVehicle.mutate(vehicleId, {
        onError: (err) => {
          console.error("Помилка при видаленні:", err);
          alert("Помилка видалення");
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      { id: "rowNumber", header: "#", accessorFn: (row, index) => index + 1, cell: (info) => info.getValue() },
      columnHelper.accessor((row) => groupMap[row.groupId] || "—", { id: "groupName", header: "Група" }),
      columnHelper.accessor("mark", { id: "mark", header: "Марка", cell: (info) => info.getValue() || "—" }),
      columnHelper.accessor("regNumber", {
        id: "regNumber",
        header: "Реєстраційний номер",
        cell: (info) => info.getValue() || "—",
      }),
      columnHelper.accessor((row) => vehicleTypeMap[row.vehicleType] || "—", {
        id: "vehicleType",
        header: "Тип транспорту",
      }),
      columnHelper.accessor("imei", { id: "imei", header: "IMEI", cell: (info) => info.getValue() || "—" }),
      columnHelper.accessor("note", { id: "note", header: "Примітка", cell: (info) => info.getValue() || "—" }),
      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton size="small" color="primary" onClick={() => handleEdit(info.row.original._id)}>
              <EditIcon fontSize="small" />
            </IconButton>
            <IconButton size="small" color="error" onClick={() => handleDelete(info.row.original._id)}>
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ],
    [handleEdit, handleDelete, groupMap, vehicleTypeMap]
  );

  const table = useReactTable({
    data: vehicles,
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
      {/* Пошук і кнопка */}
      <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2, alignItems: "center" }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Пошук по групі, марці, реєстрації..."
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
        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={handleAdd}
          sx={{ borderRadius: 2, textTransform: "none", fontWeight: "bold", boxShadow: 2 }}
        >
          Додати
        </Button>
      </Box>

      {/* Таблиця */}
      <Paper sx={{ flexGrow: 1, overflow: "hidden", borderRadius: 2, boxShadow: 3, bgcolor: "rgba(255,255,255,0.9)" }}>
        {/* <TableContainer sx={{ maxHeight: "calc(100vh - 220px)", overflowY: "auto" }}> */}
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
