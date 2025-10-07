import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import {
  createColumnHelper,
  getCoreRowModel,
  getSortedRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
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
} from "@mui/material";

import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import DescriptionIcon from "@mui/icons-material/Description";

import { useTasksData, useDeleteTask } from "../../hooks/useTasksData";
import { useFieldsData } from "../../hooks/useFieldsData";
import { openAddTaskModal, openTaskReportModal } from "../../store/modalSlice";

import Header from "../Header";
import Modals from "../Modals";
import dayjs from "dayjs";
import bgPic from "../../assets/field_3.webp";

export default function TasksTab() {
  const dispatch = useDispatch();
  const { data: tasks = [], isLoading, isError, error } = useTasksData();
  useFieldsData();

  const deleteTask = useDeleteTask();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  const handleAdd = () => dispatch(openAddTaskModal());
  const handleEdit = (taskId) => dispatch(openAddTaskModal(taskId));

  const handleDelete = (taskId) => {
    if (window.confirm("Ви дійсно хочете видалити цей таск?")) {
      deleteTask.mutate(taskId, {
        onError: (err) => {
          console.error("Помилка при видаленні таска:", err);
          alert("Помилка видалення");
        },
      });
    }
  };

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.order ?? 0, { id: "order", header: "#" }),
      columnHelper.accessor((row) => row.groupId?.name || "—", { id: "group", header: "Група" }),
      columnHelper.accessor((row) => row.fieldId?.properties?.name || "—", { id: "field", header: "Поле" }),
      columnHelper.accessor((row) => row.operationId?.name || "—", { id: "operation", header: "Операція" }),
      columnHelper.accessor("status", { header: "Статус" }),
      columnHelper.accessor(
        (row) => (row.vehicleId ? `${row.vehicleId.mark} (${row.vehicleId.regNumber})` : "—"),
        { id: "vehicle", header: "Транспорт" }
      ),
      columnHelper.accessor((row) => row.techniqueId?.name || "—", { id: "technique", header: "Техніка" }),
      columnHelper.accessor(
        (row) => (row.personnelId ? `${row.personnelId.lastName} ${row.personnelId.firstName}` : "—"),
        { id: "executor", header: "Виконавець" }
      ),
      columnHelper.accessor((row) => row.cropId?.name || "—", { id: "crop", header: "Культура" }),
      columnHelper.accessor((row) => row.varietyId?.name || "—", { id: "variety", header: "Сорт" }),
      columnHelper.accessor("note", { header: "Примітка", cell: (info) => info.getValue() || "—" }),
      columnHelper.accessor(
        (row) => dayjs(row.createdAt).format("DD.MM.YYYY HH:mm"),
        { id: "createdAt", header: "Дата створення" }
      ),
      columnHelper.accessor(
        (row) => row.fieldId?.properties?.calculated_area ?? "—",
        {
          id: "area",
          header: "Площа (га)",
          cell: (info) => {
            const value = info.getValue();
            return typeof value === "number" ? value.toFixed(2) : value;
          },
        }
      ),
      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => (
          <Box sx={{ display: "flex", gap: 1 }}>
            {/* Edit */}
            <IconButton
              onClick={() => handleEdit(info.row.original._id)}
              size="small"
              sx={{
                color: "blue",
                "&:hover": {  transform: "scale(1.1)" },
              }}
            >
              <EditIcon fontSize="small" />
            </IconButton>

            {/* Delete */}
            <IconButton
              onClick={() => handleDelete(info.row.original._id)}
              size="small"
              sx={{
                color: "red",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <DeleteIcon fontSize="small" />
            </IconButton>

            {/* Report */}
            <IconButton
              onClick={() => dispatch(openTaskReportModal(info.row.original))}
              size="small"
              sx={{
                color: "green",
                "&:hover": { transform: "scale(1.1)" },
              }}
            >
              <DescriptionIcon fontSize="small" />
            </IconButton>
          </Box>
        ),
      }

    ],
    []
  );

  const table = useReactTable({
    data: tasks,
    columns,
    state: { globalFilter, sorting },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    initialState: { pagination: { pageSize: 20, pageIndex: 0 } },
  });

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        width: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundImage: `url(${bgPic})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Header />

      <Box
        sx={{
          position: "relative",
          left: "50%",
          transform: "translateX(-50%)",
          // maxWidth: 1400,
          width: "100%",
          display: "flex",
          flexDirection: "column",
          padding: "80px 20px 20px 20px",
        }}
      >
        {/* Верхня панель */}
        <Paper
          elevation={2}
          sx={{
            // mb: 2,
            borderRadius: 2,
            p: 2,
            display: "flex",
            justifyContent: "space-between",
            gap: 2,
            flexWrap: "wrap",
            borderTopLeftRadius: 8,
            borderTopRightRadius: 8,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
            border: "1px solid #ddd",
            bgcolor: "rgba(255,255,255,0.85)",
          }}
        >
          <TextField
            size="small"
            placeholder="Пошук..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            sx={{ width: 250 }}
          />
          <Button variant="contained" onClick={handleAdd} size="small">
            Додати
          </Button>
        </Paper>

        {/* Таблиця */}
        <Paper
          elevation={2}
          sx={{
            borderRadius: 2,
            border: "1px solid #ddd",
            bgcolor: "rgba(255,255,255,0.9)",
            display: "flex",
            flexDirection: "column",
            height: 700, // фіксована висота для таблиці + пагінації
          }}
        >
          <TableContainer
            sx={{
              flexGrow: 1,
              overflowY: "auto", // скрол тільки для body таблиці
            }}
          >
            <Table stickyHeader size="small">
              <TableHead>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        onClick={
                          header.column.getCanSort()
                            ? header.column.getToggleSortingHandler()
                            : undefined
                        }
                        sx={{
                          cursor: header.column.getCanSort() ? "pointer" : "default",
                          fontWeight: 600,
                          fontSize: 11,
                          px: 1,
                          py: 0.5,
                          whiteSpace: "nowrap",
                        }}
                      >
                        {flexRender(header.column.columnDef.header, header.getContext())}
                        {header.column.getIsSorted() === "asc"
                          ? " 🔼"
                          : header.column.getIsSorted() === "desc"
                          ? " 🔽"
                          : ""}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableHead>
              <TableBody>
                {table.getRowModel().rows.map((row) => (
                  <TableRow key={row.id} hover>
                    {row.getVisibleCells().map((cell) => (
                      <TableCell
                        key={cell.id}
                        sx={{
                          fontSize: 11,
                          px: 1,
                          py: 0.5,
                          whiteSpace: "nowrap",
                          maxWidth: 120,
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        }}
                      >
                        {flexRender(cell.column.columnDef.cell, cell.getContext())}
                      </TableCell>
                    ))}
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>

          <Box sx={{ flexShrink: 0 }}>
            <TablePagination
              component="div"
              count={tasks.length}
              page={table.getState().pagination.pageIndex}
              onPageChange={(_, newPage) => table.setPageIndex(newPage)}
              rowsPerPage={table.getState().pagination.pageSize}
              onRowsPerPageChange={(e) => table.setPageSize(Number(e.target.value))}
              rowsPerPageOptions={[10, 20, 50]}
            />
          </Box>
        </Paper>
      </Box>

      <Modals />
    </Box>
  );
}