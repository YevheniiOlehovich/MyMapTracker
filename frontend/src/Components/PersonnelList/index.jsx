// import { useDispatch } from "react-redux";
// import { usePersonnelData, useDeletePersonnel } from "../../hooks/usePersonnelData";
// import { useGroupsData } from "../../hooks/useGroupsData";
// import { openAddPersonalModal } from "../../store/modalSlice";
// import { IconButton, Box, Paper, Typography, Tooltip, Slide } from "@mui/material";
// import AddIcon from "@mui/icons-material/Add";
// import EditIcon from "@mui/icons-material/Edit";
// import DeleteIcon from "@mui/icons-material/Delete";
// import QuestionIco from '../../assets/ico/10965421.webp';

// export default function PersonnelList({ open = true }) {
//   const dispatch = useDispatch();
//   const { data: personnel = [], isLoading, isError, error } = usePersonnelData();
//   const { data: groups = [] } = useGroupsData();
//   const deletePersonnel = useDeletePersonnel();

//   const handleEdit = (id) => dispatch(openAddPersonalModal({ personId: id }));
//   const handleAdd = () => dispatch(openAddPersonalModal());
//   const handleDelete = (id) => deletePersonnel.mutate(id);

//   const getGroupName = (groupId) => {
//     const group = groups.find(g => g._id === groupId);
//     return group ? group.name : "Без групи";
//   };

//   if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження персоналу...</Typography>;
//   if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
//   if (personnel.length === 0) return <Typography sx={{ p: 2 }}>Персонал не знайдено.</Typography>;

//   // Групуємо персонал по groupId
//   const groupedByGroup = personnel.reduce((acc, person) => {
//     const key = person.groupId || "noGroup";
//     if (!acc[key]) acc[key] = [];
//     acc[key].push(person);
//     return acc;
//   }, {});

//   return (
//     <Slide direction="right" in={open} mountOnEnter unmountOnExit>
//       <Paper
//         elevation={3}
//         sx={{
//           position: "absolute",
//           top: 0,
//           left: 0, // праворуч від Aside, якщо Aside ширина 60px
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
//           <Typography variant="subtitle1" fontWeight="bold">Персонал</Typography>
//           <Tooltip title="Додати персонал">
//             <IconButton size="small" onClick={handleAdd}>
//               <AddIcon fontSize="small" sx={{ color: "white" }} />
//             </IconButton>
//           </Tooltip>
//         </Box>

//         {/* Скрол-контейнер для списку */}
//         <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
//           {Object.entries(groupedByGroup).map(([groupId, people]) => (
//             <Box key={groupId}>
//               <Typography sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
//                 {getGroupName(groupId)}
//               </Typography>
//               {people.map((person) => {
//                 const imgSrc = person.photoPath
//                   ? '/src/' + person.photoPath.substring(3).replace(/\\/g, '/')
//                   : QuestionIco;

//                 return (
//                   <Paper
//                     key={person._id}
//                     sx={{
//                       p: 1,
//                       display: "flex",
//                       justifyContent: "space-between",
//                       alignItems: "center",
//                       bgcolor: "rgba(255,255,255,0.05)",
//                       borderRadius: 1,
//                       transition: "background 0.2s",
//                       "&:hover": { bgcolor: "rgba(25,118,210,0.2)" },
//                     }}
//                   >
//                     <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
//                       <Box
//                         component="img"
//                         src={imgSrc}
//                         alt={person.firstName}
//                         sx={{ width: 32, height: 32, borderRadius: "20%", objectFit: "cover" }}
//                       />
//                       <Typography sx={{ color: "white" }}>
//                         {person.lastName} {person.firstName}
//                       </Typography>
//                     </Box>
//                     <Box sx={{ display: "flex", gap: 0.5 }}>
//                       <Tooltip title="Редагувати">
//                         <IconButton size="small" onClick={() => handleEdit(person._id)}>
//                           <EditIcon fontSize="small" sx={{ color: "white" }} />
//                         </IconButton>
//                       </Tooltip>
//                       <Tooltip title="Видалити">
//                         <IconButton size="small" onClick={() => handleDelete(person._id)}>
//                           <DeleteIcon fontSize="small" sx={{ color: "white" }} />
//                         </IconButton>
//                       </Tooltip>
//                     </Box>
//                   </Paper>
//                 );
//               })}
//             </Box>
//           ))}
//         </Box>
//       </Paper>
//     </Slide>
//   );
// }





