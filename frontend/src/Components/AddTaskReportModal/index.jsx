import React, { useMemo, useRef, useState } from "react";
import { useSelector } from "react-redux";
import {
  Box,
  Typography,
  IconButton,
  Divider,
  Fade,
  CircularProgress,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

import { useGpsByTask } from "../../hooks/useGpsByTask";
import { useFieldsData } from "../../hooks/useFieldsData";
import MapBlock from "../MapBlock";
import { calculateFieldVisitsWithUnion } from "../../helpres/fieldVisits";
import { useUpdateTask } from '../../hooks/useTasksData'; 

const DEFAULT_COLOR = "#4caf50";

export default function AddTaskReportModal({ onClose }) {
  const taskReportData = useSelector(
    (state) => state.modals.editTaskReportData
  );

  const updateTaskMutation = useUpdateTask();

  console.log(taskReportData)

  const { data: fieldsData = [], isLoading: fieldsLoading } =
    useFieldsData();

  const imei = taskReportData?.vehicleId?.imei;
  const startDate = taskReportData?.startDate;
  const days = taskReportData?.daysToComplete || 1;
  // const equipmentWidth = taskReportData?.techniqueId?.width || 0;
  const equipmentWidth = taskReportData?.width || 0;
  const techniqueRfid = taskReportData?.techniqueId?.rfid
    ? Number(taskReportData?.techniqueId?.rfid)
    : null;

  const { dates, queries, isLoading: gpsLoading } = useGpsByTask({ imei, startDate, days });
  const isLoading = fieldsLoading || gpsLoading;

  const gpsByDays = useMemo(() => {
    if (!dates?.length || !queries?.length) return [];
    return dates.map((date, idx) => ({
      date,
      points: Array.isArray(queries[idx]?.data) ? queries[idx].data : [],
    }));
  }, [dates, queries]);

  const filteredGpsByDays = useMemo(() => {
    if (!techniqueRfid) return gpsByDays;

    return gpsByDays.map((day) => {
      const wrapper = day.points?.[0];
      if (!wrapper?.data) return { ...day, points: [] }; // ❌ ГАРАНТУЄМО масив

      return {
        ...day,
        points: [
          {
            ...wrapper,
            data: wrapper.data.filter(
              (p) => Number(p?.io?.[131]) === techniqueRfid
            ),
          },
        ],
      };
    });
  }, [gpsByDays, techniqueRfid]);

  const visibleGpsByDays = useMemo(
    () => filteredGpsByDays.filter((d) => d.points?.[0]?.data?.length),
    [filteredGpsByDays]
  );

  // ===== UI STATE (SAFE INIT) =====
  const daySettingsRef = useRef({});
  const [, forceRender] = useState(0);

  const daySettings = useMemo(() => {
    const settings = {};
    visibleGpsByDays.forEach((day) => {
      settings[day.date] = daySettingsRef.current[day.date] || {
        visible: true,
        color: DEFAULT_COLOR,
      };
    });
    daySettingsRef.current = settings;
    return settings;
  }, [visibleGpsByDays]);

  const toggleVisibility = (date) => {
    if (!daySettingsRef.current[date]) return;
    daySettingsRef.current[date].visible = !daySettingsRef.current[date].visible;
    forceRender((v) => v + 1);
  };

  const changeColor = (date, color) => {
    if (!daySettingsRef.current[date]) return;
    daySettingsRef.current[date].color = color;
    forceRender((v) => v + 1);
  };

  // ===== VISITS =====
  const fieldPolygon =
    taskReportData?.fieldId?.geometry?.coordinates?.[0] || [];

  const dailyVisits = useMemo(() => {
    if (!fieldPolygon.length || !visibleGpsByDays.length || !equipmentWidth)
      return { visitsByDay: [], totalArea: 0 };

    return calculateFieldVisitsWithUnion(
      visibleGpsByDays,
      fieldPolygon,
      equipmentWidth
    );
  }, [visibleGpsByDays, fieldPolygon, equipmentWidth]);

  const totalArea = useMemo(() => {
    if (!dailyVisits?.visitsByDay?.length) return 0;

    return dailyVisits.visitsByDay.reduce(
      (sum, day) => sum + (day.dayArea || 0),
      0
    );
  }, [dailyVisits]);

  

  if (isLoading) {
    return (
      <Box sx={{position:"fixed", inset:0, bgcolor:"rgba(0,0,0,0.7)", display:"flex", alignItems:"center", justifyContent:"center", zIndex:1300}}>
        <Fade in timeout={300}>
          <CircularProgress />
        </Fade>
      </Box>
    );
  }



  const handleSave = async () => {
    if (!taskReportData?._id) return;

    const payload = {
      taskId: taskReportData._id,
      taskData: new FormData()
    };

    // FormData — як ти робиш у бекенді
    const form = payload.taskData;

    form.append('group', taskReportData.groupId?._id || '');
    form.append('personnel', taskReportData.personnelId?._id || '');
    form.append('technique', taskReportData.techniqueId?._id || '');
    form.append('vehicle', taskReportData.vehicleId?._id || '');
    form.append('field', taskReportData.fieldId?._id || '');
    form.append('operation', taskReportData.operationId?._id || '');
    form.append('variety', taskReportData.varietyId?._id || '');
    form.append('crop', taskReportData.cropId?._id || '');
    form.append('width', taskReportData.techniqueId?.width || 0);
    form.append('note', taskReportData.note || '');
    form.append('daysToComplete', taskReportData.daysToComplete || 1);
    form.append('startDate', taskReportData.startDate || '');
    form.append('processedArea', totalArea.toFixed(4)); // передаємо загальну площу

    // Викликаємо мутацію
    updateTaskMutation.mutate(payload, {
      onSuccess: (data) => {
        console.log('Task updated:', data);
        alert('Збережено!');
      },
      onError: (err) => {
        console.error('Error updating task:', err);
        alert('Помилка при збереженні');
      },
    });
  };

  // ===== RENDER =====
  return (
    <Fade in timeout={300}>
      <Box
        onClick={onClose}
        sx={{
          position: "fixed",
          inset: 0,
          bgcolor: "rgba(0,0,0,0.7)",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          zIndex: 1300,
        }}
      >
        <Box
          onClick={(e) => e.stopPropagation()}
          sx={{
            width: 1000,
            height: 600,
            display: "flex",
            flexDirection: "row",
            bgcolor: "background.paper",
            p: 3,
            borderRadius: 2,
            position: "relative",
            overflow: "hidden",
          }}
        >
          {/* CLOSE BUTTON */}
          <IconButton
            onClick={onClose}
            sx={{
              position: "absolute",
              top: 10,
              right: 10,
              zIndex: 1500,
              width: 32,
              height: 32,
              bgcolor: "background.paper",
              border: "1px solid black",
              "&:hover": { transform: "rotate(180deg)" },
            }}
          >
            <CloseIcon fontSize="small" />
          </IconButton>

          {/* INFO PANEL */}
          <Box sx={{ width: 450, pr: 2, overflowY: "auto", maxHeight: "100%" }}>
            <Typography variant="h6" fontWeight={700} mb={2}>
              Звіт по виконанню завдання #{taskReportData?.order}
            </Typography>
            <Typography variant="subtitle2">
              Поле: {taskReportData?.fieldId?.properties?.name}
            </Typography>
            <Typography variant="subtitle2">
              Транспорт: {taskReportData?.vehicleId?.mark || ""}
            </Typography>
            <Typography variant="subtitle2">
              Техніка: {taskReportData?.techniqueId?.name}
            </Typography>
            <Typography variant="subtitle2">
              Виконавець:{" "}
              {taskReportData?.personnelId
                ? `${taskReportData.personnelId.lastName} ${taskReportData.personnelId.firstName}`
                : ""}
            </Typography>
            <Typography variant="subtitle2">
              Старт:{" "}
              {startDate ? new Date(startDate).toLocaleDateString("uk-UA") : ""}
            </Typography>
            <Typography variant="subtitle2">
              Днів виконання: {days}
            </Typography>

            {/* VISITS BY DAY */}
            <Box mt={2}>
              {visibleGpsByDays.map((day) => {
                const visits = dailyVisits.visitsByDay.find((d) => d.date === day.date);
                const state = daySettingsRef.current[day.date];

                return (
                  <Box key={day.date} mb={1} pb={1} borderBottom="1px solid #eee">
                    <Box display="flex" alignItems="center" mb={0.5}>
                      <input
                        type="checkbox"
                        checked={state.visible}
                        onChange={() => toggleVisibility(day.date)}
                      />
                      <Typography mx={1}>{day.date}</Typography>
                      <input
                        type="color"
                        value={state.color}
                        onChange={(e) => changeColor(day.date, e.target.value)}
                        style={{ width: 32, height: 20, border: "none", padding: 0 }}
                      />
                    </Box>

                    {visits?.visits?.length ? (
                      visits.visits.map((v, i) => (
                        <Typography key={i} variant="body2" ml={3}>
                          Вхід: {v.in.toLocaleTimeString()} | Вихід:{" "}
                          {v.out ? v.out.toLocaleTimeString() : "досі в полі"}
                        </Typography>
                      ))
                    ) : (
                      <Typography variant="body2" ml={3}>
                        Техніка не заходила на поле
                      </Typography>
                    )}

                    

                    <Typography fontWeight={600} ml={1} mt={0.5}>
                      Площа за день: {visits?.dayArea?.toFixed(4) || "0.00"} га
                    </Typography>
                  </Box>
                );
              })}
            </Box>

            

            <Box mt={2} mb={2}>
              <Typography variant="subtitle1" fontWeight={700}>
                Загальна оброблена площа
              </Typography>
              <Typography variant="h6" color="primary">
                {totalArea.toFixed(4)} га
              </Typography>
            </Box>
          </Box>

          <Divider orientation="vertical" flexItem />

          {/* MAP */}
          <Box sx={{ flex: 1, pl: 2, position: "relative" }}>
            <MapBlock
              field={{ value: taskReportData?.fieldId?._id }}
              fieldsList={fieldsData}
              gpsByDays={visibleGpsByDays}
              dayState={daySettingsRef.current}
              equipmentWidth={equipmentWidth}
              height="100%"
            />

            {/* SAVE BUTTON */}
            <Button
              variant="contained"
              color="primary"
              sx={{ position: "absolute", bottom: 16, right: 16, zIndex: 1500 }}
              onClick={handleSave}
              disabled={updateTaskMutation.isLoading} // блокуємо під час оновлення
            >
              {updateTaskMutation.isLoading ? 'Збереження...' : 'Зберегти'}
            </Button>
          </Box>
        </Box>
      </Box>
    </Fade>
  );
}
