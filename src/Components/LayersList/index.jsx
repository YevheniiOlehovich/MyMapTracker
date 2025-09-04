import { useDispatch, useSelector } from "react-redux";
import {
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
  IconButton,
  Switch,
  Radio,
  RadioGroup,
  FormControlLabel,
} from "@mui/material";
import LayersIcon from "@mui/icons-material/Layers";
import { setMapType } from "../../store/mapSlice";
import {
  toggleFields,
  toggleCadastre,
  toggleGeozones,
  toggleUnits,
  toggleRent,
  toggleProperty,
  selectShowFields,
  selectShowCadastre,
  selectShowGeozones,
  selectShowUnits,
  selectShowRent,
  selectShowProperty,
} from "../../store/layersList";

export default function LayersList({ open = true }) {
  const dispatch = useDispatch();

  const mapType = useSelector((state) => state.map.type);
  const showFields = useSelector(selectShowFields);
  const showCadastre = useSelector(selectShowCadastre);
  const showGeozones = useSelector(selectShowGeozones);
  const showUnits = useSelector(selectShowUnits);
  const showRent = useSelector(selectShowRent);
  const showProperty = useSelector(selectShowProperty);

  const mapOptions = [
    { value: "google_roadmap", label: "Google Maps" },
    { value: "google_satellite", label: "Google Satellite" },
    { value: "google_hybrid", label: "Google Hybrid" },
    { value: "google_terrain", label: "Google Terrain" },
    { value: "osm", label: "OpenStreetMap" },
    { value: "osm_hot", label: "OpenStreetMap HOT" },
    { value: "osm_topo", label: "OpenStreetMap TOPO" },
  ];

  const geoOptions = [
    { value: "fields", checked: showFields, handler: () => dispatch(toggleFields()), label: "Поля" },
    { value: "cadastre", checked: showCadastre, handler: () => dispatch(toggleCadastre()), label: "Кадастр" },
    { value: "geozones", checked: showGeozones, handler: () => dispatch(toggleGeozones()), label: "Геозони" },
    { value: "units", checked: showUnits, handler: () => dispatch(toggleUnits()), label: "Господарчі ділянки" },
    { value: "rent", checked: showRent, handler: () => dispatch(toggleRent()), label: "Орендовані ділянки" },
    { value: "property", checked: showProperty, handler: () => dispatch(toggleProperty()), label: "Ділянки у власності" },
  ];

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
        {/* Заголовок */}
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
          <Typography variant="subtitle1" fontWeight="bold">Шари карти</Typography>
          <Tooltip title="Шари">
            <IconButton size="small">
              <LayersIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Контейнер зі скролом */}
        <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2, p: 1 }}>
          {/* Тип карти */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Тип карти</Typography>
            <Paper sx={{ p: 1, bgcolor: "rgba(255,255,255,0.05)", borderRadius: 1 }}>
              <RadioGroup value={mapType} onChange={(e) => dispatch(setMapType(e.target.value))}>
                {mapOptions.map((option) => (
                  <FormControlLabel
                    key={option.value}
                    value={option.value}
                    control={<Radio size="small" sx={{ color: "white" }} />}
                    label={<Typography sx={{ color: "white" }}>{option.label}</Typography>}
                  />
                ))}
              </RadioGroup>
            </Paper>
          </Box>

          {/* Геошари */}
          <Box>
            <Typography sx={{ fontWeight: "bold", mb: 1 }}>Шари геоданих</Typography>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
              {geoOptions.map((option) => (
                <Paper
                  key={option.value}
                  sx={{
                    p: 1,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    bgcolor: "rgba(255,255,255,0.05)",
                    borderRadius: 1,
                    transition: "background 0.2s",
                    "&:hover": { bgcolor: "rgba(25,118,210,0.2)" },
                  }}
                >
                  <Typography sx={{ color: "white" }}>{option.label}</Typography>
                  <Switch size="small" checked={option.checked} onChange={option.handler} />
                </Paper>
              ))}
            </Box>
          </Box>
        </Box>
      </Paper>
    </Slide>
  );
}
