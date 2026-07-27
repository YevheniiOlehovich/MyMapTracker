// import React, { useMemo, useState } from "react";
// import { useDispatch } from "react-redux";
// import { usePropertiesData } from "../../hooks/usePropertiesData";
// import {
//   createColumnHelper,
//   getCoreRowModel,
//   getSortedRowModel,
//   getFilteredRowModel,
//   useReactTable,
//   flexRender,
// } from "@tanstack/react-table";

// import {
//   Box,
//   Paper,
//   TextField,
//   Table,
//   TableHead,
//   TableBody,
//   TableRow,
//   TableCell,
//   TableContainer,
//   InputAdornment,
//   Skeleton,
// } from "@mui/material";
// import SearchIcon from "@mui/icons-material/Search";
// import ArrowUpwardIcon from "@mui/icons-material/ArrowUpward";
// import ArrowDownwardIcon from "@mui/icons-material/ArrowDownward";
// import UnfoldMoreIcon from "@mui/icons-material/UnfoldMore";

// export default function PropertiesTab() {
//   const dispatch = useDispatch();
//   const { data: propertiesData = [], isLoading, isError, error } = usePropertiesData();

//   const [globalFilter, setGlobalFilter] = useState("");
//   const [sorting, setSorting] = useState([]);

//   const columnHelper = createColumnHelper();

//   const totalArea = useMemo(() => {
//     return propertiesData
//       .reduce((sum, p) => {
//         const area = parseFloat(p.properties?.area);
//         return !isNaN(area) ? sum + area : sum;
//       }, 0)
//       .toFixed(4);
//   }, [propertiesData]);

//   const columns = useMemo(
//     () => [
//       { id: "rowNumber", header: "#", accessorFn: (row, index) => index + 1, cell: (info) => info.getValue() },
//       columnHelper.accessor((row) => row.properties?.username || "—", { id: "username", header: "Власник" }),
//       columnHelper.accessor((row) => row.properties?.ikn || "—", { id: "ikn", header: "Кадастровий номер" }),
//       columnHelper.accessor((row) => row.properties?.address || "—", { id: "address", header: "Адреса" }),
//       columnHelper.accessor((row) => row.properties?.area, {
//         id: "area",
//         header: "Площа (га)",
//         cell: (info) => {
//           const num = parseFloat(info.getValue());
//           return !isNaN(num) ? num.toFixed(4) : "—";
//         },
//       }),
//       columnHelper.accessor((row) => row.properties?.start, {
//         id: "start",
//         header: "Дата набуття",
//         cell: (info) => {
//           const raw = info.getValue();
//           const date = new Date(parseInt(raw));
//           return isNaN(date) ? "—" : date.toLocaleDateString("uk-UA");
//         },
//         sortingFn: (rowA, rowB, columnId) => parseInt(rowA.getValue(columnId)) - parseInt(rowB.getValue(columnId)),
//       }),
//     ],
//     []
//   );

//   const table = useReactTable({
//     data: propertiesData,
//     columns,
//     state: { globalFilter, sorting },
//     onGlobalFilterChange: setGlobalFilter,
//     onSortingChange: setSorting,
//     getCoreRowModel: getCoreRowModel(),
//     getSortedRowModel: getSortedRowModel(),
//     getFilteredRowModel: getFilteredRowModel(),
//   });

//   if (isError) return <div>Помилка: {error.message}</div>;

//   return (
//     <Box sx={{ display: "flex", flexDirection: "column", height: "100%", p: 2 }}>
//       {/* Пошук та сумарна площа */}
//       <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
//         <TextField
//           size="small"
//           variant="outlined"
//           placeholder="Пошук по власнику, кадастру, адресі..."
//           value={globalFilter}
//           onChange={(e) => setGlobalFilter(e.target.value)}
//           InputProps={{
//             startAdornment: (
//               <InputAdornment position="start">
//                 <SearchIcon color="action" />
//               </InputAdornment>
//             ),
//           }}
//           sx={{ width: 350 }}
//         />
//         <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//           <b>Сумарна площа:</b> {totalArea} га
//         </Box>
//       </Box>