import { useDispatch, useSelector } from "react-redux";
import { usePersonnelData, useDeletePersonnel } from "../../hooks/usePersonnelData";
import { useGroupsData } from "../../hooks/useGroupsData";
import { openAddPersonalModal } from "../../store/modalSlice";
import { IconButton, Box, Paper, Typography, Tooltip, Slide } from "@mui/material";
import AddIcon from "@mui/icons-material/Add";
import EditIcon from "@mui/icons-material/Edit";
import DeleteIcon from "@mui/icons-material/Delete";
import QuestionIco from '../../assets/ico/10965421.webp';
import { BACKEND_URL } from "../../helpres";

export default function PersonnelList({ open = true }) {
  const dispatch = useDispatch();
  const { data: personnel = [], isLoading, isError, error } = usePersonnelData();
  const { data: groups = [] } = useGroupsData();
  const deletePersonnel = useDeletePersonnel();

  console.log(personnel);

  // ✅ слухаємо роль
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const handleEdit = (id) => dispatch(openAddPersonalModal({ personId: id }));

  const handleAdd = () => {
    if (isGuest) return; // підстраховка
    dispatch(openAddPersonalModal());
  };

  const handleDelete = (id) => {
    if (isGuest) return;
    deletePersonnel.mutate(id);
  };

  const getGroupName = (groupId) => {
    const group = groups.find((g) => g._id === groupId);
    return group ? group.name : "Без групи";
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження персоналу...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка: {error?.message}</Typography>;
  if (personnel.length === 0) return <Typography sx={{ p: 2 }}>Персонал не знайдено.</Typography>;

  // Групуємо персонал по groupId
  const groupedByGroup = personnel.reduce((acc, person) => {
    const key = person.groupId || "noGroup";
    if (!acc[key]) acc[key] = [];
    acc[key].push(person);
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
            Персонал
          </Typography>
          <Tooltip title={isGuest ? "У вас немає прав для додавання персоналу" : "Додати персонал"}>
            <span>
              <IconButton size="small" onClick={handleAdd} disabled={isGuest}>
                <AddIcon fontSize="small" sx={{ color: isGuest ? "gray" : "white" }} />
              </IconButton>
            </span>
          </Tooltip>
        </Box>

        {/* Список персоналу */}
        <Box sx={{ flex: 1, overflowY: "auto", display: "flex", flexDirection: "column", gap: 1, p: 1 }}>
          {Object.entries(groupedByGroup).map(([groupId, people]) => (
            <Box key={groupId}>
              <Typography sx={{ fontWeight: "bold", mt: 1, mb: 0.5 }}>
                {getGroupName(groupId)}
              </Typography>
              {people.map((person) => {
                // const imgSrc = person.photoPath
                //   ? '/src/' + person.photoPath.substring(3).replace(/\\/g, '/')
                //   : QuestionIco;

                const imgSrc = person.photoPath
                  ? `${BACKEND_URL}/${person.photoPath.replace(/\\/g, '/')}`
                  : QuestionIco;

                return (
                  <Paper
                    key={person._id}
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
                    <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                      <Box
                        component="img"
                        src={imgSrc}
                        alt={person.firstName}
                        sx={{ width: 32, height: 32, borderRadius: "20%", objectFit: "cover" }}
                      />
                      <Typography sx={{ color: "white" }}>
                        {person.lastName} {person.firstName}
                      </Typography>
                    </Box>
                    <Box sx={{ display: "flex", gap: 0.5 }}>
                      <Tooltip title="Редагувати">
                        <IconButton size="small" onClick={() => handleEdit(person._id)}>
                          <EditIcon fontSize="small" sx={{ color: "white" }} />
                        </IconButton>
                      </Tooltip>

                      <Tooltip title={isGuest ? "У вас немає прав для видалення" : "Видалити"}>
                        <span>
                          <IconButton
                            size="small"
                            onClick={() => handleDelete(person._id)}
                            disabled={isGuest}
                          >
                            <DeleteIcon
                              fontSize="small"
                              sx={{ color: isGuest ? "gray" : "white" }}
                            />
                          </IconButton>
                        </span>
                      </Tooltip>
                    </Box>
                  </Paper>
                );
              })}
            </Box>
          ))}
        </Box>
      </Paper>
    </Slide>
  );
}






