import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, TextField, IconButton, Button as MuiButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useCropsData, useSaveCrop, useUpdateCrop } from "../../hooks/useCropsData";
import closeModal from "../../helpres/closeModal";

export default function AddCropsModal({ onClose }) {
  const handleWrapperClick = closeModal(onClose);

  const { data: crops = [] } = useCropsData();
  const saveCrop = useSaveCrop();
  const updateCrop = useUpdateCrop();

  const editCropId = useSelector(state => state.modals.editCropId);
  const editCrop = crops.find(c => c._id === editCropId);

  const [cropName, setCropName] = useState(editCrop ? editCrop.name : "");
  const [cropDescription, setCropDescription] = useState(editCrop ? editCrop.description : "");

  useEffect(() => {
    if (editCrop) {
      setCropName(editCrop.name);
      setCropDescription(editCrop.description);
    }
  }, [editCrop]);

  const handleSave = () => {
    const cropData = { name: cropName, description: cropDescription };

    if (editCropId) {
      updateCrop.mutate(
        { cropId: editCropId, cropData },
        {
          onSuccess: () => onClose(),
          onError: (error) => console.error("Помилка при оновленні культури:", error.message),
        }
      );
    } else {
      saveCrop.mutate(cropData, {
        onSuccess: () => onClose(),
        onError: (error) => console.error("Помилка при створенні культури:", error.message),
      });
    }
  };

  return (
    <Box
      onClick={handleWrapperClick}
      sx={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100vw",
        height: "100vh",
        bgcolor: "rgba(0,0,0,0.7)",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        zIndex: 10,
      }}
    >
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: 400,
          minHeight: 350,
          bgcolor: "background.paper",
          p: 3,
          display: "flex",
          flexDirection: "column",
          position: "relative",
          borderRadius: 2,
        }}
      >
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            width: 30,
            height: 30,
            border: "1px solid black",
            transition: "0.4s",
            "&:hover": { transform: "rotate(180deg)" },
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        <Typography variant="h6" sx={{ mb: 3, fontWeight: 700 }}>
          {editCropId ? "Редагування культури" : "Створення нової культури"}
        </Typography>

        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">Назва культури</Typography>
          <TextField
            value={cropName}
            onChange={(e) => setCropName(e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">Опис культури</Typography>
          <TextField
            value={cropDescription}
            onChange={(e) => setCropDescription(e.target.value)}
            size="small"
            variant="outlined"
            multiline
            rows={4}
            inputProps={{ maxLength: 250 }}
            fullWidth
          />
        </Box>

        <Box sx={{ display: "flex", justifyContent: "flex-end", mt: "auto" }}>
          <MuiButton variant="contained" onClick={handleSave}>
            Зберегти
          </MuiButton>
        </Box>
      </Box>
    </Box>
  );
}