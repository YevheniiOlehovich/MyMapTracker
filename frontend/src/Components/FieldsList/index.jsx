import { useDispatch, useSelector } from "react-redux";
import { useFieldsData, useToggleFieldVisibility } from "../../hooks/useFieldsData";
import { setMapCenter } from "../../store/mapCenterSlice";
import { openAddFieldsModal, setSelectedField } from "../../store/modalSlice";
import { setActiveField } from "../../store/activeFieldSlice"; // новий екшн
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import LocationOnIcon from "@mui/icons-material/LocationOn";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
import MapIcon from "@mui/icons-material/Map";
import L from "leaflet";

export default function FieldsList({ open = true }) {
  const dispatch = useDispatch();
  const { data: fields = [], isLoading, isError, error } = useFieldsData();
  const toggleFieldVisibility = useToggleFieldVisibility();

  const activeFieldId = useSelector(
    (state) => state.activeField.activeFieldId
  );

  const handleEditField = (field) => {
    dispatch(setSelectedField(field._id));
    dispatch(openAddFieldsModal());
  };

  const handleToggleFieldVisibility = (field) => {
    toggleFieldVisibility.mutate({
      fieldId: field._id,
      isVisible: !field.visible,
    });
  };

  const handleCenterMap = (field) => {
    const bounds = L.geoJSON(field).getBounds();
    const center = bounds.getCenter();
    dispatch(setMapCenter([center.lat, center.lng]));
    dispatch(setActiveField(field._id));
  };

  if (isLoading)
    return <Typography sx={{ p: 2 }}>Завантаження полів...</Typography>;

  if (isError)
    return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;

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
          bgcolor: "rgba(33,33,33,0.85)",
          color: "white",
          borderRadius: "0 8px 8px 0",
          overflow: "hidden",
          display: "flex",
          flexDirection: "column",
        }}
      >
        {/* 🔹 HEADER */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            px: 1,
            py: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">
            Шари карти
          </Typography>

          <Tooltip title="Шари">
            <IconButton size="small">
              <MapIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* 🔹 LIST */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {fields.length === 0 && (
            <Typography sx={{ fontSize: 12, opacity: 0.7 }}>
              Поля не знайдені.
            </Typography>
          )}

          {fields.map((field) => {
            const isActive = activeFieldId === field._id;

            return (
              <Paper
                key={field._id}
                sx={{
                  px: 1,
                  py: 0.6,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: isActive
                    ? "rgba(25,118,210,0.35)"
                    : "rgba(255,255,255,0.05)",
                  borderRadius: 1,
                  mb: 0.4,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: isActive
                      ? "rgba(25,118,210,0.45)"
                      : "rgba(255,255,255,0.12)",
                  },
                }}
              >
                {/* 🔹 Назва поля */}
                <Typography sx={{ fontSize: 12, color: "white" }}>
                  {field.properties.name}
                </Typography>

                {/* 🔹 Actions */}
                <Box sx={{ display: "flex", gap: 0.3 }}>
                  <Tooltip title={field.visible ? "Сховати" : "Показати"}>
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleToggleFieldVisibility(field)}
                    >
                      {field.visible ? (
                        <VisibilityIcon
                          sx={{ fontSize: 16, color: "white" }}
                        />
                      ) : (
                        <VisibilityOffIcon
                          sx={{ fontSize: 16, color: "white" }}
                        />
                      )}
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Центрувати на карті">
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleCenterMap(field)}
                    >
                      <LocationOnIcon
                        sx={{ fontSize: 16, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>

                  <Tooltip title="Редагувати">
                    <IconButton
                      size="small"
                      sx={{ p: 0.4 }}
                      onClick={() => handleEditField(field)}
                    >
                      <EditIcon
                        sx={{ fontSize: 16, color: "white" }}
                      />
                    </IconButton>
                  </Tooltip>
                </Box>
              </Paper>
            );
          })}
        </Box>
      </Paper>
    </Slide>
  );
}

