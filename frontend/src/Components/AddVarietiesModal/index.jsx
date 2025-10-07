// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Box, Typography, TextField, IconButton, Button as MuiButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// import { useVarietiesData, useSaveVariety, useUpdateVariety } from "../../hooks/useVarietiesData";
// import closeModal from "../../helpres/closeModal";

// export default function AddVarietyModal({ onClose }) {
//   const handleWrapperClick = closeModal(onClose);

//   const { data: varieties = [] } = useVarietiesData();
//   const saveVariety = useSaveVariety();
//   const updateVariety = useUpdateVariety();

//   const editVarietyId = useSelector(state => state.modals.editVarietyId);
//   const editVariety = varieties.find(v => v._id === editVarietyId);

//   const [varietyName, setVarietyName] = useState(editVariety ? editVariety.name : "");
//   const [varietyDescription, setVarietyDescription] = useState(editVariety ? editVariety.description : "");

//   useEffect(() => {
//     if (editVariety) {
//       setVarietyName(editVariety.name);
//       setVarietyDescription(editVariety.description);
//     }
//   }, [editVariety]);

//   const handleSave = () => {
//     const varietyData = { name: varietyName, description: varietyDescription };

//     if (editVarietyId) {
//       updateVariety.mutate(
//         { varietyId: editVarietyId, varietyData },
//         {
//           onSuccess: () => onClose(),
//           onError: (error) => console.error("Помилка при оновленні сорту:", error.message),
//         }
//       );
//     } else {
//       saveVariety.mutate(varietyData, {
//         onSuccess: () => onClose(),
//         onError: (error) => console.error("Помилка при створенні сорту:", error.message),
//       });
//     }
//   };

//   return (
//     <Box
//       onClick={handleWrapperClick}
//       sx={{
//         position: "fixed",
//         top: 0,
//         left: 0,
//         width: "100vw",
//         height: "100vh",
//         bgcolor: "rgba(0,0,0,0.7)",
//         display: "flex",
//         justifyContent: "center",
//         alignItems: "center",
//         zIndex: 10,
//       }}
//     >
//       <Box
//         onClick={(e) => e.stopPropagation()}
//         sx={{
//           width: 400,
//           minHeight: 350,
//           bgcolor: "background.paper",
//           p: 3,
//           display: "flex",
//           flexDirection: "column",
//           position: "relative",
//           borderRadius: 2,
//         }}
//       >
//         <IconButton
//           onClick={onClose}
//           sx={{
//             position: "absolute",
//             top: 10,
//             right: 10,
//             width: 30,
//             height: 30,
//             border: "1px solid black",
//             transition: "0.4s",
//             "&:hover": { transform: "rotate(180deg)" },
//           }}
//         >
//           <CloseIcon fontSize="small" />
//         </IconButton>

//         <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
//           {editVarietyId ? "Редагування сорту" : "Створення нового сорту"}
//         </Typography>

//         <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           <Typography variant="subtitle2">Назва сорту</Typography>
//           <TextField
//             value={varietyName}
//             onChange={(e) => setVarietyName(e.target.value)}
//             size="small"
//             variant="outlined"
//             fullWidth
//           />
//         </Box>

//         <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           <Typography variant="subtitle2">Опис сорту</Typography>
//           <TextField
//             value={varietyDescription}
//             onChange={(e) => setVarietyDescription(e.target.value)}
//             size="small"
//             variant="outlined"
//             multiline
//             rows={4}
//             inputProps={{ maxLength: 250 }}
//             fullWidth
//           />
//         </Box>

//         <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
//           <MuiButton variant="contained" onClick={handleSave}>
//             Зберегти
//           </MuiButton>
//         </Box>
//       </Box>
//     </Box>
//   );
// }




import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { useVarietiesData, useSaveVariety, useUpdateVariety } from "../../hooks/useVarietiesData";
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
  Typography,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

export default function AddVarietyModal({ onClose }) {
  const { data: varieties = [] } = useVarietiesData();
  const saveVariety = useSaveVariety();
  const updateVariety = useUpdateVariety();

  // ✅ роль користувача з Redux
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const editVarietyId = useSelector((state) => state.modals.editVarietyId);
  const editVariety = varieties.find((v) => v._id === editVarietyId);

  const [varietyName, setVarietyName] = useState(editVariety ? editVariety.name : "");
  const [varietyDescription, setVarietyDescription] = useState(editVariety ? editVariety.description : "");

  useEffect(() => {
    if (editVariety) {
      setVarietyName(editVariety.name);
      setVarietyDescription(editVariety.description);
    }
  }, [editVariety]);

  const handleSave = () => {
    if (isGuest) return; // підстраховка

    const varietyData = { name: varietyName, description: varietyDescription };

    if (editVarietyId) {
      updateVariety.mutate(
        { varietyId: editVarietyId, varietyData },
        { onSuccess: onClose, onError: (err) => console.error("Помилка при оновленні сорту:", err) }
      );
    } else {
      saveVariety.mutate(varietyData, { onSuccess: onClose, onError: (err) => console.error("Помилка при створенні сорту:", err) });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editVarietyId ? "Редагування сорту" : "Додавання сорту"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="Назва сорту"
            value={varietyName}
            onChange={(e) => setVarietyName(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Опис сорту"
            value={varietyDescription}
            onChange={(e) => setVarietyDescription(e.target.value)}
            multiline
            rows={4}
            inputProps={{ maxLength: 250 }}
            fullWidth
            size="small"
            disabled={isGuest}
          />
        </Box>

        {isGuest && (
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            Ви не маєте прав для редагування або створення сорту.
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
