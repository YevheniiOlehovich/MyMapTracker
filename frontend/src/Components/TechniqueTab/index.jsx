import React, { useMemo, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  useTechniquesData,
  useDeleteTechnique,
} from "../../hooks/useTechniquesData";
import { useGroupsData } from "../../hooks/useGroupsData";
import { useOperationsData } from "../../hooks/useOperationsData";
import { openAddTechniqueModal } from "../../store/modalSlice";

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

export default function TechniqueTab() {
  const dispatch = useDispatch();
  const userRole = useSelector((state) => state.user.role);
  const isGuest = userRole === "guest";

  const { data: techniques = [], isLoading, isError, error } =
    useTechniquesData();
  const { data: groups = [] } = useGroupsData();
  const { data: operations = [] } = useOperationsData();
  const deleteTechnique = useDeleteTechnique();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  // ---------- MAP ГРУП ----------
  const groupMap = useMemo(() => {
    return groups.reduce((acc, group) => {
      acc[group._id] = group.name;
      return acc;
    }, {});
  }, [groups]);

  // ---------- КОЛОНКИ ----------
  const columns = useMemo(() => {
    return [
      {
        id: "rowNumber",
        header: "#",
        accessorFn: (_, index) => index + 1,
        cell: (info) => info.row.index + 1,
      },

      columnHelper.accessor(
        (row) => groupMap[row.groupId] || "—",
        {
          id: "groupName",
          header: "Група",
        }
      ),

      columnHelper.accessor("name", {
        id: "name",
        header: "Назва",
        cell: (info) => info.getValue() || "—",
      }),

      columnHelper.accessor("rfid", {
        id: "rfid",
        header: "RFID",
        cell: (info) => info.getValue() || "—",
      }),

      columnHelper.accessor("uniqNum", {
        id: "uniqNum",
        header: "Унікальний №",
        cell: (info) => info.getValue() || "—",
      }),

      columnHelper.accessor("width", {
        id: "width",
        header: "Ширина (м)",
        cell: (info) => info.getValue() || "—",
      }),

      columnHelper.accessor("speed", {
        id: "speed",
        header: "Швидкість (км/г)",
        cell: (info) => info.getValue() || "—",
      }),

      // 🔥 ВИВІД НАЗВИ ОПЕРАЦІЇ
      columnHelper.accessor(
        (row) => {
          if (!row.fieldOperation) return "—";

          const found = operations.find(
            (op) => String(op._id) === String(row.fieldOperation)
          );

          return found ? found.name : "—";
        },
        {
          id: "fieldOperation",
          header: "Тип операції",
        }
      ),

      columnHelper.accessor("note", {
        id: "note",
        header: "Примітка",
        cell: (info) => info.getValue() || "—",
      }),

      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            <IconButton
              size="small"
              color="primary"
              onClick={() =>
                dispatch(
                  openAddTechniqueModal({
                    techniqueId: info.row.original._id,
                  })
                )
              }
            >
              <EditIcon fontSize="small" />
            </IconButton>

            <IconButton
              size="small"
              color="error"
              onClick={() => {
                if (
                  window.confirm(
                    "Ви дійсно хочете видалити техніку?"
                  )
                ) {
                  deleteTechnique.mutate(info.row.original._id);
                }
              }}
              disabled={isGuest}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      },
    ];
  }, [groupMap, operations, isGuest, deleteTechnique, dispatch]);

  // ---------- TABLE ----------
  const table = useReactTable({
    data: techniques,
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
      {/* Пошук + Кнопка */}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          mb: 2,
          alignItems: "center",
        }}
      >
        <TextField
          size="small"
          placeholder="Пошук..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ width: 300 }}
        />

        <Button
          variant="contained"
          startIcon={<AddIcon />}
          onClick={() => dispatch(openAddTechniqueModal({}))}
          disabled={isGuest}
        >
          Додати
        </Button>
      </Box>

      {/* Таблиця */}
      <Paper sx={{ flexGrow: 1, overflow: "hidden" }}>
        <TableContainer sx={{ maxHeight: "calc(100vh - 220px)" }}>
          <Table stickyHeader size="small">
            <TableHead>
              {table.getHeaderGroups().map((headerGroup) => (
                <TableRow key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <TableCell
                      key={header.id}
                      onClick={header.column.getToggleSortingHandler()}
                      sx={{ cursor: "pointer", fontWeight: "bold" }}
                    >
                      <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}

                        {header.column.getIsSorted() === "asc" && (
                          <ArrowUpwardIcon fontSize="small" />
                        )}
                        {header.column.getIsSorted() === "desc" && (
                          <ArrowDownwardIcon fontSize="small" />
                        )}
                        {!header.column.getIsSorted() && (
                          <UnfoldMoreIcon fontSize="small" sx={{ opacity: 0.3 }} />
                        )}
                      </Box>
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableHead>

            <TableBody>
              {table.getRowModel().rows.map((row) => (
                <TableRow key={row.id} hover>
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
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
