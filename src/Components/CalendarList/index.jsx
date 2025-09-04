import React from "react";
import { Box, Paper, Typography, Slide, Tooltip, IconButton } from "@mui/material";
import DatePickerComponent from "../DatePicker";
import CalendarMonthIcon from "@mui/icons-material/CalendarMonth";

export default function CalendarList({ open = true }) {
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
        {/* Заголовок з іконкою */}
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
            Вибір дати
          </Typography>
          <Tooltip title="Календар">
            <IconButton size="small">
              <CalendarMonthIcon fontSize="small" sx={{ color: "white" }} />
            </IconButton>
          </Tooltip>
        </Box>

        {/* Контейнер зі скролом */}
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
          <Paper
            sx={{
              p: 1,
              bgcolor: "rgba(255,255,255,0.05)",
              borderRadius: 1,
            }}
          >
            <DatePickerComponent />
          </Paper>
        </Box>
      </Paper>
    </Slide>
  );
}
