import { useState, useEffect } from "react";
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
import {
  useSaveTask,
  useUpdateTask,
  useTasksData,
} from "../../hooks/useTasksData";

import { OPERATION_VEHICLE_RULES } from "./rules";

export default function AddTaskModal() {
  const dispatch = useDispatch();
  const { isAddTaskModalVisible, editTaskId } = useSelector(
    (state) => state.modals
  );

  const { data: tasks = [] } = useTasksData();
  const saveTask = useSaveTask();
  const updateTask = useUpdateTask();

  const editTask = tasks.find((t) => t._id === editTaskId);

  const { data: groups = [] } = useGroupsData();
  const { data: personnel = [] } = usePersonnelData();
  const { data: techniques = [] } = useTechniquesData();
  const { data: fieldsData = [] } = useFieldsData();
  const { data: operations = [] } = useOperationsData();
  const { data: crops = [] } = useCropsData();
  const { data: varieties = [] } = useVarietiesData();
  const { data: vehicles = [] } = useVehiclesData();

  // ---------------- STATE ----------------

  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedField, setSelectedField] = useState(null);
  const [selectedOperation, setSelectedOperation] = useState(null);
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [selectedVariety, setSelectedVariety] = useState(null);

  const [note, setNote] = useState("");
  const [deadline, setDeadline] = useState("");
  const [startDate, setStartDate] = useState("");

  const [assignments, setAssignments] = useState([
    { personnel: null, vehicle: null, technique: null },
  ]);

  // ---------------- PRELOAD / RESET ----------------

  useEffect(() => {
    if (editTask) {
      setSelectedGroup(
        editTask.groupId
          ? { label: editTask.groupId.name, value: editTask.groupId._id }
          : null
      );

      setSelectedField(
        editTask.fieldId
          ? {
              label: editTask.fieldId.properties?.name,
              value: editTask.fieldId._id,
            }
          : null
      );

      setSelectedOperation(
        editTask.operationId
          ? { label: editTask.operationId.name, value: editTask.operationId._id }
          : null
      );

      setSelectedCrop(
        editTask.cropId
          ? { label: editTask.cropId.name, value: editTask.cropId._id }
          : null
      );

      setSelectedVariety(
        editTask.varietyId
          ? { label: editTask.varietyId.name, value: editTask.varietyId._id }
          : null
      );

      setNote(editTask.note || "");
      setDeadline(editTask.daysToComplete || "");
      setStartDate(editTask.startDate?.split("T")[0] || "");

      setAssignments(
        editTask.assignments?.length
          ? editTask.assignments.map((a) => ({
              personnel: a.personnelId
                ? {
                    label: `${a.personnelId.firstName || ""} ${
                      a.personnelId.lastName || ""
                    }`.trim(),
                    value: a.personnelId._id,
                  }
                : null,
              vehicle: a.vehicleId
                ? {
                    label: a.vehicleId.mark || a.vehicleId.vehicleType,
                    value: a.vehicleId._id,
                  }
                : null,
              technique: a.techniqueId
                ? { label: a.techniqueId.name, value: a.techniqueId._id }
                : null,
            }))
          : [{ personnel: null, vehicle: null, technique: null }]
      );
    } else {
      // RESET
      setSelectedGroup(null);
      setSelectedField(null);
      setSelectedOperation(null);
      setSelectedCrop(null);
      setSelectedVariety(null);
      setNote("");
      setDeadline("");
      setStartDate("");
      setAssignments([{ personnel: null, vehicle: null, technique: null }]);
    }
  }, [editTask]);

  // ---------------- ASSIGNMENTS ----------------

  const handleAddAssignment = () => {
    setAssignments((prev) => [
      ...prev,
      { personnel: null, vehicle: null, technique: null },
    ]);
  };

  const handleRemoveAssignment = (index) => {
    setAssignments((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAssignmentChange = (index, field, value) => {
    setAssignments((prev) => {
      const updated = [...prev];
      updated[index][field] = value;
      return updated;
    });
  };

  const usedPersonnelIds = assignments
    .map((a) => a.personnel?.value)
    .filter(Boolean);

  const usedVehicleIds = assignments
    .map((a) => a.vehicle?.value)
    .filter(Boolean);

  const usedTechniqueIds = assignments
    .map((a) => a.technique?.value)
    .filter(Boolean);

  const selectedOperationObj = operations.find(
    (op) => op._id === selectedOperation?.value
  );

  const isSeedingOperation =
    selectedOperationObj?.name === "Висівання зернових культур";

  const isSprayingOperation =
    selectedOperationObj?.name === "Обприскування";

  const isVehicleAllowedByOperation = (vehicleType) => {
    if (!selectedOperationObj) return true;
    const allowedTypes =
      OPERATION_VEHICLE_RULES[selectedOperationObj.name];
    if (!allowedTypes) return true;
    return allowedTypes.includes(vehicleType);
  };

  // ---------------- SAVE ----------------

  const handleSave = async () => {
    try {
      const formData = new FormData();

      formData.append("group", selectedGroup?.value || "");
      formData.append("field", selectedField?.value || "");
      formData.append("operation", selectedOperation?.value || "");
      formData.append("note", note || "");
      formData.append("daysToComplete", deadline || "");
      formData.append("startDate", startDate || "");

      if (isSeedingOperation) {
        formData.append("crop", selectedCrop?.value || "");
        formData.append("variety", selectedVariety?.value || "");
      }

      formData.append(
        "assignments",
        JSON.stringify(
          assignments.map((a) => ({
            personnel: a.personnel?.value || null,
            vehicle: a.vehicle?.value || null,
            technique: a.technique?.value || null,
          }))
        )
      );

      if (editTaskId) {
        await updateTask.mutateAsync({
          taskId: editTaskId,
          taskData: formData,
        });
      } else {
        await saveTask.mutateAsync(formData);
      }

      dispatch(closeAddTaskModal());
    } catch (err) {
      console.error(err);
      alert("Помилка збереження");
    }
  };

  const isOptionEqualToValue = (opt, val) =>
    opt?.value === val?.value;

  return (
    <Dialog
      open={isAddTaskModalVisible}
      onClose={() => dispatch(closeAddTaskModal())}
      maxWidth="lg"
      fullWidth
    >
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between" }}>
        {editTaskId
          ? `Редагування завдання №${editTask?.order ?? ""}`
          : "Додавання нового завдання"}

        <IconButton onClick={() => dispatch(closeAddTaskModal())}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <Box sx={{ display: "flex", gap: 2 }}>
          {/* ЛІВА КОЛОНКА */}
          <Box
            sx={{
              flex: "0 0 50%",
              display: "flex",
              flexDirection: "column",
              gap: 2,
              p: 2,
              border: "1px solid #ddd",
              borderRadius: 1,
            }}
          >
            {/* Група */}
            <Autocomplete
              options={groups.map((g) => ({
                label: g.name,
                value: g._id,
              }))}
              value={selectedGroup}
              onChange={(_, v) => setSelectedGroup(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => (
                <TextField {...params} label="Група" size="small" />
              )}
            />

            {/* Поле */}
            <Autocomplete
              options={fieldsData.map((f) => ({
                label: f.properties?.name,
                value: f._id,
              }))}
              value={selectedField}
              onChange={(_, v) => setSelectedField(v)}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => (
                <TextField {...params} label="Поле" size="small" />
              )}
            />

            {/* Операція */}
            <Autocomplete
              options={operations.map((op) => ({
                label: op.name,
                value: op._id,
              }))}
              value={selectedOperation}
              onChange={(_, v) => {
                setSelectedOperation(v);
                setSelectedCrop(null);
                setSelectedVariety(null);
                setAssignments([
                  { personnel: null, vehicle: null, technique: null },
                ]);
              }}
              isOptionEqualToValue={isOptionEqualToValue}
              renderInput={(params) => (
                <TextField {...params} label="Операція" size="small" />
              )}
            />

            {/* Crop / Variety */}
            {isSeedingOperation && (
              <>
                <Autocomplete
                  options={crops.map((c) => ({
                    label: c.name,
                    value: c._id,
                  }))}
                  value={selectedCrop}
                  onChange={(_, v) => setSelectedCrop(v)}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params) => (
                    <TextField {...params} label="Культура" size="small" />
                  )}
                />

                <Autocomplete
                  options={varieties.map((v) => ({
                    label: v.name,
                    value: v._id,
                  }))}
                  value={selectedVariety}
                  onChange={(_, v) => setSelectedVariety(v)}
                  isOptionEqualToValue={isOptionEqualToValue}
                  renderInput={(params) => (
                    <TextField {...params} label="Сорт" size="small" />
                  )}
                />
              </>
            )}


            {/* ЕКІПАЖІ */}
            <Box sx={{ maxHeight: 320, overflowY: "auto", display: "flex", flexDirection: "column", gap: 2 }}>
              {assignments.map((item, index) => (
                <Box key={index} sx={{ border: "1px solid #ccc", borderRadius: 1, p: 2, display: "flex", flexDirection: "column", gap: 2 }}>
                  
                  {/* Персонал */}
                  <Autocomplete
                    options={personnel.map((p) => ({
                      label: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
                      value: p._id,
                    }))}
                    value={item.personnel}
                    onChange={(_, v) => handleAssignmentChange(index, "personnel", v)}
                    isOptionEqualToValue={isOptionEqualToValue}
                    getOptionDisabled={(option) =>
                      item.personnel?.value === option.value
                        ? false
                        : usedPersonnelIds.includes(option.value)
                    }
                    renderInput={(params) => (
                      <TextField {...params} label="Виконавець" size="small" />
                    )}
                  />

                  {/* Транспорт */}
                  <Autocomplete
                    options={vehicles
                      .filter((v) => {
                        if (!selectedOperationObj) return true;

                        const allowedTypes =
                          OPERATION_VEHICLE_RULES[selectedOperationObj.name];

                        if (!allowedTypes) return true;

                        return allowedTypes.includes(
                          v.vehicleType?.toLowerCase()
                        );
                      })
                      .map((v) => ({
                        label: v.mark || v.vehicleType,
                        value: v._id,
                        vehicleType: v.vehicleType,
                        regNumber: v.regNumber || "",
                      }))}
                    value={item.vehicle}
                    onChange={(_, v) =>
                      handleAssignmentChange(index, "vehicle", v)
                    }
                    isOptionEqualToValue={isOptionEqualToValue}
                    getOptionDisabled={(option) =>
                      item.vehicle?.value === option.value
                        ? false
                        : usedVehicleIds.includes(option.value) ||
                          !isVehicleAllowedByOperation(option.vehicleType)
                    }
                    getOptionLabel={(option) =>
                      `${option.label}${
                        option.regNumber ? ` — ${option.regNumber}` : ""
                      }`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Транспорт"
                        size="small"
                      />
                    )}
                  />

                  {/* Техніка */}
                    {!isSprayingOperation && (
                      <Autocomplete
                        options={techniques
                          .filter((t) =>
                            selectedOperationObj
                              ? t.fieldOperation === selectedOperationObj._id
                              : true
                          )
                          .map((t) => ({
                            label: t.name,
                            value: t._id,
                          }))}
                        value={item.technique}
                        onChange={(_, v) =>
                          handleAssignmentChange(index, "technique", v)
                        }
                        isOptionEqualToValue={isOptionEqualToValue}
                        getOptionDisabled={(option) =>
                          item.technique?.value === option.value
                            ? false
                            : usedTechniqueIds.includes(option.value)
                        }
                        renderInput={(params) => (
                          <TextField {...params} label="Техніка" size="small" />
                        )}
                      />
                    )}

                  {assignments.length > 1 && (
                    <Button size="small" color="error" onClick={() => handleRemoveAssignment(index)}>
                      Видалити
                    </Button>
                  )}
                </Box>
              ))}
            </Box>

            <Button onClick={handleAddAssignment}>
              + Додати виконавця
            </Button>
          </Box>

          {/* ПРАВА КОЛОНКА */}
          <Box sx={{ flex: "0 0 50%", display: "flex", flexDirection: "column", gap: 2, p: 2, border: "1px solid #ddd", borderRadius: 1 }}>
            <Box sx={{ border: "1px solid #ccc", borderRadius: 1 }}>
              <MapBlock field={selectedField} fieldsList={fieldsData} height="200px" />
            </Box>

            <TextField
              label="Додаткова інформація"
              multiline
              rows={3}
              value={note}
              onChange={(e) => setNote(e.target.value)}
            />

            {/* <TextField
              label="Ширина техніки (м)"
              type="number"
              value={width}
              onChange={(e) => setWidth(e.target.value)}
            /> */}

            <TextField
              label="Дата початку"
              type="date"
              value={startDate}
              onChange={(e) => setStartDate(e.target.value)}
              InputLabelProps={{ shrink: true }}
            />

            <TextField
              label="Термін (днів)"
              type="number"
              value={deadline}
              onChange={(e) => setDeadline(e.target.value)}
            />
          </Box>
        </Box>
      </DialogContent>

      <DialogActions>
        <Button variant="contained" onClick={handleSave}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
