// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useGroupsData, useUpdateGroup, useSaveGroup } from "../../hooks/useGroupsData";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   IconButton,
//   Box,
//   Typography,
//   Paper,
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// export default function AddGroupModal({ onClose }) {
//   const { data: groups = [] } = useGroupsData();
//   const updateGroup = useUpdateGroup();
//   const saveGroup = useSaveGroup();

//   const editGroupId = useSelector((state) => state.modals.editGroupId);
//   const editGroup = groups.find((group) => group._id === editGroupId);

//   const [groupName, setGroupName] = useState(editGroup ? editGroup.name : "");
//   const [groupOwnership, setGroupOwnership] = useState(editGroup ? editGroup.ownership : "");
//   const [groupDescription, setGroupDescription] = useState(editGroup ? editGroup.description : "");

//   useEffect(() => {
//     if (editGroup) {
//       setGroupName(editGroup.name);
//       setGroupOwnership(editGroup.ownership);
//       setGroupDescription(editGroup.description);
//     }
//   }, [editGroup]);

//   const handleSave = () => {
//     const groupData = {
//       name: groupName,
//       ownership: groupOwnership,
//       description: groupDescription,
//     };

//     if (editGroupId) {
//       updateGroup.mutate(
//         { groupId: editGroupId, groupData },
//         {
//           onSuccess: () => {
//             console.log(`Group with ID ${editGroupId} updated successfully.`);
//             onClose();
//           },
//           onError: (error) => console.error("Помилка при оновленні групи:", error.message),
//         }
//       );
//     } else {
//       saveGroup.mutate(groupData, {
//         onSuccess: () => {
//           console.log("Нова група успішно створена.");
//           onClose();
//         },
//         onError: (error) => console.error("Помилка при створенні групи:", error.message),
//       });
//     }
//   };

//   return (
//     <Dialog
//         open={true}
//         onClose={onClose}
//         maxWidth="xs"
//         fullWidth
//         PaperProps={{
//             sx: {
//             borderRadius: 2,
//             overflow: "hidden",
//             boxShadow: 6,
//             bgcolor: "rgba(33,33,33,0.85)", // темно-сірий фон
//             color: "white",
//             },
//         }}
//         >
//         <DialogTitle
//             sx={{
//             display: "flex",
//             justifyContent: "space-between",
//             alignItems: "center",
//             backgroundColor: "rgba(50,50,50,0.95)", // трохи світліше для заголовка
//             color: "white",
//             py: 1,
//             px: 2,
//             fontWeight: 600,
//             fontSize: "16px",
//             }}
//         >
//             {editGroupId ? "Редагування групи" : "Створення нової групи"}
//             <IconButton onClick={onClose} size="small" sx={{ color: "white" }}>
//             <CloseIcon />
//             </IconButton>
//         </DialogTitle>

//         <DialogContent dividers sx={{ px: 2, py: 1.5, bgcolor: "rgba(50,50,50,0.9)" }}>
//             <Box display="flex" flexDirection="column" gap={1.5}>
//             <TextField
//                 label="Назва групи"
//                 value={groupName}
//                 onChange={(e) => setGroupName(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 InputLabelProps={{ style: { color: "white" } }}
//                 sx={{
//                 "& .MuiOutlinedInput-root": {
//                     borderRadius: 1.5,
//                     color: "white",
//                     bgcolor: "rgba(255,255,255,0.05)",
//                 },
//                 "& .MuiOutlinedInput-root.Mui-focused": {
//                     boxShadow: "0 0 4px rgba(255,255,255,0.2)",
//                     borderColor: "white",
//                 },
//                 "& .MuiInputLabel-root": { color: "white" },
//                 }}
//             />
//             <TextField
//                 label="Приналежність групи"
//                 value={groupOwnership}
//                 onChange={(e) => setGroupOwnership(e.target.value)}
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 InputLabelProps={{ style: { color: "white" } }}
//                 sx={{
//                 "& .MuiOutlinedInput-root": {
//                     borderRadius: 1.5,
//                     color: "white",
//                     bgcolor: "rgba(255,255,255,0.05)",
//                 },
//                 "& .MuiOutlinedInput-root.Mui-focused": {
//                     boxShadow: "0 0 4px rgba(255,255,255,0.2)",
//                     borderColor: "white",
//                 },
//                 "& .MuiInputLabel-root": { color: "white" },
//                 }}
//             />
//             <TextField
//                 label="Опис групи"
//                 value={groupDescription}
//                 onChange={(e) => setGroupDescription(e.target.value)}
//                 multiline
//                 rows={3}
//                 inputProps={{ maxLength: 200 }}
//                 fullWidth
//                 variant="outlined"
//                 size="small"
//                 InputLabelProps={{ style: { color: "white" } }}
//                 sx={{
//                 "& .MuiOutlinedInput-root": {
//                     borderRadius: 1.5,
//                     color: "white",
//                     bgcolor: "rgba(255,255,255,0.05)",
//                 },
//                 "& .MuiOutlinedInput-root.Mui-focused": {
//                     boxShadow: "0 0 4px rgba(255,255,255,0.2)",
//                     borderColor: "white",
//                 },
//                 "& .MuiInputLabel-root": { color: "white" },
//                 }}
//             />
//             </Box>
//         </DialogContent>

