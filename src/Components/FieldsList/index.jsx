// import { useDispatch } from "react-redux";
// import { useFieldsData, useToggleFieldVisibility } from "../../hooks/useFieldsData";
// import { setMapCenter } from "../../store/mapCenterSlice";
// import { openAddFieldsModal, setSelectedField } from "../../store/modalSlice";
// import {
//   IconButton,
//   Box,
//   Paper,
//   Typography,
//   Tooltip,
//   Slide,
// } from "@mui/material";
// import EditIcon from "@mui/icons-material/Edit";
// import LocationOnIcon from "@mui/icons-material/LocationOn";
// import VisibilityIcon from "@mui/icons-material/Visibility";
// import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";
// import MapIcon from "@mui/icons-material/Map"; // імпорт іконки

// export default function FieldsList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: fields = [], isLoading, isError, error } = useFieldsData();
//   const toggleFieldVisibility = useToggleFieldVisibility();

//   const handleEditField = (field) => {
//     dispatch(setSelectedField(field._id));
//     dispatch(openAddFieldsModal());
//   };

//   const handleToggleFieldVisibility = (field) => {
//     toggleFieldVisibility.mutate({
//       fieldId: field._id,
//       isVisible: !field.visible,
//     });
//   };

//   const handleCenterMap = (field) => {
//     const bounds = L.geoJSON(field).getBounds();
//     const center = bounds.getCenter();
//     dispatch(setMapCenter([center.lat, center.lng]));
//   };

//   if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження полів...</Typography>;
//   if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
//   if (fields.length === 0) return <Typography sx={{ p: 2 }}>Поля не знайдені.</Typography>;

//   return (
//     <Slide direction="right" in={open} mountOnEnter unmountOnExit>
//       <Paper
//         elevation={3}
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           height: "100vh",
//           width: 350,
//           bgcolor: "rgba(33,33,33,0.85)",
//           color: "white",
//           borderRadius: "0 8px 8px 0",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Заголовок з іконкою */}
//         <Box
//           sx={{
//             display: "flex",
//             alignItems: "center",
//             justifyContent: "space-between",
//             px: 1,
//             py: 0.5,
//             borderBottom: "1px solid rgba(255,255,255,0.2)",
//             height: 56,
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight="bold">Шари карти</Typography>
//           <Tooltip title="Шари">
//             <IconButton size="small">
//               <MapIcon fontSize="small" sx={{ color: "white" }} />
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* Список полів */}
//         <Box
//           sx={{
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//             p: 1,
//             flex: 1,
//             overflowY: "auto",
//           }}
//         >
//           {fields.map((field) => (
//             <Paper
//               key={field._id}
//               sx={{
//                 p: 1,
//                 display: "flex",
//                 justifyContent: "space-between",
//                 alignItems: "center",
//                 bgcolor: "rgba(255,255,255,0.05)",
//                 borderRadius: 1,
//                 transition: "background 0.2s",
//                 "&:hover": {
//                   bgcolor: "rgba(25,118,210,0.2)",
//                 },
//               }}
//             >
//               <Typography sx={{ color: "white" }}>
//                 {field.properties.name}
//               </Typography>
//               <Box sx={{ display: "flex", gap: 0.5 }}>
//                 <Tooltip title={field.visible ? "Сховати" : "Показати"}>
//                   <IconButton
//                     size="small"
//                     onClick={() => handleToggleFieldVisibility(field)}
//                   >
//                     {field.visible ? (
//                       <VisibilityIcon fontSize="small" sx={{ color: "white" }} />
//                     ) : (
//                       <VisibilityOffIcon fontSize="small" sx={{ color: "white" }} />
//                     )}
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Центрувати на карті">
//                   <IconButton
//                     size="small"
//                     onClick={() => handleCenterMap(field)}
//                   >
//                     <LocationOnIcon fontSize="small" sx={{ color: "white" }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Редагувати">
//                   <IconButton
//                     size="small"
//                     onClick={() => handleEditField(field)}
//                   >
//                     <EditIcon fontSize="small" sx={{ color: "white" }} />
//                   </IconButton>
//                 </Tooltip>
//               </Box>
//             </Paper>
//           ))}
//         </Box>
//       </Paper>
//     </Slide>
//   );
// }


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

  const activeFieldId = useSelector((state) => state.activeField.activeFieldId);

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
    dispatch(setActiveField(field._id)); // 🆕 задаємо активне поле
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження полів...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (fields.length === 0) return <Typography sx={{ p: 2 }}>Поля не знайдені.</Typography>;

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
        {/* Заголовок з іконкою */}
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
              <MapIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Список полів */}
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
          {fields.map((field) => {
            const isActive = activeFieldId === field._id; // 🆕 перевірка активного поля
            return (
              <Paper
                key={field._id}
                sx={{
                  p: 1,
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  bgcolor: isActive ? "rgba(25,118,210,0.4)" : "rgba(255,255,255,0.05)", // 🆕 підсвітка
                  borderRadius: 1,
                  transition: "background 0.2s",
                  "&:hover": {
                    bgcolor: isActive ? "rgba(25,118,210,0.5)" : "rgba(25,118,210,0.2)",
                  },
                }}
              >
                <Typography sx={{ color: "white" }}>
                  {field.properties.name}
                </Typography>
                <Box sx={{ display: "flex", gap: 0.5 }}>
                  <Tooltip title={field.visible ? "Сховати" : "Показати"}>
                    <IconButton
                      size="small"
                      onClick={() => handleToggleFieldVisibility(field)}
                    >
                      {field.visible ? (
                        <VisibilityIcon fontSize="small" sx={{ color: "white" }} />
                      ) : (
                        <VisibilityOffIcon fontSize="small" sx={{ color: "white" }} />
                      )}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Центрувати на карті">
                    <IconButton
                      size="small"
                      onClick={() => handleCenterMap(field)}
                    >
                      <LocationOnIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </Tooltip>
                  <Tooltip title="Редагувати">
                    <IconButton
                      size="small"
                      onClick={() => handleEditField(field)}
                    >
                      <EditIcon fontSize="small" sx={{ color: "white" }} />
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
