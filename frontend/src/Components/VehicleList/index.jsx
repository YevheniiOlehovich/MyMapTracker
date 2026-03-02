// import { useState, useMemo } from "react";
// import { useDispatch, useSelector } from "react-redux";
// import { openAddVehicleModal } from "../../store/modalSlice";
// import { useVehiclesData, useDeleteVehicle } from "../../hooks/useVehiclesData";
// import { useGpsData } from "../../hooks/useGpsData";
// import { useGroupsData } from "../../hooks/useGroupsData";
// import { setMapCenter } from "../../store/mapCenterSlice";
// import {
//   Box,
//   Paper,
//   Typography,
//   IconButton,
//   Tooltip,
//   Slide
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import LocationOnIcon from "@mui/icons-material/LocationOn";

// import QuestionIco from "../../assets/ico/10965421.webp";
// import { vehicleTypes } from "../../helpres";
// import { BACKEND_URL } from "../../helpres";

// export default function VehicleList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
//   const { data: gpsData = [] } = useGpsData();
//   const { data: groups = [] } = useGroupsData();
//   const deleteVehicle = useDeleteVehicle();
//   const selectedDate = useSelector(state => state.calendar.selectedDate);
  
//   const role = useSelector((state) => state.user.role); // ✅ беремо роль із Redux
  
//   const isGuest = role === "guest";

//   const handleAdd = () => dispatch(openAddVehicleModal());
//   const handleEdit = (id) => dispatch(openAddVehicleModal({ vehicleId: id }));
//   const handleDelete = (id) => deleteVehicle.mutate(id);

//   // Фільтрація GPS даних по даті
//   const filteredGpsData = useMemo(() => {
//     if (!gpsData || !selectedDate) return [];
//     const selectedDateFormatted = selectedDate.split("T")[0];
//     return gpsData.filter(item => item.date === selectedDateFormatted);
//   }, [gpsData, selectedDate]);

//   const lastGpsPoints = useMemo(() => {
//     return filteredGpsData
//       .map(item => {
//         const validPoints = item.data.filter(p => p.latitude !== 0 && p.longitude !== 0);
//         return validPoints.length > 0 ? { ...validPoints[validPoints.length - 1], imei: item.imei } : null;
//       })
//       .filter(point => point !== null);
//   }, [filteredGpsData]);

//   const showVehicleLocation = (vehicle) => {
//     const selectedVehicle = lastGpsPoints.find(p => p.imei === vehicle.imei);
//     if (selectedVehicle) {
//       dispatch(setMapCenter({ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude }));
//     }
//   };

//   if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження техніки...</Typography>;
//   if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
//   if (vehicles.length === 0) return <Typography sx={{ p: 2 }}>Техніка не знайдена.</Typography>;

//   const getGroupName = (groupId) => {
//     const group = groups.find(g => g._id === groupId);
//     return group ? group.name : "Без групи";
//   };

//   const groupedByGroup = vehicles.reduce((acc, vehicle) => {
//     const groupId = vehicle.groupId || "noGroup";
//     if (!acc[groupId]) acc[groupId] = [];
//     acc[groupId].push(vehicle);
//     return acc;
//   }, {});

//   return (
//     <Slide direction="right" in={open} mountOnEnter unmountOnExit>
//       <Paper
//         elevation={3}
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0,
//           width: 350,
//           height: "100vh",
//           bgcolor: "rgba(33,33,33,0.85)",
//           color: "white",
//           borderRadius: "0 8px 8px 0",
//           overflow: "hidden",
//           display: "flex",
//           flexDirection: "column",
//         }}
//       >
//         {/* Заголовок */}
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
//           <Typography variant="subtitle1" fontWeight="bold">Транспорт</Typography>
//           <Tooltip title={isGuest ? "Недоступно для гостей" : "Додати техніку"}>
//             <span>
//               <IconButton size="small" onClick={handleAdd} disabled={isGuest}>
//                 <AddIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
//               </IconButton>
//             </span>
//           </Tooltip>
//         </Box>

//         {/* Список груп і транспортних засобів */}
//         <Box
//           sx={{
//             flex: 1,
//             overflowY: "auto",
//             display: "flex",
//             flexDirection: "column",
//             gap: 1,
//             p: 1,
//           }}
//         >
//           {Object.entries(groupedByGroup).map(([groupId, vehiclesInGroup]) => (
//             <Box key={groupId}>
//               <Typography sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 {getGroupName(groupId)}
//               </Typography>
//               {vehicleTypes.map(({ _id: typeId, name: typeName }) => {
//                 const vehiclesOfType = vehiclesInGroup.filter(v => v.vehicleType === typeId);
//                 if (vehiclesOfType.length === 0) return null;