//       {/* Таблиця */}
//       <Paper sx={{ flexGrow: 1, overflow: "hidden", borderRadius: 2, boxShadow: 3, bgcolor: "rgba(255,255,255,0.9)" }}>
//         <TableContainer>
//           <Table stickyHeader size="small">
//             <TableHead>
//               {table.getHeaderGroups().map((headerGroup) => (
//                 <TableRow key={headerGroup.id}>
//                   {headerGroup.headers.map((header) => (
//                     <TableCell
//                       key={header.id}
//                       onClick={header.column.getToggleSortingHandler()}
//                       sx={{
//                         cursor: header.column.getCanSort() ? "pointer" : "default",
//                         fontWeight: "bold",
//                         bgcolor: "rgba(240,240,240,0.9)",
//                         py: 0.5,
//                         px: 1,
//                         userSelect: "none",
//                       }}
//                     >
//                       <Box sx={{ display: "flex", alignItems: "center", gap: 0.5 }}>
//                         {flexRender(header.column.columnDef.header, header.getContext())}
//                         {header.column.getCanSort() &&
//                           (header.column.getIsSorted() === "asc" ? (
//                             <ArrowUpwardIcon fontSize="small" />
//                           ) : header.column.getIsSorted() === "desc" ? (
//                             <ArrowDownwardIcon fontSize="small" />
//                           ) : (
//                             <UnfoldMoreIcon fontSize="small" sx={{ opacity: 0.4 }} />
//                           ))}
//                       </Box>
//                     </TableCell>
//                   ))}
//                 </TableRow>
//               ))}
//             </TableHead>
//             <TableBody>
//               {isLoading
//                 ? Array.from({ length: 5 }).map((_, i) => (
//                     <TableRow key={i}>
//                       {columns.map((col, idx) => (
//                         <TableCell key={idx}>
//                           <Skeleton variant="text" />
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))
//                 : table.getRowModel().rows.map((row, i) => (
//                     <TableRow
//                       key={row.id}
//                       hover
//                       sx={{ bgcolor: i % 2 === 0 ? "rgba(255,255,255,0.6)" : "rgba(255,255,255,0.9)" }}
//                     >
//                       {row.getVisibleCells().map((cell) => (
//                         <TableCell key={cell.id} sx={{ py: 0.5, px: 1 }}>
//                           {flexRender(cell.column.columnDef.cell, cell.getContext())}
//                         </TableCell>
//                       ))}
//                     </TableRow>
//                   ))}
//             </TableBody>
//           </Table>
//         </TableContainer>
//       </Paper>
//     </Box>
//   );
// }



















import React, { useMemo } from "react";
import { usePropertiesData } from "../../hooks/usePropertiesData";

import {
    Box,
    Paper,
    Table,
    TableHead,
    TableBody,
    TableRow,
    TableCell,
    TableContainer,
    Typography,
    Skeleton,
} from "@mui/material";

export default function PropertiesTab() {
    const {
        data: properties = [],
        isLoading,
        isError,
        error,
    } = usePropertiesData();

    const totalArea = useMemo(() => {
        return properties
            .reduce((sum, item) => sum + (item.plot?.area || 0), 0)
            .toFixed(4);
    }, [properties]);

    const withoutGeometry = useMemo(() => {
        return properties.filter(
            (item) => !item.geometry?.type
        ).length;
    }, [properties]);

    if (isError) {
        return (
            <Typography color="error">
                {error.message}
            </Typography>
        );
    }

    return (
        <Box p={2}>

            <Box
                sx={{
                    display: "flex",
                    gap: 4,
                    mb: 2,
                    fontWeight: "bold",
                }}
            >
                <Typography>
                    Ділянок: {properties.length}
                </Typography>

                <Typography>
                    Площа: {totalArea} га
                </Typography>

                <Typography color="error">
                    Без геометрії: {withoutGeometry}
                </Typography>
            </Box>

            <Paper>

                <TableContainer sx={{ maxHeight: "75vh" }}>

                    <Table stickyHeader size="small">

                        <TableHead>
                            <TableRow>
                                <TableCell>#</TableCell>
                                <TableCell>Власник</TableCell>
                                <TableCell>Кадастровий номер</TableCell>
                                <TableCell>Площа</TableCell>
                                <TableCell>Адреса</TableCell>
                                <TableCell>Дата реєстрації</TableCell>
                            </TableRow>
                        </TableHead>

                        <TableBody>

                            {isLoading
                                ? Array.from({ length: 8 }).map((_, i) => (
                                      <TableRow key={i}>
                                          {Array.from({ length: 6 }).map((_, j) => (
                                              <TableCell key={j}>
                                                  <Skeleton />
                                              </TableCell>
                                          ))}
                                      </TableRow>
                                  ))
                                : properties.map((item, index) => (
                                      <TableRow key={item._id} hover>

                                          <TableCell>
                                              {index + 1}
                                          </TableCell>

                                          <TableCell>
                                              {item.owner?.name || "—"}
                                          </TableCell>

                                          <TableCell>
                                              {item.plot?.cadnum || "—"}
                                          </TableCell>

                                          <TableCell>
                                              {item.plot?.area?.toFixed?.(4) ?? "—"}
                                          </TableCell>

                                          <TableCell>
                                              {item.owner?.address || "—"}
                                          </TableCell>

                                          <TableCell>
                                              {item.document?.registrationDate || "—"}
                                          </TableCell>

                                      </TableRow>
                                  ))}

                        </TableBody>

                    </Table>

                </TableContainer>

            </Paper>

        </Box>
    );
}