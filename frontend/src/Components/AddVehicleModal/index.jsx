import React, { useState, useEffect, useMemo } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  FormControl,
  InputLabel,
  MenuItem,
  Select as MuiSelect,
  IconButton,
  Avatar,
  Typography,
  Autocomplete,
  Box,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionIco from "../../assets/ico/10965421.webp";

import { vehicleTypes } from "../../helpres";
import { createBlobFromImagePath, convertImageToWebP } from "../../helpres/imageUtils";
import { useGroupsData } from "../../hooks/useGroupsData";
import { useVehiclesData, useSaveVehicle, useUpdateVehicle } from "../../hooks/useVehiclesData";
import { usePersonnelData } from "../../hooks/usePersonnelData";
import { BACKEND_URL } from "../../helpres";

export default function AddVehicleModal({ onClose }) {
  const { editGroupId, editVehicleId } = useSelector((state) => state.modals);
  const userRole = useSelector((state) => state.user.role); // 👈 роль з redux
  const isGuest = userRole === "guest";

  const saveVehicle = useSaveVehicle();
  const updateVehicle = useUpdateVehicle();

  const { data: vehicles = [] } = useVehiclesData();
  const { data: groups = [] } = useGroupsData();
  const { data: personnel = [] } = usePersonnelData();

  const editVehicle = vehicles.find((v) => v._id === editVehicleId);

  // 📋 Стейти
  const [selectedGroup, setSelectedGroup] = useState(editVehicle?.groupId || editGroupId || "");
  const [regNumber, setRegNumber] = useState(editVehicle?.regNumber || "");
  const [imei, setImei] = useState(editVehicle?.imei || "");
  const [sim, setSim] = useState(editVehicle?.sim || "");
  const [mark, setMark] = useState(editVehicle?.mark || "");
  const [note, setNote] = useState(editVehicle?.note || "");
  const [vehicleType, setVehicleType] = useState(editVehicle?.vehicleType || "");
  const [fuelCapacity, setFuelCapacity] = useState(editVehicle?.fuelCapacity || "");

  // Локально
  // const [vehiclePhoto, setVehiclePhoto] = useState(
  //   editVehicle?.photoPath
  //     ? `${BACKEND_URL}/${editVehicle.photoPath.replace(/\\/g, '/')}`
  //     : QuestionIco
  // );

  // Прод версія
    const [vehiclePhoto, setVehiclePhoto] = useState(
      editVehicle?.photoPath
        ? `/uploads/${editVehicle.photoPath.replace(/\\/g, '/').split('uploads/')[1]}`
        : QuestionIco
    );

  // 👤 Опції персоналу для автокомпліту
  const personnelOptions = useMemo(
    () =>
      personnel.map((p) => ({
        label: `${p.firstName || ""} ${p.lastName || ""}`.trim(),
        value: p._id,
      })),
    [personnel]
  );

  // 👤 Водії (_id)
  const [driver1Id, setDriver1Id] = useState(editVehicle?.driver1?._id || "");
  const [driver2Id, setDriver2Id] = useState(editVehicle?.driver2?._id || "");
  const [driver3Id, setDriver3Id] = useState(editVehicle?.driver3?._id || "");

  const [driver1Obj, setDriver1Obj] = useState(null);
  const [driver2Obj, setDriver2Obj] = useState(null);
  const [driver3Obj, setDriver3Obj] = useState(null);

  useEffect(() => {
    setDriver1Obj(personnelOptions.find((p) => p.value === driver1Id) || null);
    setDriver2Obj(personnelOptions.find((p) => p.value === driver2Id) || null);
    setDriver3Obj(personnelOptions.find((p) => p.value === driver3Id) || null);
  }, [driver1Id, driver2Id, driver3Id, personnelOptions]);

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const webpBlob = file.type === "image/webp" ? file : await convertImageToWebP(file);
      setVehiclePhoto(webpBlob);
    }
  };

  const handleSave = async () => {
    if (isGuest) return; // 👈 гостю не даємо зберігати
    try {
      const formData = new FormData();
      formData.append("groupId", selectedGroup);
      formData.append("vehicleType", vehicleType);
      formData.append("regNumber", regNumber);
      formData.append("mark", mark);
      formData.append("note", note);
      formData.append("imei", imei);
      formData.append("sim", sim);
      formData.append("fuelCapacity", fuelCapacity);
      formData.append("driver1", driver1Id);
      formData.append("driver2", driver2Id);
      formData.append("driver3", driver3Id);

      if (vehiclePhoto instanceof Blob) {
        formData.append("photo", vehiclePhoto, "vehicle.webp");
      } else if (typeof vehiclePhoto === "string" && vehiclePhoto !== QuestionIco) {
        const blob = await createBlobFromImagePath(vehiclePhoto);
        formData.append("photo", blob, "vehicle.webp");
      }

      if (editVehicleId) {
        await updateVehicle.mutateAsync({ id: editVehicleId, vehicleData: formData });
      } else {
        await saveVehicle.mutateAsync(formData);
      }

      onClose();
    } catch (error) {
      console.error("[ERROR] Помилка при збереженні техніки:", error);
    }
  };

  const isOptionEqualToValue = (opt, val) => opt?.value === val?.value;

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editVehicleId ? "Редагування техніки" : "Додавання нової техніки"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* 📸 Фото */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle2" fontSize={12}>
              Фото техніки
            </Typography>
            <Button
              variant="contained"
              size="small"
              component="label"
              disabled={isGuest} // 🔒
            >
              {editVehicleId ? "Змінити фото" : "Додати фото"}
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </Button>
          </Box>
          <Avatar
            src={vehiclePhoto instanceof Blob ? URL.createObjectURL(vehiclePhoto) : vehiclePhoto}
            variant="square"
            sx={{ width: 100, height: 140, border: "1px solid grey" }}
          />
        </Box>

        {/* 📂 Група */}
        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
          <MuiSelect
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            size="small"
            label="Група"
          >
            {groups.map((group) => (
              <MenuItem key={group._id} value={group._id} sx={{ fontSize: 12 }}>
                {group.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        {/* 🚜 Тип */}
        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Тип техніки</InputLabel>
          <MuiSelect
            value={vehicleType}
            onChange={(e) => setVehicleType(e.target.value)}
            size="small"
            label="Тип техніки"
          >
            {vehicleTypes.map((v) => (
              <MenuItem key={v._id} value={v._id} sx={{ fontSize: 12 }}>
                {v.name}
              </MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        {/* 📦 Поля */}
        <TextField disabled={isGuest} label="Марка засобу" fullWidth margin="dense" size="small" value={mark} onChange={(e) => setMark(e.target.value)} />
        <TextField disabled={isGuest} label="Номер реєстрації" fullWidth margin="dense" size="small" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
        <TextField disabled={isGuest} label="IMEI трекера" fullWidth margin="dense" size="small" value={imei} onChange={(e) => setImei(e.target.value)} />
        <TextField disabled={isGuest} label="Номер Sim-карти" fullWidth margin="dense" size="small" value={sim} onChange={(e) => setSim(e.target.value)} />
        <TextField disabled={isGuest} label="Обʼєм паливного баку (л)" type="number" fullWidth margin="dense" size="small" value={fuelCapacity} onChange={(e) => setFuelCapacity(e.target.value)} />

        {/* 👤 Водії */}
        <Typography variant="subtitle2" fontSize={12} sx={{ mt: 2 }}>
          Дефолтні водії
        </Typography>

        <Autocomplete disabled={isGuest} options={personnelOptions} value={driver1Obj} onChange={(_, v) => { setDriver1Obj(v); setDriver1Id(v?.value || ""); }} isOptionEqualToValue={isOptionEqualToValue} renderInput={(params) => <TextField {...params} label="Водій 1" size="small" margin="dense" />} />
        <Autocomplete disabled={isGuest} options={personnelOptions} value={driver2Obj} onChange={(_, v) => { setDriver2Obj(v); setDriver2Id(v?.value || ""); }} isOptionEqualToValue={isOptionEqualToValue} renderInput={(params) => <TextField {...params} label="Водій 2" size="small" margin="dense" />} />
        <Autocomplete disabled={isGuest} options={personnelOptions} value={driver3Obj} onChange={(_, v) => { setDriver3Obj(v); setDriver3Id(v?.value || ""); }} isOptionEqualToValue={isOptionEqualToValue} renderInput={(params) => <TextField {...params} label="Водій 3" size="small" margin="dense" />} />

        <TextField
          disabled={isGuest}
          label="Примітка"
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={3}
          inputProps={{ maxLength: 250, style: { fontSize: 12 } }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
        />
      </DialogContent>

      <DialogActions>
        <Button variant="contained" size="small" onClick={handleSave} disabled={isGuest}>
          Зберегти
        </Button>
      </DialogActions>
    </Dialog>
  );
}