//                 return (
//                   <Box key={typeId} sx={{ mb: 1 }}>
//                     <Typography sx={{ fontStyle: "italic", mb: 0.5 }}>{typeName}</Typography>
//                     {vehiclesOfType.map(vehicle => {
//                       // const imgSrc = vehicle.photoPath
//                       //   ? `${BACKEND_URL}/${vehicle.photoPath.replace(/\\/g, '/')}`
//                       //   : QuestionIco;

//                       // Зображення на проді
//                         const imgSrc = vehicle.photoPath
//                           ? `/uploads/${vehicle.photoPath.replace(/\\/g, '/').split('uploads/')[1]}`
//                           : QuestionIco;

//                       return (
//                         <Paper
//                           key={vehicle._id}
//                           sx={{
//                             p: 1,
//                             display: "flex",
//                             justifyContent: "space-between",
//                             alignItems: "center",
//                             bgcolor: "rgba(255,255,255,0.05)",
//                             borderRadius: 1,
//                             transition: "background 0.2s",
//                             "&:hover": {
//                               bgcolor: "rgba(25,118,210,0.2)",
//                             },
//                           }}
//                         >
//                           <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                             <Box
//                               component="img"
//                               src={imgSrc}
//                               alt={vehicle.mark}
//                               sx={{ width: 32, height: 32, borderRadius: "20%", objectFit: "cover" }}
//                             />
//                             <Typography sx={{ color: "white" }}>{vehicle.mark}</Typography>
//                           </Box>
//                           <Box sx={{ display: "flex", gap: 0.5 }}>
//                             <Tooltip title="Показати локацію">
//                               <IconButton size="small" onClick={() => showVehicleLocation(vehicle)}>
//                                 <LocationOnIcon fontSize="small" sx={{ color: "white" }} />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title="Редагувати">
//                               <IconButton size="small" onClick={() => handleEdit(vehicle._id)}>
//                                 <EditIcon fontSize="small" sx={{ color: "white" }} />
//                               </IconButton>
//                             </Tooltip>
//                             <Tooltip title={isGuest ? "Недоступно для гостей" : "Видалити"}>
//                               <span>
//                                 <IconButton size="small" onClick={() => handleDelete(vehicle._id)} disabled={isGuest}>
//                                   <DeleteIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
//                                 </IconButton>
//                               </span>
//                             </Tooltip>
//                           </Box>
//                         </Paper>
//                       );
//                     })}
//                   </Box>
//                 );
//               })}
//             </Box>
//           ))}
//         </Box>
//       </Paper>
//     </Slide>
//   );
// }






