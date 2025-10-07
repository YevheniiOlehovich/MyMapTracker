// import { useDispatch, useSelector } from "react-redux";
// import { useGroupsData, useDeleteGroup } from "../../hooks/useGroupsData";
// import { openAddGroupModal } from "../../store/modalSlice";
// import { IconButton, Box, Paper, Typography, Tooltip, Slide } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";

// export default function GroupsList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: groups = [], isLoading, isError, error } = useGroupsData();
//   const deleteGroup = useDeleteGroup();

//   // Отримуємо роль з Redux
//   const role = useSelector((state) => state.user.role);
//   console.log("Поточна роль користувача:", role);

//   const handleDelete = (id) => deleteGroup.mutate(id);
//   const handleEdit = (id) => dispatch(openAddGroupModal(id));
//   const handleAddGroup = () => dispatch(openAddGroupModal());

//   if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження даних...</Typography>;
//   if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
//   if (groups.length === 0) return <Typography sx={{ p: 2 }}>Групи не знайдено.</Typography>;

//   return (
//     <Slide direction="right" in={open} mountOnEnter unmountOnExit>
//       <Paper
//         elevation={3}
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0, // якщо Aside 60px шириною
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
//           <Typography variant="subtitle1" fontWeight="bold">
//             Групи
//           </Typography>
//           <Tooltip title="Додати групу">
//             <IconButton size="small" onClick={handleAddGroup}>
//               <AddIcon fontSize="small" sx={{ color: "white" }} />
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* Список груп */}
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, flex: 1, overflowY: "auto" }}>
//           {groups.map((group) => (
//             <Paper
//               key={group._id}
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
//               <Typography sx={{ color: "white" }}>{group.name}</Typography>
//               <Box sx={{ display: "flex", gap: 0.5 }}>
//                 <Tooltip title="Редагувати">
//                   <IconButton size="small" onClick={() => handleEdit(group._id)}>
//                     <EditIcon fontSize="small" sx={{ color: "white" }} />
//                   </IconButton>
//                 </Tooltip>
//                 <Tooltip title="Видалити">
//                   <IconButton size="small" onClick={() => handleDelete(group._id)}>
//                     <DeleteIcon fontSize="small" sx={{ color: "white" }} />
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






// import { useDispatch, useSelector } from "react-redux";
// import { useGroupsData, useDeleteGroup } from "../../hooks/useGroupsData";
// import { openAddGroupModal } from "../../store/modalSlice";
// import {
//   IconButton,
//   Box,
//   Paper,
//   Typography,
//   Tooltip,
//   Slide,
//   Fade,
// } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import { useState } from "react";

// export default function GroupsList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: groups = [], isLoading, isError, error } = useGroupsData();
//   const deleteGroup = useDeleteGroup();

//   // Отримуємо роль з Redux
//   const role = useSelector((state) => state.user.role);
//   console.log("Поточна роль користувача:", role);
//   const isGuest = role === "guest";

//   // Локальний стан для показу повідомлення
//   const [showAddMessage, setShowAddMessage] = useState(false);
//   const [showDeleteMessage, setShowDeleteMessage] = useState(null); // id групи, де показати повідомлення

//   const handleAddGroup = () => {
//     if (isGuest) {
//       setShowAddMessage(true);
//       setTimeout(() => setShowAddMessage(false), 2000);
//       return;
//     }
//     dispatch(openAddGroupModal());
//   };

//   const handleDelete = (id) => {
//     if (isGuest) {
//       setShowDeleteMessage(id);
//       setTimeout(() => setShowDeleteMessage(null), 2000);
//       return;
//     }
//     deleteGroup.mutate(id);
//   };

//   const handleEdit = (id) => dispatch(openAddGroupModal(id));

//   if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження даних...</Typography>;
//   if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
//   if (groups.length === 0) return <Typography sx={{ p: 2 }}>Групи не знайдено.</Typography>;

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
//             position: "relative",
//           }}
//         >
//           <Typography variant="subtitle1" fontWeight="bold">
//             Групи
//           </Typography>

//           {/* Кнопка додавання */}
//           <Box sx={{ position: "relative" }}>
//             <Tooltip title="Додати групу">
//               <IconButton size="small" onClick={handleAddGroup}>
//                 <AddIcon fontSize="small" sx={{ color: "white" }} />
//               </IconButton>
//             </Tooltip>

//             {/* Повідомлення про відсутність доступу */}
//             <Fade in={showAddMessage}>
//               <Typography
//                 variant="caption"
//                 sx={{
//                   position: "absolute",
//                   top: "100%",
//                   left: "50%",
//                   transform: "translateX(-50%)",
//                   mt: 0.5,
//                   color: "#ff5252",
//                   whiteSpace: "nowrap",
//                 }}
//               >
//                 Ви не маєте прав доступу
//               </Typography>
//             </Fade>
//           </Box>
//         </Box>

