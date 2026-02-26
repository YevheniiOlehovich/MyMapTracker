import { useState, useEffect, useMemo } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Box,
  IconButton,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { Autocomplete } from "@mui/material";

import MapBlock from "../MapBlock";
import { useSelector, useDispatch } from "react-redux";
import { closeAddTaskModal } from "../../store/modalSlice";

import { useGroupsData } from "../../hooks/useGroupsData";
import { usePersonnelData } from "../../hooks/usePersonnelData";
import { useTechniquesData } from "../../hooks/useTechniquesData";
import { useFieldsData } from "../../hooks/useFieldsData";
import { useOperationsData } from "../../hooks/useOperationsData";
import { useCropsData } from "../../hooks/useCropsData";
import { useVarietiesData } from "../../hooks/useVarietiesData";
import { useVehiclesData } from "../../hooks/useVehiclesData";
import { useSaveTask, useTasksData, useUpdateTask } from "../../hooks/useTasksData";

export default function AddTaskModal() {
  const dispatch = useDispatch();
  const { isAddTaskModalVisible, editTaskId } = useSelector((state) => state.modals);

  const { data: groups = [] } = useGroupsData();
  const { data: personnel = [] } = usePersonnelData();
  const { data: techniques = [] } = useTechniquesData();
  const { data: fieldsData = [] } = useFieldsData();
  const { data: operations = [] } = useOperationsData();
  const { data: crops = [] } = useCropsData();
  const { data: varieties = [] } = useVarietiesData();
  const { data: vehicles = [] } = useVehiclesData();
  const { data: tasks = [] } = useTasksData();

  console.log(operations)
  console.log(techniques)

  const editTask = tasks.find((t) => t._id === editTaskId);

  // state
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPersonnel, setSelectedPersonnel] = useState(null);
  const [selectedTechnique, setSelectedTechnique] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);

  const [width, setWidth] = useState("");
  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");
  const [isWidthEditable, setIsWidthEditable] = useState(false);

  const saveTask = useSaveTask();
  const updateTask = useUpdateTask();

  // Фільтрація виконавців по обраному транспортному засобу з логуванням
  const availableDrivers = useMemo(() => {
    if (!selectedVehicle) return [];

    const vehicleObj = vehicles.find((v) => v._id === selectedVehicle.value);
    if (!vehicleObj) return [];

    // беремо тільки _id
    const driverIds = [vehicleObj.driver1, vehicleObj.driver2, vehicleObj.driver3]
      .filter(Boolean)
      .map(driver => driver._id);

    let filteredDrivers;

    if (driverIds.length > 0) {
      // Якщо є дефолтні драйвери – фільтруємо по ним
      filteredDrivers = personnel.filter((p) => driverIds.includes(p._id));
    } else {
      // Якщо немає – беремо всіх персонал
      filteredDrivers = personnel;
    }
    return filteredDrivers;
  }, [selectedVehicle, vehicles, personnel]);



  // preload task data
  useEffect(() => {
    if (editTask) {
      setSelectedGroup(editTask.groupId ? { label: editTask.groupId.name || "Без назви", value: editTask.groupId._id } : null);
      setSelectedPersonnel(
        editTask.personnelId
          ? { label: `${editTask.personnelId.firstName || ""} ${editTask.personnelId.lastName || ""}`.trim(), value: editTask.personnelId._id }
          : null
      );
      setSelectedTechnique(editTask.techniqueId ? { label: editTask.techniqueId.name || "Без назви", value: editTask.techniqueId._id } : null);
      setSelectedVehicle(
        editTask.vehicleId
          ? {
              label: editTask.vehicleId.mark
                ? `${editTask.vehicleId.mark}${editTask.vehicleId.regNumber ? ` (${editTask.vehicleId.regNumber})` : ""}`
                : editTask.vehicleId.regNumber || editTask.vehicleId.vehicleType || "Транспорт",
              value: editTask.vehicleId._id,
            }
          : null
      );
      setSelectedField(editTask.fieldId ? { label: editTask.fieldId.properties?.name || "Без назви", value: editTask.fieldId._id } : null);
      setSelectedOperation(editTask.operationId ? { label: editTask.operationId.name || "Без назви", value: editTask.operationId._id } : null);
      setSelectedVariety(editTask.varietyId ? { label: editTask.varietyId.name || "Без назви", value: editTask.varietyId._id } : null);
      setSelectedCrop(editTask.cropId ? { label: editTask.cropId.name || "Без назви", value: editTask.cropId._id } : null);

      setWidth(editTask.width ?? "");
      setNote(editTask.note ?? "");
      setDeadline(editTask.daysToComplete ?? "");
      setStartDate(editTask.startDate ? editTask.startDate.split("T")[0] : "");
    } else {
      setSelectedGroup(null);
      setSelectedPersonnel(null);
      setSelectedTechnique(null);
      setSelectedVehicle(null);
      setSelectedField(null);
      setSelectedOperation(null);
      setSelectedVariety(null);
      setSelectedCrop(null);
      setWidth("");
      setNote("");
      setDeadline("");
      setStartDate("");
    }
  }, [editTask]);

  // авто-оновлення ширини при зміні техніки
  useEffect(() => {
    if (selectedTechnique?.value && !isWidthEditable) {
      const full = techniques.find((t) => t._id === selectedTechnique.value);
      setWidth(full?.width ?? "");
    }
  }, [selectedTechnique, techniques, isWidthEditable]);

  const handleSave = async () => {
    try {
      const formData = new FormData();
      formData.append("group", selectedGroup?.value || "");
      formData.append("personnel", selectedPersonnel?.value || "");
      formData.append("technique", selectedTechnique?.value || "");
      formData.append("vehicle", selectedVehicle?.value || "");
      formData.append("field", selectedField?.value || "");
      formData.append("operation", selectedOperation?.value || "");
      formData.append("variety", selectedVariety?.value || "");
      formData.append("crop", selectedCrop?.value || "");
      formData.append("width", width ? String(width) : "");
      formData.append("note", note || "");
      formData.append("daysToComplete", deadline ? String(deadline) : "");
      formData.append("startDate", startDate || "");

      if (editTaskId) {
        await updateTask.mutateAsync({ taskId: editTaskId, taskData: formData });
      } else {
        await saveTask.mutateAsync(formData);
      }

      dispatch(closeAddTaskModal());
    } catch (err) {
      console.error("Помилка при збереженні:", err);
      alert("Не вдалося зберегти завдання");
    }
  };

  const isOptionEqualToValue = (opt, val) => opt?.value === val?.value;

  return (
    <Dialog open={isAddTaskModalVisible} onClose={() => dispatch(closeAddTaskModal())} maxWidth="lg" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        {editTaskId ? `Редагування завдання ${editTask?.order ?? ""}` : "Додавання нового завдання"}
        <IconButton onClick={() => dispatch(closeAddTaskModal())}><CloseIcon /></IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", flexDirection: "row", justifyContent: "space-between", gap: 2 }}>
          {/* Ліва колонка */}
          <Box sx={{ flex: "0 0 50%", display: "flex", flexDirection: "column", gap: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
            <Autocomplete
              options={groups.map(g => ({ label: g.name || "Без назви", value: g._id }))}
              value={selectedGroup}
              onChange={(_, v) => setSelectedGroup(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Група" size="small" fullWidth />}
            />
            <Autocomplete
              options={fieldsData.map(f => ({ label: f.properties?.name || "Без назви", value: f._id }))}
              value={selectedField}
              onChange={(_, v) => setSelectedField(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>  {/* <-- унікальний key */}
                  {option.label}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Поле" size="small" fullWidth />}
            />
            <Autocomplete
              options={vehicles.map(v => ({
                label: v.mark ? `${v.mark}${v.regNumber ? ` (${v.regNumber})` : ""}` : v.regNumber || v.vehicleType || "Транспорт",
                value: v._id
              }))}
              value={selectedVehicle}
              onChange={(_, v) => {
                setSelectedVehicle(v);
                setSelectedPersonnel(null); // обнуляємо виконавця при зміні транспорту
              }}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Транспортний засіб" size="small" fullWidth />}
            />
            <Autocomplete
              options={techniques.map(t => ({ label: t.name || "Без назви", value: t._id }))}
              value={selectedTechnique}
              onChange={(_, v) => setSelectedTechnique(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderOption={(props, option) => (
                <li {...props} key={option.value}>  {/* Унікальний ключ */}
                  {option.label}
                </li>
              )}
              renderInput={(params) => <TextField {...params} label="Технічний засіб" size="small" fullWidth />}
            />

            <Autocomplete
              options={availableDrivers.map(p => ({ label: `${p.firstName || ""} ${p.lastName || ""}`.trim() || "Без імені", value: p._id }))}
              value={selectedPersonnel}
              onChange={(_, v) => setSelectedPersonnel(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Виконавець" size="small" fullWidth />}
            />
            <Autocomplete
              options={operations.map(op => ({ label: op.name || "Без назви", value: op._id }))}
              value={selectedOperation}
              onChange={(_, v) => setSelectedOperation(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Технологічна операція" size="small" fullWidth />}
            />
            <Autocomplete
              options={crops.map(c => ({ label: c.name || "Без назви", value: c._id }))}
              value={selectedCrop}
              onChange={(_, v) => setSelectedCrop(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Культура" size="small" fullWidth />}
            />
            <Autocomplete
              options={varieties.map(v => ({ label: v.name || "Без назви", value: v._id }))}
              value={selectedVariety}
              onChange={(_, v) => setSelectedVariety(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => <TextField {...params} label="Сорт" size="small" fullWidth />}
            />
          </Box>

          {/* Права колонка */}
          <Box sx={{ flex: "0 0 50%", display: "flex", flexDirection: "column", gap: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 1, flex: 1, overflow: "hidden" }}>
              <MapBlock field={selectedField} fieldsList={fieldsData} height="200px" />
            </Box>

            <TextField label="Додаткова інформація" multiline rows={3} fullWidth value={note} onChange={(e) => setNote(e.target.value)} />

            <Box sx={{ display: "flex", gap: 2 }}>
              <TextField
                label="Ширина техніки (м)"
                type="number"
                fullWidth
                size="small"
                disabled={!isWidthEditable}
                value={width}
                onChange={(e) => setWidth(e.target.value)}
              />
              <Button onClick={() => setIsWidthEditable((p) => !p)} size="small">
                {isWidthEditable ? "🔒 Заблокувати" : "✏️ Редагувати"}
              </Button>
            </Box>

            <TextField
              label="Дата початку виконання"
              type="date"
              fullWidth
              size="small"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Термін виконання (днів)"
              type="number"
              fullWidth
              size="small"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSave}>Зберегти</Button>
      </DialogActions>
    </Dialog>
  );
}