//         <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1, bgcolor: "rgba(50,50,50,0.9)" }}>
//             <Button
//             variant="contained"
//             color="primary"
//             onClick={handleSave}
//             size="small"
//             sx={{
//                 borderRadius: 2,
//                 textTransform: "none",
//                 px: 2.5,
//                 py: 0.7,
//                 backgroundColor: "rgba(255,255,255,0.1)",
//                 color: "white",
//                 "&:hover": { backgroundColor: "rgba(255,255,255,0.2)" },
//             }}
//             >
//             Зберегти
//             </Button>
//         </DialogActions>
//         </Dialog>


//   );
// }




// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { useGroupsData, useUpdateGroup, useSaveGroup } from "../../hooks/useGroupsData";
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   IconButton,
//   Box
// } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// export default function AddGroupModal({ onClose }) {
//   const { data: groups = [] } = useGroupsData();
//   const updateGroup = useUpdateGroup();
//   const saveGroup = useSaveGroup();

//   const editGroupId = useSelector((state) => state.modals.editGroupId);
//   const editGroup = groups.find((group) => group._id === editGroupId);

//   const [groupName, setGroupName] = useState(editGroup ? editGroup.name : "");
//   const [groupOwnership, setGroupOwnership] = useState(editGroup ? editGroup.ownership : "");
//   const [groupDescription, setGroupDescription] = useState(editGroup ? editGroup.description : "");

//   useEffect(() => {
//     if (editGroup) {
//       setGroupName(editGroup.name);
//       setGroupOwnership(editGroup.ownership);
//       setGroupDescription(editGroup.description);
//     }
//   }, [editGroup]);

//   const handleSave = () => {
//     const groupData = { name: groupName, ownership: groupOwnership, description: groupDescription };

//     if (editGroupId) {
//       updateGroup.mutate(
//         { groupId: editGroupId, groupData },
//         { onSuccess: onClose, onError: (err) => console.error(err) }
//       );
//     } else {
//       saveGroup.mutate(groupData, { onSuccess: onClose, onError: (err) => console.error(err) });
//     }
//   };

//   return (
//     <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
//       <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
//         {editGroupId ? "Редагування групи" : "Додавання групи"}
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
//         <Box display="flex" flexDirection="column" gap={1.5}>
//           <TextField
//             label="Назва групи"
//             value={groupName}
//             onChange={(e) => setGroupName(e.target.value)}
//             fullWidth
//             size="small"
//           />
//           <TextField
//             label="Приналежність групи"
//             value={groupOwnership}
//             onChange={(e) => setGroupOwnership(e.target.value)}
//             fullWidth
//             size="small"
//           />
//           <TextField
//             label="Опис групи"
//             value={groupDescription}
//             onChange={(e) => setGroupDescription(e.target.value)}
//             multiline
//             rows={3}
//             inputProps={{ maxLength: 200 }}
//             fullWidth
//             size="small"
//           />
//         </Box>
//       </DialogContent>

//       <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
//         <Button variant="contained" size="small" onClick={handleSave} sx={{ textTransform: "none", px: 2, py: 0.7 }}>
//           Зберегти
//         </Button>
//       </DialogActions>
//     </Dialog>
//   );
// }





import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useGroupsData, useUpdateGroup, useSaveGroup } from "../../hooks/useGroupsData";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Tooltip,
  Typography
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddGroupModal({ onClose }) {
  const { data: groups = [] } = useGroupsData();
  const updateGroup = useUpdateGroup();
  const saveGroup = useSaveGroup();

  // ✅ слухаємо роль з Redux
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const editGroupId = useSelector((state) => state.modals.editGroupId);
  const editGroup = groups.find((group) => group._id === editGroupId);

  const [groupName, setGroupName] = useState(editGroup ? editGroup.name : "");
  const [groupOwnership, setGroupOwnership] = useState(editGroup ? editGroup.ownership : "");
  const [groupDescription, setGroupDescription] = useState(editGroup ? editGroup.description : "");

  useEffect(() => {
    if (editGroup) {
      setGroupName(editGroup.name);
      setGroupOwnership(editGroup.ownership);
      setGroupDescription(editGroup.description);
    }
  }, [editGroup]);

  const handleSave = () => {
    if (isGuest) return; // підстраховка на всяк випадок

    const groupData = { name: groupName, ownership: groupOwnership, description: groupDescription };

    if (editGroupId) {
      updateGroup.mutate(
        { groupId: editGroupId, groupData },
        { onSuccess: onClose, onError: (err) => console.error(err) }
      );
    } else {
      saveGroup.mutate(groupData, { onSuccess: onClose, onError: (err) => console.error(err) });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editGroupId ? "Редагування групи" : "Додавання групи"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="Назва групи"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Приналежність групи"
            value={groupOwnership}
            onChange={(e) => setGroupOwnership(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Опис групи"
            value={groupDescription}
            onChange={(e) => setGroupDescription(e.target.value)}
            multiline
            rows={3}
            inputProps={{ maxLength: 200 }}
            fullWidth
            size="small"
            disabled={isGuest}
          />
        </Box>

        {isGuest && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            Ви не маєте прав для редагування або створення груп.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
        <Tooltip title={isGuest ? "У вас немає прав на цю дію" : ""}>
          <span>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ textTransform: "none", px: 2, py: 0.7 }}
              disabled={isGuest}
            >
              Зберегти
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
