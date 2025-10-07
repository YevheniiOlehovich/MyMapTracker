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

// export default function VehicleList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
//   const { data: gpsData = [] } = useGpsData();
//   const { data: groups = [] } = useGroupsData();
//   const deleteVehicle = useDeleteVehicle();
//   const selectedDate = useSelector(state => state.calendar.selectedDate);

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
//           <Tooltip title="Додати техніку">
//             <IconButton size="small" onClick={handleAdd}>
//               <AddIcon fontSize="small" sx={{ color: "white" }} />
//             </IconButton>
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
//                       const imgSrc = vehicle.photoPath
//                         ? '/src/' + vehicle.photoPath.substring(3).replace(/\\/g, '/')
//                         : QuestionIco;

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
//                             <Tooltip title="Видалити">
//                               <IconButton size="small" onClick={() => handleDelete(vehicle._id)}>
//                                 <DeleteIcon fontSize="small" sx={{ color: "white" }} />
//                               </IconButton>
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
import { useGpsData } from "../../hooks/useGpsData";
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
  const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
  const { data: gpsData = [] } = useGpsData();
  const { data: groups = [] } = useGroupsData();
  const deleteVehicle = useDeleteVehicle();
  const selectedDate = useSelector(state => state.calendar.selectedDate);
  
  const role = useSelector((state) => state.user.role); // ✅ беремо роль із Redux
  
  const isGuest = role === "guest";

  const handleAdd = () => dispatch(openAddVehicleModal());
  const handleEdit = (id) => dispatch(openAddVehicleModal({ vehicleId: id }));
  const handleDelete = (id) => deleteVehicle.mutate(id);

  // Фільтрація GPS даних по даті
  const filteredGpsData = useMemo(() => {
    if (!gpsData || !selectedDate) return [];
    const selectedDateFormatted = selectedDate.split("T")[0];
    return gpsData.filter(item => item.date === selectedDateFormatted);
  }, [gpsData, selectedDate]);

  const lastGpsPoints = useMemo(() => {
    return filteredGpsData
      .map(item => {
        const validPoints = item.data.filter(p => p.latitude !== 0 && p.longitude !== 0);
        return validPoints.length > 0 ? { ...validPoints[validPoints.length - 1], imei: item.imei } : null;
      })
      .filter(point => point !== null);
  }, [filteredGpsData]);

  const showVehicleLocation = (vehicle) => {
    const selectedVehicle = lastGpsPoints.find(p => p.imei === vehicle.imei);
    if (selectedVehicle) {
      dispatch(setMapCenter({ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude }));
    }
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження техніки...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (vehicles.length === 0) return <Typography sx={{ p: 2 }}>Техніка не знайдена.</Typography>;

  const getGroupName = (groupId) => {
    const group = groups.find(g => g._id === groupId);
    return group ? group.name : "Без групи";
  };

  const groupedByGroup = vehicles.reduce((acc, vehicle) => {
    const groupId = vehicle.groupId || "noGroup";
    if (!acc[groupId]) acc[groupId] = [];
    acc[groupId].push(vehicle);
    return acc;
  }, {});

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
            alignItems: "center",
            justifyContent: "space-between",
            px: 1,
            py: 0.5,
            borderBottom: "1px solid rgba(255,255,255,0.2)",
            height: 56,
          }}
        >
          <Typography variant="subtitle1" fontWeight="bold">Транспорт</Typography>
          <Tooltip title={isGuest ? "Недоступно для гостей" : "Додати техніку"}>
            <span>
              <IconButton size="small" onClick={handleAdd} disabled={isGuest}>
                <AddIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Список груп і транспортних засобів */}
        <Box
          sx={{
            flex: 1,
            overflowY: "auto",
            display: "flex",
            flexDirection: "column",
            gap: 1,
            p: 1,
          }}
        >
          {Object.entries(groupedByGroup).map(([groupId, vehiclesInGroup]) => (
            <Box key={groupId}>
              <Typography sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
                {getGroupName(groupId)}
              </Typography>
              {vehicleTypes.map(({ _id: typeId, name: typeName }) => {
                const vehiclesOfType = vehiclesInGroup.filter(v => v.vehicleType === typeId);
                if (vehiclesOfType.length === 0) return null;

                return (
                  <Box key={typeId} sx={{ mb: 1 }}>
                    <Typography sx={{ fontStyle: "italic", mb: 0.5 }}>{typeName}</Typography>
                    {vehiclesOfType.map(vehicle => {
                      const imgSrc = vehicle.photoPath
                        ? '/src/' + vehicle.photoPath.substring(3).replace(/\\/g, '/')
                        : QuestionIco;

                      return (
                        <Paper
                          key={vehicle._id}
                          sx={{
                            p: 1,
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                            bgcolor: "rgba(255,255,255,0.05)",
                            borderRadius: 1,
                            transition: "background 0.2s",
                            "&:hover": {
                              bgcolor: "rgba(25,118,210,0.2)",
                            },
                          }}
                        >
                          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                            <Box
                              component="img"
                              src={imgSrc}
                              alt={vehicle.mark}
                              sx={{ width: 32, height: 32, borderRadius: "20%", objectFit: "cover" }}
                            />
                            <Typography sx={{ color: "white" }}>{vehicle.mark}</Typography>
                          </Box>
                          <Box sx={{ display: "flex", gap: 0.5 }}>
                            <Tooltip title="Показати локацію">
                              <IconButton size="small" onClick={() => showVehicleLocation(vehicle)}>
                                <LocationOnIcon fontSize="small" sx={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Редагувати">
                              <IconButton size="small" onClick={() => handleEdit(vehicle._id)}>
                                <EditIcon fontSize="small" sx={{ color: "white" }} />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title={isGuest ? "Недоступно для гостей" : "Видалити"}>
                              <span>
                                <IconButton size="small" onClick={() => handleDelete(vehicle._id)} disabled={isGuest}>
                                  <DeleteIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
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
