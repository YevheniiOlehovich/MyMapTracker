import React, { useMemo, useEffect } from "react";
import { Box, Typography } from "@mui/material";
import { useGpsByTask } from "../../hooks/useGpsByTask";
import { calculateFieldVisitsWithUnion } from "../../helpres/fieldVisits";

export default function AssignmentReport({
  assignment,
  task,
  fieldPolygon,
  onAreaCalculated,
}) {

  console.log(assignment)
  console.log(task)

  const vehicle = assignment.vehicleId;
  const technique = assignment.techniqueId;

  const imei = vehicle?.imei;

  

  // const equipmentWidth =
  //   task.width || technique?.width || 0;

  // const { dates, queries, isLoading } =
  //   useGpsByTask({
  //     imei,
  //     startDate: task.startDate,
  //     days: task.daysToComplete,
  //   });

    

  // const gpsByDays = useMemo(() => {
  //   if (!dates?.length || !queries?.length) return [];

  //   return dates.map((date, idx) => ({
  //     date,
  //     points: Array.isArray(queries[idx]?.data)
  //       ? queries[idx].data
  //       : [],
  //   }));
  // }, [dates, queries]);

  // console.log(gpsByDays)

  // const visitsData = useMemo(() => {
  //   if (!fieldPolygon.length || !equipmentWidth)
  //     return { visitsByDay: [], totalArea: 0 };

  //   return calculateFieldVisitsWithUnion(
  //     gpsByDays,
  //     fieldPolygon,
  //     equipmentWidth
  //   );
  // }, [gpsByDays, fieldPolygon, equipmentWidth]);

  // console.log(visitsData)

//   useEffect(() => {
//     if (!isLoading) {
//       onAreaCalculated?.(
//         assignment._id,
//         visitsData.totalArea || 0
//       );
//     }
//   }, [
//     visitsData.totalArea,
//     isLoading,
//     onAreaCalculated,
//     assignment._id,
//   ]);

  // if (isLoading) return null;

  return (
    <Box
      mb={2}
      p={2}
      sx={{
        border: "1px solid #ddd",
        borderRadius: 2,
      }}
    >
      {/* <Typography fontWeight={700}>
        Виконавець: {assignment.personnelId?.lastName}
      </Typography>

      <Typography>
        Транспорт: {assignment.vehicleId?.mark}
      </Typography>

      <Typography>
        Техніка: {assignment.techniqueId?.name}
      </Typography>

      <Typography mt={1}>
        Площа: {visitsData.totalArea.toFixed(4)} га
      </Typography> */}
    </Box>
  );
}