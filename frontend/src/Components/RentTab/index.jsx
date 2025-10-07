import React, { useMemo, useState } from "react";
import { useDispatch } from "react-redux";
import { useRentsData } from "../../hooks/useRentData";
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
  Table,
  TableHead,
  TableBody,
  TableRow,
  TableCell,
  TableContainer,
  InputAdornment,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

export default function RentsTab() {
  const dispatch = useDispatch();
  const { data: rentsData = [], isLoading, isError, error } = useRentsData();

  const [globalFilter, setGlobalFilter] = useState("");
  const [sorting, setSorting] = useState([]);

  const columnHelper = createColumnHelper();

  const totalArea = useMemo(() => {
    return rentsData
      .reduce((sum, rent) => {
        const area = parseFloat(rent.properties?.area);
        return !isNaN(area) ? sum + area : sum;
      }, 0)
      .toFixed(4);
  }, [rentsData]);

  const handleEdit = (rent) => {
    console.log("Edit rent:", rent);
    // Можна додати dispatch для редагування
  };

  const columns = useMemo(
    () => [
      { id: "rowNumber", header: "#", accessorFn: (row, index) => index + 1, cell: (info) => info.getValue() },
      columnHelper.accessor((row) => row.properties?.name || "—", { id: "name", header: "Орендар" }),
      columnHelper.accessor((row) => row.properties?.ikn || "—", { id: "ikn", header: "Кадастровий номер" }),
      columnHelper.accessor((row) => row.properties?.lessor || "—", { id: "lessor", header: "Орендодавець" }),
      columnHelper.accessor((row) => row.properties?.area, {
        id: "area",
        header: "Площа (га)",
        cell: (info) => {
          const num = parseFloat(info.getValue());
          return !isNaN(num) ? num.toFixed(4) : "—";
        },
      }),
      columnHelper.accessor((row) => row.properties?.end, {
        id: "end",
        header: "Кінець оренди",
        cell: (info) => {
          const raw = info.getValue();
          const date = new Date(parseInt(raw));
          return isNaN(date) ? "—" : date.toLocaleDateString("uk-UA");
        },
        sortingFn: (rowA, rowB, columnId) => {
          const a = parseInt(rowA.getValue(columnId));
          const b = parseInt(rowB.getValue(columnId));
          return a - b;
        },
      }),
    ],
    []
  );

  const table = useReactTable({
    data: rentsData,
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
      {/* Пошук та сумарна площа */}
      <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
        <TextField
          size="small"
          variant="outlined"
          placeholder="Пошук по орендарю, кадастру, орендодавцю..."
          value={globalFilter}
          onChange={(e) => setGlobalFilter(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ width: 350 }}
        />
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          <b>Сумарна площа:</b> {totalArea} га
        </Box>
      </Box>

      {/* Таблиця */}
      <Paper sx={{ flexGrow: 1, overflow: "hidden", borderRadius: 2, boxShadow: 3, bgcolor: "rgba(255,255,255,0.9)" }}>
        {/* <TableContainer sx={{ maxHeight: "calc(100vh - 200px)", overflowY: "auto" }}> */}
        <TableContainer >
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
