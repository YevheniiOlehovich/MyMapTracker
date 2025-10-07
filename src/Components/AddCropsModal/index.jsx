// import React, { useState, useEffect } from "react";
// import { useSelector } from "react-redux";
// import { Box, Typography, TextField, IconButton, Button as MuiButton } from "@mui/material";
// import CloseIcon from "@mui/icons-material/Close";

// import { useCropsData, useSaveCrop, useUpdateCrop } from "../../hooks/useCropsData";
// import closeModal from "../../helpres/closeModal";

// export default function AddCropsModal({ onClose }) {
//   const handleWrapperClick = closeModal(onClose);

//   const { data: crops = [] } = useCropsData();
//   const saveCrop = useSaveCrop();
//   const updateCrop = useUpdateCrop();

//   const editCropId = useSelector(state => state.modals.editCropId);
//   const editCrop = crops.find(c => c._id === editCropId);

//   const [cropName, setCropName] = useState(editCrop ? editCrop.name : "");
//   const [cropDescription, setCropDescription] = useState(editCrop ? editCrop.description : "");

//   useEffect(() => {
//     if (editCrop) {
//       setCropName(editCrop.name);
//       setCropDescription(editCrop.description);
//     }
//   }, [editCrop]);

//   const handleSave = () => {
//     const cropData = { name: cropName, description: cropDescription };

//     if (editCropId) {
//       updateCrop.mutate(
//         { cropId: editCropId, cropData },
//         {
//           onSuccess: () => onClose(),
//           onError: (error) => console.error("Помилка при оновленні культури:", error.message),
//         }
//       );
//     } else {
//       saveCrop.mutate(cropData, {
//         onSuccess: () => onClose(),
//         onError: (error) => console.error("Помилка при створенні культури:", error.message),
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
//           {editCropId ? "Редагування культури" : "Створення нової культури"}
//         </Typography>

//         <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           <Typography variant="subtitle2">Назва культури</Typography>
//           <TextField
//             value={cropName}
//             onChange={(e) => setCropName(e.target.value)}
//             size="small"
//             variant="outlined"
//             fullWidth
//           />
//         </Box>

//         <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
//           <Typography variant="subtitle2">Опис культури</Typography>
//           <TextField
//             value={cropDescription}
//             onChange={(e) => setCropDescription(e.target.value)}
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
import { useCropsData, useSaveCrop, useUpdateCrop } from "../../hooks/useCropsData";
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

export default function AddCropsModal({ onClose }) {
  const { data: crops = [] } = useCropsData();
  const saveCrop = useSaveCrop();
  const updateCrop = useUpdateCrop();

  // ✅ слухаємо роль з Redux
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const editCropId = useSelector((state) => state.modals.editCropId);
  const editCrop = crops.find((c) => c._id === editCropId);

  const [cropName, setCropName] = useState(editCrop ? editCrop.name : "");
  const [cropDescription, setCropDescription] = useState(editCrop ? editCrop.description : "");

  useEffect(() => {
    if (editCrop) {
      setCropName(editCrop.name);
      setCropDescription(editCrop.description);
    }
  }, [editCrop]);

  const handleSave = () => {
    if (isGuest) return; // підстраховка на всяк випадок

    const cropData = { name: cropName, description: cropDescription };

    if (editCropId) {
      updateCrop.mutate(
        { cropId: editCropId, cropData },
        { onSuccess: onClose, onError: (err) => console.error(err) }
      );
    } else {
      saveCrop.mutate(cropData, { onSuccess: onClose, onError: (err) => console.error(err) });
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editCropId ? "Редагування культури" : "Створення нової культури"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="Назва культури"
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            fullWidth
            size="small"
            disabled={isGuest}
          />
          <TextField
            label="Опис культури"
            value={cropDescription}
            onChange={(e) => setCropDescription(e.target.value)}
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
            Ви не маєте прав для редагування або створення культури.
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
