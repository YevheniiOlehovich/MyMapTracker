import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  IconButton,
  TextField,
  Typography,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";

import { useSelector, useDispatch } from "react-redux";
import { useQueryClient } from "@tanstack/react-query";
import { useFieldsData, useUpdateField } from "../../hooks/useFieldsData";
import { closeAddFieldsModal } from "../../store/modalSlice";

export default function AddFieldsModal() {
  const dispatch = useDispatch();
  const queryClient = useQueryClient();

  const { data: fields, isLoading, error } = useFieldsData();
  const updateField = useUpdateField();

  const fieldId = useSelector((state) => state.modals?.selectedField);
  const field = fields?.find((f) => f._id === fieldId);

  const TOTAL_SLIDES = 3;
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isEditable, setIsEditable] = useState(false);

  const [fieldState, setFieldState] = useState({
    fieldName: "",
    mapKey: "",
    fieldArea: "",
    koatuu: "",
    note: "",
    culture: "",
    sort: "",
    date: "",
    crop: "",
    branch: "",
    region: "",
    calculatedArea: "",
    matchingPlots: [],
    notProcessed: [],
  });

  useEffect(() => {
    if (field?.properties) {
      setFieldState({
        fieldName: field.properties.name || "",
        mapKey: field.properties.mapkey || "",
        fieldArea: field.properties.area || "",
        koatuu: field.properties.koatuu || "",
        note: field.properties.note || "",
        culture: field.properties.culture || "",
        sort: field.properties.sort || "",
        date: field.properties.date || "",
        crop: field.properties.crop || "",
        branch: field.properties.branch || "",
        region: field.properties.region || "",
        calculatedArea: field.properties.calculated_area || "",
        matchingPlots: field.matching_plots || [],
        notProcessed: field.not_processed || [],
      });
    }
  }, [field]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % TOTAL_SLIDES);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + TOTAL_SLIDES) % TOTAL_SLIDES);
  };

  const handleSave = async () => {
    const fieldData = {
      _id: fieldId,
      type: "Feature",
      properties: {
        name: fieldState.fieldName,
        branch: fieldState.branch,
        crop: fieldState.crop,
        date: fieldState.date,
        sort: fieldState.sort,
        mapkey: fieldState.mapKey,
        area: fieldState.fieldArea,
        koatuu: fieldState.koatuu,
        note: fieldState.note,
        culture: fieldState.culture,
        region: fieldState.region,
        calculated_area: fieldState.calculatedArea,
      },
      geometry: field?.geometry || { type: "Polygon", coordinates: [] },
      matching_plots: fieldState.matchingPlots,
      not_processed: fieldState.notProcessed,
    };

    try {
      await updateField.mutateAsync(fieldData);
      queryClient.invalidateQueries(["fields"]);
      setIsEditable(false);
      dispatch(closeAddFieldsModal());
    } catch (error) {
      console.error("Помилка збереження:", error.message);
      alert("Не вдалося зберегти поле. Спробуйте ще раз.");
    }
  };

  const handleClose = () => {
    dispatch(closeAddFieldsModal());
  };

  const renderSlideContent = () => {
    if (!field) return <Typography>Поле не знайдено</Typography>;

    switch (currentSlide) {
      case 0:
        return (
          <>
            <TextField
              label="Назва поля"
              fullWidth
              margin="dense"
              value={fieldState.fieldName}
              onChange={(e) =>
                setFieldState({ ...fieldState, fieldName: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Ключ карти"
              fullWidth
              margin="dense"
              value={fieldState.mapKey}
              onChange={(e) =>
                setFieldState({ ...fieldState, mapKey: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Код КОАТУУ"
              fullWidth
              margin="dense"
              value={fieldState.koatuu}
              onChange={(e) =>
                setFieldState({ ...fieldState, koatuu: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Філія"
              fullWidth
              margin="dense"
              value={fieldState.branch}
              onChange={(e) =>
                setFieldState({ ...fieldState, branch: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Регіон"
              fullWidth
              margin="dense"
              value={fieldState.region}
              onChange={(e) =>
                setFieldState({ ...fieldState, region: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Нотатки"
              fullWidth
              margin="dense"
              multiline
              rows={3}
              value={fieldState.note}
              onChange={(e) =>
                setFieldState({ ...fieldState, note: e.target.value })
              }
              disabled={!isEditable}
            />
          </>
        );
      case 1:
        return (
          <>
            <TextField
              label="Культура"
              fullWidth
              margin="dense"
              value={fieldState.culture}
              onChange={(e) =>
                setFieldState({ ...fieldState, culture: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Сорт"
              fullWidth
              margin="dense"
              value={fieldState.sort}
              onChange={(e) =>
                setFieldState({ ...fieldState, sort: e.target.value })
              }
              disabled={!isEditable}
            />
            <TextField
              label="Дата"
              type="date"
              fullWidth
              margin="dense"
              value={fieldState.date}
              onChange={(e) =>
                setFieldState({ ...fieldState, date: e.target.value })
              }
              disabled={!isEditable}
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="Урожай"
              fullWidth
              margin="dense"
              value={fieldState.crop}
              onChange={(e) =>
                setFieldState({ ...fieldState, crop: e.target.value })
              }
              disabled={!isEditable}
            />
          </>
        );
      case 2:
        return (
          <>
            <TextField
              label="Площа поля (га)"
              fullWidth
              margin="dense"
              value={fieldState.fieldArea}
              onChange={(e) =>
                setFieldState({ ...fieldState, fieldArea: e.target.value })
              }
              disabled={!isEditable}
            />
            <Typography sx={{ mt: 2 }}>
              Розрахована площа: <b>{fieldState.calculatedArea}</b> га
            </Typography>

            <Box mt={2}>
              <Typography variant="subtitle1">Відповідні ділянки:</Typography>
              {fieldState.matchingPlots.length > 0 ? (
                fieldState.matchingPlots.map((plot, index) => (
                  <Typography key={plot.id || index} variant="body2">
                    UID: {plot.properties?.uid} — Площа:{" "}
                    {plot.properties?.area} га
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Немає відповідних ділянок
                </Typography>
              )}
            </Box>

            <Box mt={2}>
              <Typography variant="subtitle1">Неопрацьовані ділянки:</Typography>
              {fieldState.notProcessed.length > 0 ? (
                fieldState.notProcessed.map((plot, index) => (
                  <Typography key={plot.id || index} variant="body2">
                    UID: {plot?.properties?.uid} — Площа:{" "}
                    {plot?.properties?.area} га
                  </Typography>
                ))
              ) : (
                <Typography variant="body2" color="text.secondary">
                  Немає неопрацьованих ділянок
                </Typography>
              )}
            </Box>
          </>
        );
      default:
        return null;
    }
  };

  if (isLoading) return <p>Завантаження...</p>;
  if (error) return <p>Помилка: {error.message}</p>;

  return (
    <Dialog open={!!fieldId} onClose={handleClose} fullWidth maxWidth="sm">
      <DialogTitle>
        Редагування поля
        <IconButton
          aria-label="close"
          onClick={handleClose}
          sx={{ position: "absolute", right: 8, top: 8 }}
        >
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>{renderSlideContent()}</DialogContent>

      <DialogActions sx={{ justifyContent: "space-between" }}>
        <Box>
          <IconButton onClick={handlePrevSlide}>
            <ArrowBackIosNewIcon fontSize="small" />
          </IconButton>
          <IconButton onClick={handleNextSlide}>
            <ArrowForwardIosIcon fontSize="small" />
          </IconButton>
        </Box>
        <Box>
          <Button onClick={() => setIsEditable(true)}>Редагувати</Button>
          <Button
            variant="contained"
            onClick={handleSave}
            disabled={!isEditable}
          >
            Зберегти
          </Button>
        </Box>
      </DialogActions>
    </Dialog>
  );
}
