import { useSelector, useDispatch } from "react-redux";
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  CircularProgress,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Chip,
} from "@mui/material";

import ChecklistIcon from "@mui/icons-material/Checklist";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
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

  // 🔥 Центрування по полю
  const handleCenterField = (field) => {
    if (!field) return;

    const bounds = L.geoJSON(field).getBounds();
    const center = bounds.getCenter();

    dispatch(setMapCenter([center.lat, center.lng]));
    dispatch(setActiveField(field._id));
  };

  return (
    <Slide direction="right" in={open} mountOnEnter unmountOnExit>
      <Paper
        elevation={3}
        sx={{
          position: "absolute",
          top: 0,
          left: 0,
          height: "100vh",
          width: 350,
          bgcolor: "rgba(33,33,33,0.85)",
          color: "white",
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
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            height: 56,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Завдання на {formattedDate}
          </Typography>

          <Tooltip title="Задачі">
            <IconButton size="small">
              <ChecklistIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* CONTENT */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 1,
            flex: 1,
            overflowY: "auto",
          }}
        >
          {isLoading && (
            <Box sx={{ textAlign: "center", mt: 2 }}>
              <CircularProgress size={24} />
            </Box>
          )}

          {isError && (
            <Typography sx={{ color: "error.main" }}>
              Помилка: {error.message}
            </Typography>
          )}

          {!isLoading && tasks.length === 0 && (
            <Typography sx={{ opacity: 0.7 }}>
              Немає задач на цю дату
            </Typography>
          )}

          {/* TASKS */}
          {tasks.map((task) => (
            <Accordion
              key={task._id}
              sx={{
                bgcolor: "rgba(255,255,255,0.05)",
                color: "white",
                "&:before": { display: "none" },
              }}
            >
              {/* HEADER */}
              <AccordionSummary
                expandIcon={<ExpandMoreIcon sx={{ color: "white" }} />}
              >
                <Typography sx={{ fontWeight: 500 }}>
                  {task.operationId?.name || "Без назви операції"}
                </Typography>
              </AccordionSummary>

              {/* DETAILS */}
              <AccordionDetails sx={{ pt: 0 }}>

                {/* Статус */}
                <Box sx={{ mb: 1 }}>
                  <Chip
                    label={task.status}
                    size="small"
                    sx={{
                      bgcolor:
                        task.status === "done"
                          ? "#4caf50"
                          : task.status === "in_progress"
                          ? "#2196f3"
                          : "#9e9e9e",
                      color: "white",
                    }}
                  />
                </Box>

                {/* Поле + кнопка центрування */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 1,
                  }}
                >
                  <Typography variant="body2">
                    Поле: {task.fieldId?.properties?.name || "—"}
                  </Typography>

                  {task.fieldId && (
                    <Tooltip title="Центрувати на полі">
                      <IconButton
                        size="small"
                        onClick={() => handleCenterField(task.fieldId)}
                      >
                        <LocationOnIcon
                          fontSize="small"
                          sx={{ color: "white" }}
                        />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                {/* Дата створення */}
                <Typography variant="body2">
                  Створено:{" "}
                  {new Date(task.createdAt).toLocaleDateString("uk-UA")}
                </Typography>

                {/* Виконавець */}
                <Typography variant="body2">
                  Виконавець:{" "}
                  {task.personnelId
                    ? `${task.personnelId.lastName} ${task.personnelId.firstName}`
                    : "—"}
                </Typography>

                {/* Транспорт */}
                <Typography variant="body2">
                  Транспорт: {task.vehicleId?.regNumber || "—"}
                </Typography>

                {/* Техніка */}
                <Typography variant="body2">
                  Техніка: {task.techniqueId?.name || "—"}
                </Typography>

                {/* Тривалість */}
                <Typography variant="body2">
                  Тривалість: {task.daysToComplete || 1} дн.
                </Typography>

                {/* Примітка */}
                {task.note && (
                  <Typography variant="body2" sx={{ mt: 1 }}>
                    Примітка: {task.note}
                  </Typography>
                )}

              </AccordionDetails>
            </Accordion>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}
