import React from "react";
import { useSelector } from "react-redux";
import { Box, Typography, IconButton, Divider } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import MapBlock from "../MapBlock";
import { useFieldsData } from "../../hooks/useFieldsData";

export default function AddTaskReportModal({ onClose }) {
  const taskReportData = useSelector((state) => state.modals.editTaskReportData);
  const { data: fieldsData = [] } = useFieldsData();

  return (
    // Бекграунд: клік поза модалкою закриває
    <Box
      onClick={onClose}
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
        zIndex: 1300,
      }}
    >
      {/* Модалка: клік всередині не закриває */}
      <Box
        onClick={(e) => e.stopPropagation()}
        sx={{
          width: { xs: "90%", sm: 820 },
          display: "flex",
          flexDirection: { xs: "column", sm: "row" },
          bgcolor: "background.paper",
          p: 3,
          position: "relative",
          borderRadius: 2,
          maxHeight: "90vh",
          overflowY: "auto",
        }}
      >
        {/* Кнопка закриття */}
        <IconButton
          onClick={onClose}
          sx={{
            position: "absolute",
            top: 10,
            right: 10,
            border: "1px solid black",
            width: 30,
            height: 30,
            bgcolor: "background.paper",
            transition: "transform 0.4s",
            "&:hover": { transform: "rotate(180deg)" },
            zIndex: 1500,
          }}
        >
          <CloseIcon fontSize="small" />
        </IconButton>

        {/* Ліва колонка з інформацією */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: 400 },
            pr: { sm: 2 },
            mb: { xs: 2, sm: 0 },
          }}
        >
          <Typography variant="h6" sx={{ fontWeight: 700, mb: 2 }}>
            Звіт по виконанню завдання {taskReportData?.order || ""}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Поле: {taskReportData?.fieldId?.properties?.name || ""}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Виконавець:{" "}
            {taskReportData?.personnelId
              ? `${taskReportData.personnelId.lastName} ${taskReportData.personnelId.firstName}`
              : ""}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Транспорт:{" "}
            {taskReportData?.vehicleId
              ? `${taskReportData.vehicleId.mark || taskReportData.vehicleId.vehicleType || ""} ${
                  taskReportData.vehicleId.regNumber ? `(${taskReportData.vehicleId.regNumber})` : ""
                }`
              : ""}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Техніка: {taskReportData?.techniqueId?.name || ""}
          </Typography>

          <Typography variant="subtitle2" sx={{ mb: 1 }}>
            Створено:{" "}
            {taskReportData?.createdAt
              ? new Date(taskReportData.createdAt).toLocaleDateString("uk-UA", {
                  year: "numeric",
                  month: "2-digit",
                  day: "2-digit",
                }) +
                " " +
                new Date(taskReportData.createdAt).toLocaleTimeString("uk-UA", {
                  hour: "2-digit",
                  minute: "2-digit",
                })
              : ""}
          </Typography>
        </Box>

        {/* Вертикальний роздільник для десктоп */}
        <Divider
          orientation="vertical"
          flexItem
          sx={{ mx: { xs: 0, sm: 1 }, display: { xs: "none", sm: "block" } }}
        />

        {/* Права колонка з картою */}
        <Box
          sx={{
            width: { xs: "100%", sm: 400 },
            height: { xs: 300, sm: 400 },
          }}
        >
          {taskReportData?.fieldId && (
            <MapBlock
              field={{ value: taskReportData.fieldId._id }}
              fieldsList={fieldsData}
              height="100%"
            />
          )}
        </Box>
      </Box>
    </Box>
  );
}
