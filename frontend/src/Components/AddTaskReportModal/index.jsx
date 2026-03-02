import React, { useMemo, useState } from "react";
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
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import * as turf from "@turf/turf";

import { useGpsByTask } from "../../hooks/useGpsByTask";
import { useFieldsData } from "../../hooks/useFieldsData";
import { cleanGpsTrack } from "../../helpres/cleanGpsTrack";
import MapBlock from "../MapBlock";

export default function AddTaskReportModal({ onClose }) {
  const task = useSelector(
    (state) => state.modals.editTaskReportData
  );

  const { data: fieldsData = [], isLoading: fieldsLoading } =
    useFieldsData();
  const { gpsData, isLoading: gpsLoading } =
    useGpsByTask(task);

  const [visibilityState, setVisibilityState] = useState({});

  if (!task) return null;

  const isLoading = fieldsLoading || gpsLoading;

  /*
  ======================================================
  1️⃣ FIELD POLYGON
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
      const assignment = task.assignments.find(
        (a) => a._id === track.assignmentId
      );

      if (!grouped[track.assignmentId]) {
        grouped[track.assignmentId] = {
          assignmentId: track.assignmentId,
          vehicle:
            assignment?.vehicleId?.mark || "—",
          technique:
            assignment?.techniqueId?.name || "—",
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
  }, [filteredTracks, task.assignments]);

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
  LOADING
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
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            position: "relative",
          }}
        >
          <IconButton
            onClick={onClose}
            sx={{ position: "absolute", top: 10, right: 10 }}
          >
            <CloseIcon />
          </IconButton>

          {/* LEFT PANEL */}
          <Box
            sx={{
              width: 480,
              pr: 2,
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
              <Typography variant="h6" fontWeight={700} mb={1}>
                Завдання №{task.order}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Операція:</strong> {task.operationId?.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Поле:</strong> {task.fieldId?.properties?.name}
              </Typography>

              <Typography variant="body2" color="text.secondary">
                <strong>Площа:</strong> {task.fieldId?.properties?.area} га
              </Typography>
            </Box>

            {groupedByAssignment.map((machine) => (
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
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  sx={{
                    px: 2,
                    py: 1.5,
                    bgcolor: "grey.50",
                    borderBottom: "1px solid",
                    borderColor: "grey.200",
                    borderTopLeftRadius: 8,
                    borderTopRightRadius: 8,
                  }}
                >
                  <Box>
                    <Typography fontWeight={600}>
                      {machine.vehicle}
                    </Typography>

                    <Typography
                      variant="caption"
                      color="text.secondary"
                    >
                      {machine.technique}
                    </Typography>
                  </Box>
                </AccordionSummary>

                <AccordionDetails sx={{ px: 2, py: 2 }}>
                  <Box mb={2}>
                    <Typography variant="body2" color="text.secondary">
                      Виконавець
                    </Typography>

                    <Typography fontWeight={500}>
                      {machine.personnel}
                    </Typography>
                  </Box>

                  {machine.days.map((day, index) => {
                    const key = `${machine.assignmentId}_${day.date}`;
                    const visible = visibilityState[key] ?? true;

                    return (
                      <Box
                        key={index}
                        sx={{
                          p: 1.5,
                          mb: 1.5,
                          borderRadius: 2,
                          bgcolor: "grey.50",
                          border: "1px solid",
                          borderColor: "grey.200",
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

                            {/* <Typography
                              variant="caption"
                              color="text.secondary"
                            >
                              Точок: {day.pointsCount}
                            </Typography> */}
                          </Box>

                          <Switch
                            checked={visible}
                            onChange={() =>
                              toggleVisibility(
                                machine.assignmentId,
                                day.date
                              )
                            }
                          />
                        </Box>
                      </Box>
                    );
                  })}
                </AccordionDetails>
              </Accordion>
            ))}
          </Box>
          

          <Divider orientation="vertical" flexItem />

          {/* MAP */}
          <Box sx={{ flex: 1, pl: 2 }}>
            <MapBlock
              field={{ value: task.fieldId?._id }}
              fieldsList={fieldsData}
              gpsTracks={visibleTracks}
              height="100%"
            />
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}