import { useState, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { openAddVehicleModal } from "../../store/modalSlice";
import { useVehiclesData, useDeleteVehicle } from "../../hooks/useVehiclesData";
import { useLastGpsByDate } from "../../hooks/useLastGpsByDate";
import { useGroupsData } from "../../hooks/useGroupsData";
import { setMapCenter } from "../../store/mapCenterSlice";
import {
  Box,
  Paper,
  Typography,
  IconButton,
  Tooltip,
  Slide
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import LocationOnIcon from "@mui/icons-material/LocationOn";

import QuestionIco from "../../assets/ico/10965421.webp";
import { vehicleTypes } from "../../helpres";

export default function VehicleList({ open = true }) {
  const dispatch = useDispatch();

  const { data: vehicles = [], isLoading } = useVehiclesData();
  const { data: lastGpsPoints = [] } = useLastGpsByDate();
  const { data: groups = [] } = useGroupsData();

  const deleteVehicle = useDeleteVehicle();

  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const handleAdd = () => dispatch(openAddVehicleModal());
  const handleEdit = (id) => dispatch(openAddVehicleModal({ vehicleId: id }));
  const handleDelete = (id) => deleteVehicle.mutate(id);

  // ---------------------------------------------------
  // 🧠 Статус техніки
  // ---------------------------------------------------
  const getVehicleStatus = (vehicle) => {
    const point = lastGpsPoints.find(p => p.imei === vehicle.imei);
    if (!point) return 3; // 🔴 Offline

    const diffMinutes =
      (Date.now() - new Date(point.timestamp).getTime()) / 60000;

    if (diffMinutes <= 5) return 1; // 🟢 Online
    return 2; // 🟡 Idle
  };

  const getStatusColor = (status) => {
    if (status === 1) return "#4caf50";
    if (status === 2) return "#ff9800";
    return "#f44336";
  };

  // ---------------------------------------------------
  // 🔥 Сортування
  // ---------------------------------------------------
  const sortedVehicles = useMemo(() => {
    return [...vehicles].sort((a, b) => {
      const statusA = getVehicleStatus(a);
      const statusB = getVehicleStatus(b);

      if (statusA !== statusB) return statusA - statusB;

      return a.mark.localeCompare(b.mark);
    });
  }, [vehicles, lastGpsPoints]);

  const groupedByGroup = sortedVehicles.reduce((acc, vehicle) => {
    const groupId = vehicle.groupId || "noGroup";
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(vehicle);
    return acc;
  }, {});

  const getGroupName = (groupId) => {
    const group = groups.find(g => g._id === groupId);
    return group ? group.name : "Без групи";
  };

  const showVehicleLocation = (vehicle) => {
    const point = lastGpsPoints.find(p => p.imei === vehicle.imei);
    if (point) {
      dispatch(setMapCenter({ lat: point.latitude, lng: point.longitude }));
    }
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження техніки...</Typography>;

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
        {/* Заголовок */}
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
            Транспорт
          </Typography>
          <Tooltip title={isGuest ? "Недоступно для гостей" : "Додати техніку"}>
            <span>
              <IconButton size="small" onClick={handleAdd} disabled={isGuest}>
                <AddIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Список */}
        <Box sx={{ flex: 1, overflowY: "auto", p: 1 }}>
          {Object.entries(groupedByGroup).map(([groupId, vehiclesInGroup]) => (
            <Box key={groupId}>
              <Typography sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
                {getGroupName(groupId)}
              </Typography>

              {vehicleTypes.map(({ _id: typeId, name: typeName }) => {
                const vehiclesOfType = vehiclesInGroup.filter(v => v.vehicleType === typeId);
                if (!vehiclesOfType.length) return null;

                return (
                  <Box key={typeId} sx={{ mb: 1 }}>
                    <Typography
                      sx={{
                        fontStyle: "italic",
                        mb: 0.3,
                        fontSize: 12,
                        opacity: 0.7,
                      }}
                    >
                      {typeName}
                    </Typography>

                    {vehiclesOfType.map(vehicle => {
                      const status = getVehicleStatus(vehicle);
                      const imgSrc = vehicle.photoPath
                        ? `/uploads/${vehicle.photoPath.replace(/\\/g, '/').split('uploads/')[1]}`
                        : QuestionIco;

                      return (
                        <Paper
                          key={vehicle._id}
                          sx={{
                            px: 1,
                            py: 0.6,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "rgba(255,255,255,0.05)",
                            borderRadius: 1,
                            mb: 0.4,
                          }}
                        >                         
                          <Box sx={{ display: "flex", alignItems: "center", gap: 0.8 }}>
                            <Box
                              sx={{
                                width: 6,
                                height: 6,
                                borderRadius: "50%",
                                bgcolor: getStatusColor(status),
                              }}
                            />

                            <Box
                              component="img"
                              src={imgSrc}
                              alt={vehicle.mark}
                              sx={{
                                width: 26,
                                height: 26,
                                borderRadius: 1,
                                objectFit: "cover",
                              }}
                            />

                            <Typography sx={{ fontSize: 12 }}>
                              {vehicle.mark}
                            </Typography>
                          </Box>


                          <Box sx={{ display: "flex", gap: 0.3 }}>
                            <Tooltip title="Показати локацію">
                              <IconButton size="small" sx={{ p: 0.4 }} onClick={() => showVehicleLocation(vehicle)}>
                                <LocationOnIcon sx={{ fontSize: 16, color: "white" }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title="Редагувати">
                              <IconButton size="small" sx={{ p: 0.4 }} onClick={() => handleEdit(vehicle._id)}>
                                <EditIcon sx={{ fontSize: 16, color: "white" }} />
                              </IconButton>
                            </Tooltip>

                            <Tooltip title={isGuest ? "Недоступно для гостей" : "Видалити"}>
                              <span>
                                <IconButton
                                  size="small"
                                  sx={{ p: 0.4 }}
                                  onClick={() => handleDelete(vehicle._id)}
                                  disabled={isGuest}
                                >
                                  <DeleteIcon sx={{ fontSize: 16, color: isGuest ? "gray" : "white" }} />
                                </IconButton>
                              </span>
                            </Tooltip>
                          </Box>
                        </Paper>
                      );
                    })}
                  </Box>
                );
              })}
            </Box>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}