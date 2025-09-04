import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Box, Typography, TextField, IconButton, Button as MuiButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useOperationsData, useUpdateOperation, useSaveOperation } from "../../hooks/useOperationsData";
import closeModal from "../../helpres/closeModal";

export default function AddOperationModal({ onClose }) {
  const handleWrapperClick = closeModal(onClose);

  const { data: operations = [] } = useOperationsData();
  const updateOperation = useUpdateOperation();
  const saveOperation = useSaveOperation();

  const editOperationId = useSelector(state => state.modals.editOperationId);
  const editOperation = operations.find(op => op._id === editOperationId);

  const [operationName, setOperationName] = useState(editOperation ? editOperation.name : "");
  const [operationDescription, setOperationDescription] = useState(editOperation ? editOperation.description : "");

  useEffect(() => {
    if (editOperation) {
      setOperationName(editOperation.name);
      setOperationDescription(editOperation.description);
    }
  }, [editOperation]);

  const handleSave = () => {
    const operationData = { name: operationName, description: operationDescription };

    if (editOperationId) {
      updateOperation.mutate(
        { operationId: editOperationId, operationData },
        {
          onSuccess: () => onClose(),
          onError: (error) => console.error("Помилка при оновленні операції:", error.message),
        }
      );
    } else {
      saveOperation.mutate(operationData, {
        onSuccess: () => onClose(),
        onError: (error) => console.error("Помилка при створенні операції:", error.message),
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
          {editOperationId ? "Редагування операції" : "Створення нової операції"}
        </Typography>

        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">Назва операції</Typography>
          <TextField
            value={operationName}
            onChange={(e) => setOperationName(e.target.value)}
            size="small"
            variant="outlined"
            fullWidth
          />
        </Box>

        <Box sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 1 }}>
          <Typography variant="subtitle2">Опис операції</Typography>
          <TextField
            value={operationDescription}
            onChange={(e) => setOperationDescription(e.target.value)}
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
