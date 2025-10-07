// import { useState } from 'react';
// import { useSelector } from 'react-redux';
// import {
//     Dialog,
//     DialogTitle,
//     DialogContent,
//     DialogActions,
//     TextField,
//     Button,
//     Select,
//     MenuItem,
//     InputLabel,
//     FormControl,
//     IconButton,
//     Avatar,
//     Typography
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import QuestionIco from '../../assets/ico/10965421.webp';
// import { fieldOperations } from '../../helpres';
// import { useGroupsData } from '../../hooks/useGroupsData';
// import { useTechniquesData, useSaveTechnique, useUpdateTechnique } from '../../hooks/useTechniquesData';
// import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';

// export default function AddTechniqueModal({ onClose }) {
//     const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);

//     const saveTechnique = useSaveTechnique();
//     const updateTechnique = useUpdateTechnique();

//     const { data: groups = [] } = useGroupsData();
//     const { data: techniques = [] } = useTechniquesData();

//     const editTechnique = techniques.find(t => t._id === editTechniqueId);

//     const [selectedGroup, setSelectedGroup] = useState(editTechnique?.groupId || editGroupId || null);
//     const [selectedGroupName, setSelectedGroupName] = useState(
//         editTechnique
//             ? groups.find(g => g._id === editTechnique.groupId)?.name || ''
//             : groups.find(g => g._id === editGroupId)?.name || ''
//     );

//     const [name, setName] = useState(editTechnique?.name || '');
//     const [rfid, setRfid] = useState(editTechnique?.rfid || '');
//     const [uniqNum, setUniqNum] = useState(editTechnique?.uniqNum || '');
//     const [width, setWidth] = useState(editTechnique?.width || '');
//     const [speed, setSpeed] = useState(editTechnique?.speed || '');
//     const [note, setNote] = useState(editTechnique?.note || '');
//     const [fieldOperation, setFieldOperation] = useState(editTechnique?.fieldOperation || '');
//     const [techniquePhoto, setTechniquePhoto] = useState(
//         editTechnique?.photoPath
//             ? '/src/' + editTechnique.photoPath.substring(3).replace(/\\/g, '/')
//             : QuestionIco
//     );

//     const handleGroupChange = (event) => setSelectedGroup(event.target.value);
//     const handleFieldOperationChange = (event) => setFieldOperation(event.target.value);

//     const handlePhotoChange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
//             setTechniquePhoto(webpBlob);
//         }
//     };

//     const handleSave = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('groupId', selectedGroup || editGroupId);
//             formData.append('name', name);
//             formData.append('rfid', rfid);
//             formData.append('uniqNum', uniqNum);
//             formData.append('width', width);
//             formData.append('speed', speed);
//             formData.append('note', note);
//             formData.append('fieldOperation', fieldOperation);

//             if (techniquePhoto instanceof Blob) {
//                 formData.append('photo', techniquePhoto, 'technique.webp');
//             } else if (typeof techniquePhoto === 'string' && techniquePhoto !== QuestionIco) {
//                 const blob = await createBlobFromImagePath(techniquePhoto);
//                 formData.append('photo', blob, 'technique.webp');
//             }

//             if (editTechniqueId) {
//                 await updateTechnique.mutateAsync({ id: editTechniqueId, techniqueData: formData });
//             } else {
//                 await saveTechnique.mutateAsync(formData);
//             }

//             onClose();
//         } catch (error) {
//             console.error('❌ Помилка при збереженні техніки:', error);
//         }
//     };

//     return (
//         <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
//             <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
//                 {editTechniqueId ? 'Редагування техніки' : 'Додавання нової техніки'}
//                 <IconButton onClick={onClose} size="small">
//                     <CloseIcon fontSize="small" />
//                 </IconButton>
//             </DialogTitle>

//             <DialogContent dividers>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                         <Typography variant="subtitle2" fontSize={12}>Фото техніки</Typography>
//                         <Button variant="contained" size="small" component="label">
//                             {editTechniqueId ? 'Змінити фото' : 'Додати фото'}
//                             <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
//                         </Button>
//                     </div>
//                     <Avatar
//                         src={techniquePhoto instanceof Blob ? URL.createObjectURL(techniquePhoto) : techniquePhoto}
//                         variant="square"
//                         sx={{ width: 100, height: 140, border: '1px solid grey' }}
//                     />
//                 </div>

//                 <FormControl fullWidth margin="dense">
//                     <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
//                     <Select value={selectedGroup || ''} onChange={handleGroupChange} size="small" label="Група">
//                         {groups.map(g => (
//                             <MenuItem key={g._id} value={g._id} sx={{ fontSize: 12 }}>{g.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 <FormControl fullWidth margin="dense">
//                     <InputLabel sx={{ fontSize: 12 }}>Тип обладнання</InputLabel>
//                     <Select value={fieldOperation || ''} onChange={handleFieldOperationChange} size="small" label="Тип обладнання">
//                         {fieldOperations.map(f => (
//                             <MenuItem key={f._id} value={f._id} sx={{ fontSize: 12 }}>{f.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 <TextField label="Найменування" fullWidth margin="dense" size="small" value={name} onChange={(e) => setName(e.target.value)} />
//                 <TextField label="Номер RFID мітки" fullWidth margin="dense" size="small" value={rfid} onChange={(e) => setRfid(e.target.value)} />
//                 <TextField label="Унікальний номер" fullWidth margin="dense" size="small" value={uniqNum} onChange={(e) => setUniqNum(e.target.value)} />
//                 <TextField label="Ширина, м" fullWidth margin="dense" size="small" value={width} onChange={(e) => setWidth(e.target.value)} />
//                 <TextField label="Макс. швидкість, км/год" fullWidth margin="dense" size="small" value={speed} onChange={(e) => setSpeed(e.target.value)} />
                
