import React, { useMemo, useState, useCallback } from "react";
import { useDispatch } from "react-redux";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getExpandedRowModel,
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
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TableContainer,
  TablePagination,
  MenuItem,
} from "@mui/material";

import ClearIcon from "@mui/icons-material/Clear";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";

import { useTasksData, useDeleteTask } from "../../hooks/useTasksData";
import { openAddTaskModal, openTaskReportModal } from "../../store/modalSlice";

import Header from "../Header";
import Modals from "../Modals";
import dayjs from "dayjs";
import bgPic from "../../assets/field_3.webp";

export default function TasksTab() {
  const dispatch = useDispatch();
  const { data: tasks = [], isLoading, isError, error } = useTasksData();
  const deleteTask = useDeleteTask();

  /* ---------- STATE ---------- */

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState({});
  const [columnFilters, setColumnFilters] = useState([]);

  const columnHelper = createColumnHelper();

  /* ---------- HANDLERS ---------- */

  const handleAdd = useCallback(() => {
    dispatch(openAddTaskModal());
  }, [dispatch]);

  const handleEdit = useCallback(
    (id) => dispatch(openAddTaskModal(id)),
    [dispatch]
  );

  const handleDelete = useCallback(
    (id) => {
      if (window.confirm("Видалити таск?")) {
        deleteTask.mutate(id);
      }
    },
    [deleteTask]
  );

  const handleReport = useCallback(
    (task) => dispatch(openTaskReportModal(task)),
    [dispatch]
  );

  /* ---------- HELPERS ---------- */

  const formatNumber = (value) => {
    if (value == null) return "—";
    const num = Number(value);
    return isNaN(num) ? "—" : num.toFixed(2);
  };

  const renderCompact = (row, key, formatter) => {
    const list = row.assignments;
    if (!list?.length) return "—";

    const first = list[0]?.[key];
    const count = list.length - 1;

    if (!first) return "—";

    try {
      const label = formatter(first);
      return count > 0 ? `${label} +${count}` : label;
    } catch {
      return "—";
    }
  };

  /* ---------- COLUMNS ---------- */

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.order ?? 0, {
        id: "order",
        header: "#",
      }),

      columnHelper.accessor((row) => row.startDate, {
        id: "startDate",
        header: "Дата",
        cell: (info) => dayjs(info.getValue()).format("DD.MM.YYYY"),
        filterFn: (row, columnId, value) => {
          if (!value) return true;

          const date = dayjs(row.getValue(columnId));
          const from = value.from ? dayjs(value.from) : null;
          const to = value.to ? dayjs(value.to) : null;

          if (from && date.isBefore(from, "day")) return false;
          if (to && date.isAfter(to, "day")) return false;

          return true;
        },
      }),

      columnHelper.accessor(
        (row) => row.fieldId?.properties?.name || "—",
        { id: "field", header: "Поле", filterFn: "equalsString" }
      ),

      columnHelper.accessor(
        (row) => row.operationId?.name || "—",
        { id: "operation", header: "Операція", filterFn: "equalsString" }
      ),

      columnHelper.accessor(
        (row) =>
          row.assignments?.map(
            (a) =>
              `${a.personnelId?.lastName || ""} ${a.personnelId?.firstName || ""}`.trim()
          ) || [],
        {
          id: "executor",
          header: "Працівник",
          cell: (info) => {
            const list = info.getValue();
            if (!list.length) return "—";

            const first = list[0];
            const count = list.length - 1;
            return count > 0 ? `${first} +${count}` : first;
          },
          filterFn: (row, columnId, value) => {
            if (!value) return true;
            const list = row.getValue(columnId);
            return list?.includes(value);
          },
        }
      ),

      columnHelper.accessor("status", { header: "Статус" }),

      columnHelper.accessor(
        (row) =>
          renderCompact(row, "vehicleId", (v) =>
            `${v.mark} (${v.regNumber})`
          ),
        { id: "vehicle", header: "Транспорт" }
      ),

      columnHelper.accessor(
        (row) => renderCompact(row, "techniqueId", (t) => t.name),
        { id: "technique", header: "Техніка" }
      ),

      columnHelper.accessor(
        (row) => row.fieldId?.properties?.area,
        {
          id: "area",
          header: "Площа",
          cell: (info) => formatNumber(info.getValue()),
        }
      ),

      columnHelper.accessor(
        (row) => row.processedArea,
        {
          id: "processedArea",
          header: "Оброблено",
          cell: (info) => formatNumber(info.getValue()),
        }
      ),

      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => {
          const task = info.row.original;
          return (
            <Box sx={{ display: "flex", gap: 0.5 }}>
              <IconButton onClick={() => handleEdit(task._id)}>
                <EditIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleDelete(task._id)}>
                <DeleteIcon fontSize="small" />
              </IconButton>
              <IconButton onClick={() => handleReport(task)}>
                <DescriptionIcon fontSize="small" />
              </IconButton>
            </Box>
          );
        },
      },
    ],
    [handleEdit, handleDelete, handleReport]
  );

  /* ---------- TABLE ---------- */

  const table = useReactTable({
    data: tasks,
    columns,
    state: { globalFilter, sorting, expanded, columnFilters },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    onColumnFiltersChange: setColumnFilters,
    getRowCanExpand: (row) => row.original.assignments?.length > 1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  /* ---------- FILTER VALUES ---------- */

  const fields = [...new Set(tasks.map(t => t.fieldId?.properties?.name).filter(Boolean))];
  const operations = [...new Set(tasks.map(t => t.operationId?.name).filter(Boolean))];

  const personnel = [
    ...new Set(
      tasks.flatMap((t) =>
        t.assignments?.map(
          (a) =>
            `${a.personnelId?.lastName || ""} ${a.personnelId?.firstName || ""}`.trim()
        )
      )
    ),
  ].filter(Boolean);

  const dateFilter = table.getColumn("startDate")?.getFilterValue() || {};

  const resetFilters = () => {
    setColumnFilters([]);
    setGlobalFilter("");
  };

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <Box sx={{ minHeight: "100vh", backgroundImage: `url(${bgPic})`, backgroundSize: "cover" }}>
      <Header />

      <Box sx={{ p: "80px 20px 20px" }}>
        <Paper sx={{ p: 2, mb: 2 }}>
          <Box
            sx={{
              display: "grid",
              gridTemplateColumns: { xs: "1fr", md: "repeat(7, 1fr)" },
              gap: 2,
            }}
          >
            {/* Поле */}
            <TextField
              label="Поле"
              select
              size="small"
              value={table.getColumn("field")?.getFilterValue() || ""}
              onChange={(e) =>
                table.getColumn("field")?.setFilterValue(e.target.value || undefined)
              }
            >
              <MenuItem value="">Всі</MenuItem>
              {fields.map((f) => (
                <MenuItem key={f} value={f}>{f}</MenuItem>
              ))}
            </TextField>

            {/* Операція */}
            <TextField
              label="Операція"
              select
              size="small"
              value={table.getColumn("operation")?.getFilterValue() || ""}
              onChange={(e) =>
                table.getColumn("operation")?.setFilterValue(e.target.value || undefined)
              }
            >
              <MenuItem value="">Всі</MenuItem>
              {operations.map((o) => (
                <MenuItem key={o} value={o}>{o}</MenuItem>
              ))}
            </TextField>

            {/* Працівник */}
            <TextField
              label="Працівник"
              select
              size="small"
              value={table.getColumn("executor")?.getFilterValue() || ""}
              onChange={(e) =>
                table.getColumn("executor")?.setFilterValue(e.target.value || undefined)
              }
            >
              <MenuItem value="">Всі</MenuItem>
              {personnel.map((p) => (
                <MenuItem key={p} value={p}>{p}</MenuItem>
              ))}
            </TextField>

            {/* Дати */}
            <TextField
              type="date"
              size="small"
              label="Від"
              InputLabelProps={{ shrink: true }}
              value={dateFilter.from || ""}
              onChange={(e) =>
                table.getColumn("startDate")?.setFilterValue({
                  ...dateFilter,
                  from: e.target.value,
                })
              }
            />

            <TextField
              type="date"
              size="small"
              label="До"
              InputLabelProps={{ shrink: true }}
              value={dateFilter.to || ""}
              onChange={(e) =>
                table.getColumn("startDate")?.setFilterValue({
                  ...dateFilter,
                  to: e.target.value,
                })
              }
            />

            {/* Пошук */}
            <TextField
              size="small"
              placeholder="Пошук..."
              value={globalFilter}
              onChange={(e) => setGlobalFilter(e.target.value)}
            />

            {/* Кнопки */}
            <Box sx={{ display: "flex", gap: 1 }}>
              <Button variant="contained" onClick={handleAdd} fullWidth>
                + Додати
              </Button>
              <IconButton onClick={resetFilters} color="error">
                <ClearIcon />
              </IconButton>
            </Box>
          </Box>
        </Paper>

        {/* TABLE (залишив без змін) */}
        <Paper sx={{ height: 650, display: "flex", flexDirection: "column" }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader size="small">
              <TableHead>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableCell key={header.id}>
                        {flexRender(header.column.columnDef.header, header.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>

              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      hover
                      onClick={() => row.getCanExpand() && row.toggleExpanded()}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(cell.column.columnDef.cell, cell.getContext())}
                        </TableCell>
                      ))}
                    </TableRow>

                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell colSpan={row.getVisibleCells().length}>
                          <Box sx={{ background: "#f5f5f5", p: 1 }}>
                            {row.original.assignments.map((a, i) => (
                              <Box key={i}>
                                <strong>Екіпаж {i + 1}</strong> —{" "}
                                {a.personnelId?.lastName} {a.personnelId?.firstName} |{" "}
                                {a.vehicleId?.mark} ({a.vehicleId?.regNumber}) |{" "}
                                {a.techniqueId?.name}
                              </Box>
                            ))}
                          </Box>
                        </TableCell>
                      </TableRow>
                    )}
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <TablePagination
            component="div"
            count={tasks.length}
            page={table.getState().pagination.pageIndex}
            onPageChange={(_, p) => table.setPageIndex(p)}
            rowsPerPage={table.getState().pagination.pageSize}
            onRowsPerPageChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
          />
        </Paper>
      </Box>

      <Modals />
    </Box>
  );
}