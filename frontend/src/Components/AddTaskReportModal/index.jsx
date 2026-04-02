import React, { useMemo, useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Switch,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as turf from "@turf/turf";

import { useGpsByTask } from "../../hooks/useGpsByTask";
import { useFieldsData } from "../../hooks/useFieldsData";
import { cleanGpsTrack } from "../../helpres/cleanGpsTrack";
import MapBlock from "../MapBlock";
import { calculateGridCoverageGrid } from "../../helpres/calculateGridCoverage";
import { useUpdateTaskReport } from "../../hooks/useTasksData";
import * as XLSX from "xlsx"; 

export default function AddTaskReportModal({ onClose }) {
  const task = useSelector(
    (state) => state.modals.editTaskReportData
  );

  const { data: fieldsData = [], isLoading: fieldsLoading } =
    useFieldsData();
  const { gpsData, isLoading: gpsLoading } =
    useGpsByTask(task);

  const [visibilityState, setVisibilityState] = useState({});
  const { mutate: updateReport, isPending } = useUpdateTaskReport();

  // if (!task) return null;

  const isLoading = fieldsLoading || gpsLoading;

/*
======================================================
2️⃣ Field poligon
======================================================
*/

const turfFieldPolygon = useMemo(() => {
  const geometry = task?.fieldId?.geometry;
  if (!geometry?.coordinates?.length) return null;

  return turf.polygon(geometry.coordinates);
}, [task?.fieldId?.geometry]);

/*
======================================================
2️⃣ NORMALIZE GPS
======================================================
*/

const normalizedGps = useMemo(() => {
  if (!gpsData?.length) return [];

  const result = [];

  gpsData.forEach((assignment) => {
    assignment.data.forEach((day) => {
      const wrapper = day.points?.[0];
      if (!wrapper?.data?.length) return;

      const cleaned = cleanGpsTrack(wrapper.data);
      if (!cleaned.length) return;

      result.push({
        assignmentId: assignment.assignmentId,
        imei: assignment.imei,
        date: day.date,
        points: cleaned,
      });
    });
  });

  return result;
}, [gpsData]);

/*
======================================================
3️⃣ FILTER BY FIELD
======================================================
*/

const filteredTracks = useMemo(() => {
  if (!normalizedGps.length || !turfFieldPolygon)
    return [];

  return normalizedGps
    .map((track) => {
      const insidePoints = track.points.filter((pt) =>
        turf.booleanPointInPolygon(
          [pt.longitude, pt.latitude],
          turfFieldPolygon
        )
      );

      if (insidePoints.length < 2) return null;

      return {
        ...track,
        points: insidePoints,
      };
    })
    .filter(Boolean);
}, [normalizedGps, turfFieldPolygon]);

/*
======================================================
4️⃣ GROUP BY ASSIGNMENT
======================================================
*/

const groupedByAssignment = useMemo(() => {
  if (!filteredTracks.length) return [];

  const grouped = {};

  filteredTracks.forEach((track) => {
    const assignment = task?.assignments?.find(
      (a) => a._id === track.assignmentId
    );

    if (!grouped[track.assignmentId]) {
      grouped[track.assignmentId] = {
        assignmentId: track.assignmentId,
        vehicle: assignment?.vehicleId?.mark || "—",
        technique: assignment?.techniqueId?.name || "—",
        personnel: assignment?.personnelId
          ? `${assignment.personnelId.lastName} ${assignment.personnelId.firstName}`
          : "—",
        days: [],
      };
    }

    grouped[track.assignmentId].days.push({
      date: track.date,
      pointsCount: track.points.length,
    });
  });

  return Object.values(grouped);
}, [filteredTracks, task]);

/*
======================================================
5️⃣ TOGGLE VISIBILITY
======================================================
*/

const toggleVisibility = (assignmentId, date) => {
  const key = `${assignmentId}_${date}`;

  setVisibilityState((prev) => ({
    ...prev,
    [key]: !prev[key],
  }));
};

const visibleTracks = useMemo(() => {
  return filteredTracks.filter((track) => {
    const key = `${track.assignmentId}_${track.date}`;
    return visibilityState[key] ?? true;
  });
}, [filteredTracks, visibilityState]);

/*
======================================================
6️⃣ GRID COVERAGE
======================================================
*/

const implementWidthByAssignment = useMemo(() => {
  const map = {};

  (task?.assignments || []).forEach((a) => {
    map[a._id] = a.techniqueId?.width || 5.6;
  });

  return map;
}, [task]);

const gridResult = useMemo(() => {
  if (!filteredTracks.length || !turfFieldPolygon) {
    return null;
  }

  return calculateGridCoverageGrid({
    tracks: filteredTracks,
    fieldPolygon: turfFieldPolygon,
    cellSize: 2,
    implementWidthByAssignment,
  });
}, [
  filteredTracks,
  turfFieldPolygon,
  implementWidthByAssignment,
]);

/*
======================================================
TOTAL HECTARES (ВАЖЛИВО ВИЩЕ!)
======================================================
*/

const totalHectares = useMemo(() => {
  return gridResult?.total?.fullHectares || 0;
}, [gridResult]);

/*
======================================================
ACTIONS
======================================================
*/

const handleSave = () => {
  if (!task) return;

  updateReport(
    {
      taskId: task._id,
      processedArea: totalHectares
    },
    {
      onSuccess: () => {
        onClose();
      },
    }
  );
};

const handleExportExcel = () => {
  if (!gridResult?.days) return;

  const rows = [];

  groupedByAssignment.forEach((machine) => {
    machine.days.forEach((day) => {
      const dayStats =
          gridResult?.days?.[day.date]?.machines?.[machine.assignmentId];
      rows.push({
        "Task №": task.order,
        Operation: task.operationId?.name,
        Field: task.fieldId?.properties?.name,
        "Field Area (ha)": task.fieldId?.properties?.area,
        "Processed Total (ha)": totalHectares,
        Vehicle: machine.vehicle,
        Technique: machine.technique,
        Operator: machine.personnel,
        Date: day.date,
        "Net ha": dayStats?.netHectares ?? 0,
        "Overlap ha": dayStats?.overlapHectares ?? 0,
        "Full ha": dayStats?.fullHectares ?? 0,
      });
    });
  });

  const worksheet = XLSX.utils.json_to_sheet(rows);
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, "Task Report");
  XLSX.writeFile(workbook, `task_${task?.order}_report.xlsx`);
};

/*
======================================================
RETURN (ТІЛЬКИ ТУТ!)
======================================================
*/

  if (isLoading) {
    return (
      <Box
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.7)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          zIndex: 1300,
        }}
      >
        <Fade in>
          <CircularProgress />
        </Fade>
      </Box>
    );
  }

  /*
  ======================================================
  RENDER
  ======================================================
  */



  if (!task) return null;

  return (
    <Fade in>
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: 1150,
            height: 680,
            display: "flex",
            flexDirection: "column",
            bgcolor: "background.paper",
            borderRadius: 2,
            overflow: "hidden",
          }}
        >
          {/* ================= HEADER ================= */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            <Typography variant="h6" fontWeight={700}>
              Завдання №{task.order}
            </Typography>

            <IconButton onClick={onClose}>
              <CloseIcon />
            </IconButton>
          </Box>

          {/* ================= BODY ================= */}
          <Box sx={{ flex: 1, display: "flex", overflow: "hidden" }}>
            {/* LEFT PANEL */}
            <Box
              sx={{
                width: 480,
                p: 3,
                overflowY: "auto",
              }}
            >
              {/* HEADER CARD */}
              <Box
                sx={{
                  mb: 3,
                  p: 2.5,
                  borderRadius: 2,
                  bgcolor: "grey.100",
                  border: "1px solid",
                  borderColor: "grey.300",
                }}
              >
                <Typography variant="body2">
                  <strong>Операція:</strong> {task.operationId?.name}
                </Typography>

                <Typography variant="body2">
                  <strong>Поле:</strong> {task.fieldId?.properties?.name}
                </Typography>

                <Typography variant="body2">
                  <strong>Площа:</strong> {task.fieldId?.properties?.area} га
                </Typography>

                {gridResult && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    <strong>Оброблено всього:</strong>{" "}
                    {Number(totalHectares || 0).toFixed(2)} га
                  </Typography>
                )}
              </Box>

              {/* ASSIGNMENTS */}
              
              {groupedByAssignment.map((machine) => {
                const machineTotal = Object.values(gridResult?.days || {})
                  .reduce((sum, day) => {
                    return sum + (day.machines?.[machine.assignmentId]?.fullHectares || 0);
                  }, 0);

                return (
                  <Accordion
                    key={machine.assignmentId}
                    defaultExpanded
                    disableGutters
                    elevation={0}
                    sx={{
                      mb: 2,
                      borderRadius: 2,
                      border: "1px solid",
                      borderColor: "grey.300",
                      "&:before": { display: "none" },
                    }}
                  >
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box>
                        <Typography fontWeight={600}>
                          {machine.vehicle}
                        </Typography>
                        <Typography variant="caption" color="text.secondary">
                          {machine.technique}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {/* Виконавець */}
                      <Box mb={2}>
                        <Typography variant="body2" color="text.secondary">
                          Виконавець
                        </Typography>
                        <Typography fontWeight={500}>
                          {machine.personnel}
                        </Typography>
                      </Box>

                      {/* ✅ Assignment summary (НОВИЙ) */}
                      {machineTotal > 0 && (
                        <Box
                          sx={{
                            mb: 3,
                            p: 2,
                            borderRadius: 2,
                            bgcolor: "grey.100",
                          }}
                        >
                          <Typography variant="body2">
                            Пройдено: {machineTotal.toFixed(2)}
                          </Typography>
                        </Box>
                      )}

                      {/* Days */}
                      {machine.days.map((day, index) => {
                        const key = `${machine.assignmentId}_${day.date}`;
                        const visible = visibilityState[key] ?? true;

                        const dayStats =
                          gridResult?.days?.[day.date]?.machines?.[machine.assignmentId];

                        return (
                          <Box
                            key={index}
                            sx={{
                              p: 1.5,
                              mb: 1.5,
                              borderRadius: 2,
                              bgcolor: "grey.50",
                            }}
                          >
                            <Box
                              display="flex"
                              justifyContent="space-between"
                              alignItems="center"
                            >
                              <Box>
                                <Typography fontWeight={500}>
                                  {day.date}
                                </Typography>

                                {/* ✅ завжди показує значення */}
                                <Typography variant="caption">
                                  {(dayStats?.netHectares ?? 0).toFixed(2)}
                                </Typography>
                              </Box>

                              <Switch
                                checked={visible}
                                onChange={() =>
                                  toggleVisibility(machine.assignmentId, day.date)
                                }
                              />
                            </Box>
                          </Box>
                        );
                      })}
                    </AccordionDetails>
                  </Accordion>
                );
              })}
            </Box>

            <Divider orientation="vertical" flexItem />

            {/* MAP */}
            <Box sx={{ flex: 1 }}>
              <MapBlock
                field={{ value: task.fieldId?._id }}
                fieldsList={fieldsData}
                gpsTracks={visibleTracks}
                height="100%"
              />
            </Box>
          </Box>

          {/* ================= FOOTER ================= */}
          <Box
            sx={{
              px: 3,
              py: 2,
              display: "flex",
              justifyContent: "flex-end",
              gap: 2,
              borderTop: "1px solid #e0e0e0",
            }}
          >
            <Button
              variant="outlined"
              onClick={handleExportExcel}
            >
              Експорт Excel
            </Button>

            <Button variant="outlined" onClick={onClose}>
              Закрити
            </Button>

            <Button
              variant="contained"
              onClick={handleSave}
              disabled={isPending}
            >
              {isPending ? "Збереження..." : "Зберегти"}
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
