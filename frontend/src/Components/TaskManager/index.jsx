import React, { useMemo, useState } from "react";
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
} from "@mui/material";

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

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);
  const [expanded, setExpanded] = useState({});

  const columnHelper = createColumnHelper();

  const handleAdd = () => dispatch(openAddTaskModal());
  // const handleEdit = (taskId) => dispatch(openAddTaskModal(taskId));

  const handleEdit = (taskId) => {
    console.log("EDIT ID:", taskId);
    dispatch(openAddTaskModal(taskId));
  };

  const handleDelete = (taskId) => {
    if (window.confirm("Ви дійсно хочете видалити цей таск?")) {
      deleteTask.mutate(taskId);
    }
  };

  /* ---------- Compact renderer ---------- */

  const renderCompact = (row, key, formatter) => {
    if (!row.assignments?.length) return "—";

    const first = row.assignments[0]?.[key];
    const count = row.assignments.length - 1;

    if (!first) return "—";

    const label = formatter(first);
    return count > 0 ? `${label} +${count}` : label;
  };

  /* ---------- Columns ---------- */

  const columns = useMemo(
    () => [
      columnHelper.accessor((row) => row.order ?? 0, {
        id: "order",
        header: "#",
      }),

      columnHelper.accessor((row) => row.groupId?.name || "—", {
        id: "group",
        header: "Група",
      }),

      columnHelper.accessor(
        (row) => row.fieldId?.properties?.name || "—",
        { id: "field", header: "Поле" }
      ),

      columnHelper.accessor((row) => row.operationId?.name || "—", {
        id: "operation",
        header: "Операція",
      }),

      columnHelper.accessor("status", {
        header: "Статус",
      }),

      columnHelper.accessor(
        (row) =>
          renderCompact(row, "vehicleId", (v) =>
            `${v.mark || ""} (${v.regNumber || ""})`
          ),
        { id: "vehicle", header: "Транспорт" }
      ),

      columnHelper.accessor(
        (row) =>
          renderCompact(row, "techniqueId", (t) => t.name),
        { id: "technique", header: "Техніка" }
      ),

      columnHelper.accessor(
        (row) =>
          renderCompact(row, "personnelId", (p) =>
            `${p.lastName || ""} ${p.firstName || ""}`.trim()
          ),
        { id: "executor", header: "Виконавець" }
      ),

      columnHelper.accessor(
        (row) => row.fieldId?.properties?.calculated_area ?? null,
        {
          id: "area",
          header: "Площа (га)",
          cell: (info) => {
            const value = info.getValue();
            return typeof value === "number"
              ? value.toFixed(2)
              : "—";
          },
        }
      ),

      columnHelper.accessor(
        (row) => row.processedArea ?? null,
        {
          id: "processedArea",
          header: "Оброблено (га)",
          cell: (info) => {
            const value = info.getValue();
            if (!value) return "—";
            return Number(value).toFixed(2);
          },
        }
      ),


      columnHelper.accessor(
        (row) => dayjs(row.createdAt).format("DD.MM.YYYY HH:mm"),
        { id: "createdAt", header: "Дата створення" }
      ),

      {
        id: "actions",
        header: "Дії",
        enableSorting: false,
        cell: (info) => (
          <Box sx={{ display: "flex", gap: 0.5 }}>
            <IconButton
              size="small"
              onClick={() => handleEdit(info.row.original._id)}
            >
              <EditIcon fontSize="inherit" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() => handleDelete(info.row.original._id)}
            >
              <DeleteIcon fontSize="inherit" />
            </IconButton>

            <IconButton
              size="small"
              onClick={() =>
                dispatch(openTaskReportModal(info.row.original))
              }
            >
              <DescriptionIcon fontSize="inherit" />
            </IconButton>
          </Box>
        ),
      },
    ],
    []
  );

  /* ---------- Table config ---------- */

  const table = useReactTable({
    data: tasks,
    columns,
    state: { globalFilter, sorting, expanded },
    onGlobalFilterChange: setGlobalFilter,
    onSortingChange: setSorting,
    onExpandedChange: setExpanded,
    getRowCanExpand: (row) =>
      row.original.assignments?.length > 1,
    getCoreRowModel: getCoreRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getExpandedRowModel: getExpandedRowModel(),
  });

  if (isLoading) return <div>Завантаження...</div>;
  if (isError) return <div>Помилка: {error.message}</div>;

  return (
    <Box
      sx={{
        minHeight: "100vh",
        backgroundImage: `url(${bgPic})`,
        backgroundSize: "cover",
      }}
    >
      <Header />

      <Box sx={{ padding: "80px 20px 20px 20px" }}>
        <Paper sx={{ p: 1.5, mb: 2 }}>
          <TextField
            size="small"
            placeholder="Пошук..."
            value={globalFilter}
            onChange={(e) => setGlobalFilter(e.target.value)}
            sx={{ width: 220, mr: 2 }}
          />
          <Button variant="contained" size="small" onClick={handleAdd}>
            Додати
          </Button>
        </Paper>

        <Paper sx={{ height: 650, display: "flex", flexDirection: "column" }}>
          <TableContainer sx={{ flexGrow: 1 }}>
            <Table stickyHeader size="small">
              <TableHead>
                {table.getHeaderGroups().map((hg) => (
                  <TableRow key={hg.id}>
                    {hg.headers.map((header) => (
                      <TableCell
                        key={header.id}
                        sx={{ fontSize: 11, py: 0.5 }}
                      >
                        {flexRender(
                          header.column.columnDef.header,
                          header.getContext()
                        )}
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
                      onDoubleClick={() => {
                        if (row.getCanExpand()) {
                          row.toggleExpanded();
                        }
                      }}
                      sx={{
                        cursor: row.getCanExpand()
                          ? "pointer"
                          : "default",
                      }}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell
                          key={cell.id}
                          sx={{
                            fontSize: 10,
                            py: 0.4,
                            px: 0.8,
                            whiteSpace: "nowrap",
                          }}
                        >
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>

                    {row.getIsExpanded() && (
                      <TableRow>
                        <TableCell
                          colSpan={row.getVisibleCells().length}
                          sx={{ py: 0.8 }}
                        >
                          <Box
                            sx={{
                              fontSize: 10,
                              background: "#f2f2f2",
                              p: 1,
                              borderRadius: 1,
                            }}
                          >
                            {row.original.assignments.map((a, i) => (
                              <Box key={i} sx={{ mb: 1 }}>
                                <strong>
                                  Екіпаж {i + 1}
                                </strong>{" "}
                                — {a.personnelId?.lastName}{" "}
                                {a.personnelId?.firstName} |{" "}
                                {a.vehicleId?.mark} (
                                {a.vehicleId?.regNumber}) |{" "}
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
            onPageChange={(_, newPage) =>
              table.setPageIndex(newPage)
            }
            rowsPerPage={table.getState().pagination.pageSize}
            onRowsPerPageChange={(e) =>
              table.setPageSize(Number(e.target.value))
            }
            rowsPerPageOptions={[10, 20, 50]}
          />
        </Paper>
      </Box>

      <Modals />
    </Box>
  );
}