//         {/* Список груп */}
//         <Box sx={{ display: "flex", flexDirection: "column", gap: 1, p: 1, flex: 1, overflowY: "auto" }}>
//           {groups.map((group) => (
//             <Paper
//               key={group._id}
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
//                 position: "relative",
//               }}
//             >
//               <Typography sx={{ color: "white" }}>{group.name}</Typography>

//               {/* Іконки */}
//               <Box sx={{ display: "flex", gap: 0.5, position: "relative" }}>
//                 {/* Редагування доступне всім */}
//                 <Tooltip title="Редагувати">
//                   <IconButton size="small" onClick={() => handleEdit(group._id)}>
//                     <EditIcon fontSize="small" sx={{ color: "white" }} />
//                   </IconButton>
//                 </Tooltip>

//                 {/* Видалення блокується для guest */}
//                 <Tooltip title="Видалити">
//                   <IconButton size="small" onClick={() => handleDelete(group._id)}>
//                     <DeleteIcon fontSize="small" sx={{ color: "white" }} />
//                   </IconButton>
//                 </Tooltip>

//                 {/* Повідомлення під кнопкою Видалити */}
//                 <Fade in={showDeleteMessage === group._id}>
//                   <Typography
//                     variant="caption"
//                     sx={{
//                       position: "absolute",
//                       top: "100%",
//                       right: 0,
//                       mt: 0.5,
//                       color: "#ff5252",
//                       whiteSpace: "nowrap",
//                     }}
//                   >
//                     Ви не маєте прав доступу
//                   </Typography>
//                 </Fade>
//               </Box>
//             </Paper>
//           ))}
//         </Box>
//       </Paper>
//     </Slide>
//   );
// }











import { useDispatch, useSelector } from "react-redux";
import { useGroupsData, useDeleteGroup } from "../../hooks/useGroupsData";
import { openAddGroupModal } from "../../store/modalSlice";
import {
  IconButton,
  Box,
  Paper,
  Typography,
  Tooltip,
  Slide,
} from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";

export default function GroupsList({ open = true }) {
  const dispatch = useDispatch();
  const { data: groups = [], isLoading, isError, error } = useGroupsData();
  const deleteGroup = useDeleteGroup();

  // Отримуємо роль з Redux
  const role = useSelector((state) => state.user.role);
  console.log("Поточна роль користувача:", role);
  const isGuest = role === "guest";

  const handleAddGroup = () => {
    if (isGuest) return; // кнопка все одно заблокована
    dispatch(openAddGroupModal());
  };

  const handleDelete = (id) => {
    if (isGuest) return;
    deleteGroup.mutate(id);
  };

  const handleEdit = (id) => dispatch(openAddGroupModal(id));

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження даних...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (groups.length === 0) return <Typography sx={{ p: 2 }}>Групи не знайдено.</Typography>;

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
          <Typography variant="subtitle1" fontWeight="bold">
            Групи
          </Typography>

          {/* Кнопка додавання */}
          <Tooltip title={isGuest ? "Недостатньо прав для створення групи" : "Додати групу"}>
            <span>
              <IconButton
                size="small"
                onClick={handleAddGroup}
                disabled={isGuest}
                sx={{
                  opacity: isGuest ? 0.5 : 1,
                  pointerEvents: isGuest ? "none" : "auto",
                }}
              >
                <AddIcon fontSize="small" sx={{ color: "white" }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Список груп */}
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
          {groups.map((group) => (
            <Paper
              key={group._id}
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
              <Typography sx={{ color: "white" }}>{group.name}</Typography>

              {/* Іконки */}
              <Box sx={{ display: "flex", gap: 0.5 }}>
                {/* Редагування доступне всім */}
                <Tooltip title="Редагувати">
                  <span>
                    <IconButton size="small" onClick={() => handleEdit(group._id)}>
                      <EditIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </span>
                </Tooltip>

                {/* Видалення */}
                <Tooltip title={isGuest ? "Недостатньо прав для видалення" : "Видалити"}>
                  <span>
                    <IconButton
                      size="small"
                      onClick={() => handleDelete(group._id)}
                      disabled={isGuest}
                      sx={{
                        opacity: isGuest ? 0.5 : 1,
                        pointerEvents: isGuest ? "none" : "auto",
                      }}
                    >
                      <DeleteIcon fontSize="small" sx={{ color: "white" }} />
                    </IconButton>
                  </span>
                </Tooltip>
              </Box>
            </Paper>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}
