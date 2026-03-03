import { useSelector, useDispatch } from "react-redux";
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  CircularProgress,
  Chip,
} from "@mui/material";

import ChecklistIcon from "@mui/icons-material/Checklist";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import L from "leaflet";

import { useTasksByDate } from "../../hooks/useTasksData";
import { setMapCenter } from "../../store/mapCenterSlice";
import { setActiveField } from "../../store/activeFieldSlice";

export default function TaskList({ open = true }) {
  const dispatch = useDispatch();

  const selectedDate = useSelector(
    (state) => state.calendar.selectedDate
  );

  const formattedDate = selectedDate
    ? new Date(selectedDate).toLocaleDateString("uk-UA")
    : "—";

  const {
    data: tasks = [],
    isLoading,
    isError,
    error,
  } = useTasksByDate(selectedDate);

  const handleCenterField = (field) => {
    if (!field) return;

    const bounds = L.geoJSON(field).getBounds();
    const center = bounds.getCenter();

    dispatch(setMapCenter([center.lat, center.lng]));
    dispatch(setActiveField(field._id));
  };

  const getStatusColor = (status) => {
    if (status === "done") return "#4caf50";
    if (status === "in_progress") return "#2196f3";
    return "#9e9e9e";
  };

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          width: 350,
          height: "100vh",
          bgcolor: "rgba(33,33,33,0.9)",
          color: "#fff",
          borderRadius: "0 8px 8px 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
            py: 0.6,
            borderBottom: "1px solid rgba(255,255,255,0.15)",
          }}
        >
          <Typography
            sx={{
              fontSize: 14,
              fontWeight: 600,
              letterSpacing: 0.3,
              color: "white",
            }}
          >
            Завдання на {formattedDate}
          </Typography>

          <ChecklistIcon sx={{ fontSize: 18 }} />
        </Box>

        {/* CONTENT */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>

          {isLoading && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <CircularProgress size={22} sx={{ color: "white" }} />
            </Box>
          )}

          {isError && (
            <Typography sx={{ color: "#ff6b6b", fontSize: 12 }}>
              Помилка: {error.message}
            </Typography>
          )}

          {!isLoading && tasks.length === 0 && (
            <Typography sx={{ fontSize: 12, color: "rgba(255,255,255,0.7)" }}>
              Немає задач на цю дату
            </Typography>
          )}

          {tasks.map((task) => (
            <Paper
              key={task._id}
              sx={{
                px: 1,
                py: 0.8,
                mb: 0.6,
                bgcolor: "rgba(255,255,255,0.05)",
                borderRadius: 1,
                transition: "background 0.2s",
                "&:hover": {
                  bgcolor: "rgba(25,118,210,0.2)",
                },
              }}
            >
              {/* TITLE + STATUS */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography
                  sx={{
                    fontSize: 13,
                    fontWeight: 600,
                    color: "white",
                  }}
                >
                  #{task.order} {task.operationId?.name || "—"}
                </Typography>

                <Chip
                  label={task.status}
                  size="small"
                  sx={{
                    height: 20,
                    fontSize: 10,
                    bgcolor: getStatusColor(task.status),
                    color: "#fff",
                  }}
                />
              </Box>

              {/* FIELD */}
              <Box
                sx={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  mb: 0.5,
                }}
              >
                <Typography sx={{ fontSize: 12, color: "white" }}>
                  Поле: {task.fieldId?.properties?.name || "—"}
                </Typography>

                {task.fieldId && (
                  <Tooltip title="Центрувати">
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleCenterField(task.fieldId)}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: 16, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>
                )}
              </Box>

              {/* AREA */}
              <Typography sx={{ fontSize: 12, color: "white", }}>
                Оброблено: {Number(task.processedArea || 0).toFixed(2)} га
              </Typography>

              <Typography sx={{ fontSize: 12, color: "white", }}>
                Тривалість: {task.daysToComplete || 1} дн.
              </Typography>

              {/* ASSIGNMENTS */}
              {task.assignments?.length > 0 && (
                <Box sx={{ mt: 0.5 }}>
                  {task.assignments.map((a, i) => (
                    <Typography
                      key={a._id}
                      sx={{
                        fontSize: 11,
                        pl: 1,
                        color: "rgba(255,255,255,0.8)",
                      }}
                    >
                      {i + 1}. {a.personnelId?.lastName}{" "}
                      {a.personnelId?.firstName} —{" "}
                      {a.vehicleId?.mark} —{" "}
                      {a.techniqueId?.name}
                    </Typography>
                  ))}
                </Box>
              )}

              {/* NOTE */}
              {task.note && (
                <Typography
                  sx={{
                    fontSize: 11,
                    mt: 0.5,
                    color: "rgba(255,255,255,0.7)",
                  }}
                >
                  {task.note}
                </Typography>
              )}
            </Paper>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}