//                 <TextField
//                     label="Примітка"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     multiline
//                     rows={3}
//                     inputProps={{ maxLength: 250, style: { fontSize: 12 } }}
//                     value={note}
//                     onChange={(e) => setNote(e.target.value)}
//                 />
//             </DialogContent>

//             <DialogActions>
//                 <Button variant="contained" size="small" onClick={handleSave}>Зберегти</Button>
//             </DialogActions>
//         </Dialog>
//     );
// }














import React, { useState, useMemo } from "react";
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
  Box,
  Tooltip
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import QuestionIco from "../../assets/ico/10965421.webp";

import { fieldOperations } from "../../helpres";
import { useGroupsData } from "../../hooks/useGroupsData";
import { useTechniquesData, useSaveTechnique, useUpdateTechnique } from "../../hooks/useTechniquesData";
import { createBlobFromImagePath, convertImageToWebP } from "../../helpres/imageUtils";

export default function AddTechniqueModal({ onClose }) {
  const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);
  const userRole = useSelector((state) => state.user.role);
  const isGuest = userRole === "guest";

  const saveTechnique = useSaveTechnique();
  const updateTechnique = useUpdateTechnique();

  const { data: groups = [] } = useGroupsData();
  const { data: techniques = [] } = useTechniquesData();

  const editTechnique = techniques.find(t => t._id === editTechniqueId);

  const [selectedGroup, setSelectedGroup] = useState(editTechnique?.groupId || editGroupId || "");
  const [fieldOperation, setFieldOperation] = useState(editTechnique?.fieldOperation || "");
  const [name, setName] = useState(editTechnique?.name || "");
  const [rfid, setRfid] = useState(editTechnique?.rfid || "");
  const [uniqNum, setUniqNum] = useState(editTechnique?.uniqNum || "");
  const [width, setWidth] = useState(editTechnique?.width || "");
  const [speed, setSpeed] = useState(editTechnique?.speed || "");
  const [note, setNote] = useState(editTechnique?.note || "");

  const [techniquePhoto, setTechniquePhoto] = useState(
    editTechnique?.photoPath
      ? '/src/' + editTechnique.photoPath.substring(3).replace(/\\/g, '/')
      : QuestionIco
  );

  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const webpBlob = file.type === "image/webp" ? file : await convertImageToWebP(file);
      setTechniquePhoto(webpBlob);
    }
  };

  const handleSave = async () => {
    if (isGuest) return;

    try {
      const formData = new FormData();
      formData.append("groupId", selectedGroup || editGroupId);
      formData.append("fieldOperation", fieldOperation);
      formData.append("name", name);
      formData.append("rfid", rfid);
      formData.append("uniqNum", uniqNum);
      formData.append("width", width);
      formData.append("speed", speed);
      formData.append("note", note);

      if (techniquePhoto instanceof Blob) {
        formData.append("photo", techniquePhoto, "technique.webp");
      } else if (typeof techniquePhoto === "string" && techniquePhoto !== QuestionIco) {
        const blob = await createBlobFromImagePath(techniquePhoto);
        formData.append("photo", blob, "technique.webp");
      }

      if (editTechniqueId) {
        await updateTechnique.mutateAsync({ id: editTechniqueId, techniqueData: formData });
      } else {
        await saveTechnique.mutateAsync(formData);
      }

      onClose();
    } catch (error) {
      console.error("❌ Помилка при збереженні техніки:", error);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
        {editTechniqueId ? "Редагування техніки" : "Додавання нової техніки"}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        {/* Фото */}
        <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <Typography variant="subtitle2" fontSize={12}>Фото техніки</Typography>
            <Button variant="contained" size="small" component="label" disabled={isGuest}>
              {editTechniqueId ? "Змінити фото" : "Додати фото"}
              <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
            </Button>
          </Box>
          <Avatar
            src={techniquePhoto instanceof Blob ? URL.createObjectURL(techniquePhoto) : techniquePhoto}
            variant="square"
            sx={{ width: 100, height: 140, border: "1px solid grey" }}
          />
        </Box>

        {/* Група */}
        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
          <MuiSelect
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
            size="small"
          >
            {groups.map(g => (
              <MenuItem key={g._id} value={g._id} sx={{ fontSize: 12 }}>{g.name}</MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        {/* Тип обладнання */}
        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Тип обладнання</InputLabel>
          <MuiSelect
            value={fieldOperation}
            onChange={(e) => setFieldOperation(e.target.value)}
            size="small"
          >
            {fieldOperations.map(f => (
              <MenuItem key={f._id} value={f._id} sx={{ fontSize: 12 }}>{f.name}</MenuItem>
            ))}
          </MuiSelect>
        </FormControl>

        {/* Поля */}
        <TextField disabled={isGuest} label="Найменування" fullWidth margin="dense" size="small" value={name} onChange={(e) => setName(e.target.value)} />
        <TextField disabled={isGuest} label="Номер RFID мітки" fullWidth margin="dense" size="small" value={rfid} onChange={(e) => setRfid(e.target.value)} />
        <TextField disabled={isGuest} label="Унікальний номер" fullWidth margin="dense" size="small" value={uniqNum} onChange={(e) => setUniqNum(e.target.value)} />
        <TextField disabled={isGuest} label="Ширина, м" fullWidth margin="dense" size="small" value={width} onChange={(e) => setWidth(e.target.value)} />
        <TextField disabled={isGuest} label="Макс. швидкість, км/год" fullWidth margin="dense" size="small" value={speed} onChange={(e) => setSpeed(e.target.value)} />
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
