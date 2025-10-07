// import { useState } from 'react';
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
// import { useSelector } from 'react-redux';
// import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
// import { personalFunctions } from '../../helpres/index';

// import { usePersonnelData, useUpdatePersonnel, useSavePersonnel } from '../../hooks/usePersonnelData';
// import { useGroupsData } from '../../hooks/useGroupsData';

// export default function AddPersonalModal({ onClose }) {
//     const { editGroupId, editPersonId } = useSelector((state) => state.modals);

//     const savePersonnel = useSavePersonnel();
//     const updatePersonnel = useUpdatePersonnel();
//     const { data: personnel = [] } = usePersonnelData();
//     const { data: groups = [] } = useGroupsData();

//     const editPerson = personnel.find(person => person._id === editPersonId);

//     const [firstName, setFirstName] = useState(editPerson?.firstName || '');
//     const [lastName, setLastName] = useState(editPerson?.lastName || '');
//     const [contactNumber, setContactNumber] = useState(editPerson?.contactNumber || '');
//     const [rfid, setRfid] = useState(editPerson?.rfid || '');
//     const [note, setNote] = useState(editPerson?.note || '');
//     const [personnelFunction, setPersonnelFunction] = useState(editPerson?.function || '');

//     const [employeePhoto, setEmployeePhoto] = useState(editPerson?.photoPath
//         ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/')
//         : QuestionIco);

//     const [selectedGroup, setSelectedGroup] = useState(editPerson ? editPerson.groupId : null);

//     const handleGroupChange = (event) => {
//         setSelectedGroup(event.target.value);
//     };

//     const handlePhotoChange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.type === 'image/webp') {
//                 setEmployeePhoto(file);
//             } else {
//                 const webpBlob = await convertImageToWebP(file);
//                 setEmployeePhoto(webpBlob);
//             }
//         }
//     };

//     const handleSave = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('firstName', firstName);
//             formData.append('lastName', lastName);
//             formData.append('contactNumber', contactNumber);
//             formData.append('note', note);
//             formData.append('rfid', rfid);
//             formData.append('groupId', selectedGroup || editGroupId);
//             formData.append('function', personnelFunction);

//             if (employeePhoto instanceof Blob) {
//                 formData.append('photo', employeePhoto, 'employee.webp');
//             } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
//                 const blob = await createBlobFromImagePath(employeePhoto);
//                 formData.append('photo', blob, 'employee.webp');
//             }

//             if (editPersonId) {
//                 await updatePersonnel.mutateAsync({ personnelId: editPersonId, personnelData: formData });
//             } else {
//                 await savePersonnel.mutateAsync(formData);
//             }

//             onClose();
//         } catch (error) {
//             console.error('Помилка при збереженні працівника:', error);
//         }
//     };

//     return (
//         <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
//             <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
//                 {editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}
//                 <IconButton onClick={onClose} size="small">
//                     <CloseIcon fontSize="small" />
//                 </IconButton>
//             </DialogTitle>

//             <DialogContent dividers>
//                 <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//                     <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//                         <Typography variant="subtitle2" fontSize={12}>Фото працівника</Typography>
//                         <Button variant="contained" size="small" component="label">
//                             {editPersonId ? 'Змінити фото' : 'Додати фото'}
//                             <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
//                         </Button>
//                     </div>
//                     <Avatar
//                         src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto}
//                         variant="square"
//                         sx={{ width: 100, height: 140, border: '1px solid grey' }}
//                     />
//                 </div>

//                 <FormControl fullWidth margin="dense">
//                     <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
//                     <Select
//                         value={selectedGroup || ''}
//                         onChange={handleGroupChange}
//                         label="Група"
//                         size="small"
//                     >
//                         {groups.map(group => (
//                             <MenuItem key={group._id} value={group._id} sx={{ fontSize: 12 }}>{group.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 <TextField
//                     label="Ім'я працівника"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     value={firstName}
//                     onChange={(e) => setFirstName(e.target.value)}
//                 />
//                 <TextField
//                     label="Прізвище працівника"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     value={lastName}
//                     onChange={(e) => setLastName(e.target.value)}
//                 />
//                 <TextField
//                     label="Rfid мітка"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     value={rfid}
//                     onChange={(e) => setRfid(e.target.value)}
//                 />

//                 <FormControl fullWidth margin="dense">
//                     <InputLabel sx={{ fontSize: 12 }}>Посада</InputLabel>
//                     <Select
//                         value={personnelFunction || ''}
//                         onChange={(e) => setPersonnelFunction(e.target.value)}
//                         size="small"
//                     >
//                         {personalFunctions.map(f => (
//                             <MenuItem key={f._id} value={f._id} sx={{ fontSize: 12 }}>{f.name}</MenuItem>
//                         ))}
//                     </Select>
//                 </FormControl>

//                 <TextField
//                     label="Контактний номер"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     value={contactNumber}
//                     onChange={(e) => setContactNumber(e.target.value)}
//                 />

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
//                 <Button variant="contained" size="small" onClick={handleSave}>
//                     Зберегти
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// }



// import { useState } from 'react';
// import {
//   Dialog,
//   DialogTitle,
//   DialogContent,
//   DialogActions,
//   TextField,
//   Button,
//   Select,
//   MenuItem,
//   InputLabel,
//   FormControl,
//   IconButton,
//   Avatar,
//   Typography,
//   Tooltip,
// } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import QuestionIco from '../../assets/ico/10965421.webp';
// import { useSelector } from 'react-redux';
// import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
// import { personalFunctions } from '../../helpres/index';

// import { usePersonnelData, useUpdatePersonnel, useSavePersonnel } from '../../hooks/usePersonnelData';
// import { useGroupsData } from '../../hooks/useGroupsData';

// export default function AddPersonalModal({ onClose }) {
//   const { editGroupId, editPersonId } = useSelector((state) => state.modals);
//   const role = useSelector((state) => state.user.role);
//   const isGuest = role === "guest";

//   const savePersonnel = useSavePersonnel();
//   const updatePersonnel = useUpdatePersonnel();
//   const { data: personnel = [] } = usePersonnelData();
//   const { data: groups = [] } = useGroupsData();

//   const editPerson = personnel.find(person => person._id === editPersonId);

//   const [firstName, setFirstName] = useState(editPerson?.firstName || '');
//   const [lastName, setLastName] = useState(editPerson?.lastName || '');
//   const [contactNumber, setContactNumber] = useState(editPerson?.contactNumber || '');
//   const [rfid, setRfid] = useState(editPerson?.rfid || '');
//   const [note, setNote] = useState(editPerson?.note || '');
//   const [personnelFunction, setPersonnelFunction] = useState(editPerson?.function || '');

//   const [employeePhoto, setEmployeePhoto] = useState(
//     editPerson?.photoPath
//       ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/')
//       : QuestionIco
//   );

//   const [selectedGroup, setSelectedGroup] = useState(editPerson ? editPerson.groupId : null);

//   const handleGroupChange = (event) => setSelectedGroup(event.target.value);

//   const handlePhotoChange = async (e) => {
//     if (isGuest) return;
//     const file = e.target.files[0];
//     if (file) {
//       if (file.type === 'image/webp') {
//         setEmployeePhoto(file);
//       } else {
//         const webpBlob = await convertImageToWebP(file);
//         setEmployeePhoto(webpBlob);
//       }
//     }
//   };

//   const handleSave = async () => {
//     if (isGuest) return;
//     try {
//       const formData = new FormData();
//       formData.append('firstName', firstName);
//       formData.append('lastName', lastName);
//       formData.append('contactNumber', contactNumber);
//       formData.append('note', note);
//       formData.append('rfid', rfid);
//       formData.append('groupId', selectedGroup || editGroupId);
//       formData.append('function', personnelFunction);

//       if (employeePhoto instanceof Blob) {
//         formData.append('photo', employeePhoto, 'employee.webp');
//       } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
//         const blob = await createBlobFromImagePath(employeePhoto);
//         formData.append('photo', blob, 'employee.webp');
//       }

//       if (editPersonId) {
//         await updatePersonnel.mutateAsync({ personnelId: editPersonId, personnelData: formData });
//       } else {
//         await savePersonnel.mutateAsync(formData);
//       }

//       onClose();
//     } catch (error) {
//       console.error('Помилка при збереженні працівника:', error);
//     }
//   };

//   return (
//     <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
//       <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
//         {editPersonId ? 'Перегляд працівника' : 'Додавання нового працівника'}
//         <IconButton onClick={onClose} size="small">
//           <CloseIcon fontSize="small" />
//         </IconButton>
//       </DialogTitle>

//       <DialogContent dividers>
//         <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
//           <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
//             <Typography variant="subtitle2" fontSize={12}>Фото працівника</Typography>
//             <Tooltip title={isGuest ? "Недостатньо прав для зміни фото" : "Додати/змінити фото"}>
//               <span>
//                 <Button
//                   variant="contained"
//                   size="small"
//                   component="label"
//                   disabled={isGuest}
//                   sx={{ opacity: isGuest ? 0.5 : 1 }}
//                 >
//                   {editPersonId ? 'Змінити фото' : 'Додати фото'}
//                   <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
//                 </Button>
//               </span>
//             </Tooltip>
//           </div>
//           <Avatar
//             src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto}
//             variant="square"
//             sx={{ width: 100, height: 140, border: '1px solid grey' }}
//           />
//         </div>

//         <FormControl fullWidth margin="dense" disabled={isGuest}>
//           <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
//           <Select
//             value={selectedGroup || ''}
//             onChange={handleGroupChange}
//             label="Група"
//             size="small"
//           >
//             {groups.map(group => (
//               <MenuItem key={group._id} value={group._id} sx={{ fontSize: 12 }}>
//                 {group.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           label="Ім'я працівника"
//           fullWidth
//           margin="dense"
//           size="small"
//           value={firstName}
//           onChange={(e) => setFirstName(e.target.value)}
//           disabled={isGuest}
//         />
//         <TextField
//           label="Прізвище працівника"
//           fullWidth
//           margin="dense"
//           size="small"
//           value={lastName}
//           onChange={(e) => setLastName(e.target.value)}
//           disabled={isGuest}
//         />
//         <TextField
//           label="Rfid мітка"
//           fullWidth
//           margin="dense"
//           size="small"
//           value={rfid}
//           onChange={(e) => setRfid(e.target.value)}
//           disabled={isGuest}
//         />

//         <FormControl fullWidth margin="dense" disabled={isGuest}>
//           <InputLabel sx={{ fontSize: 12 }}>Посада</InputLabel>
//           <Select
//             value={personnelFunction || ''}
//             onChange={(e) => setPersonnelFunction(e.target.value)}
//             size="small"
//           >
//             {personalFunctions.map(f => (
//               <MenuItem key={f._id} value={f._id} sx={{ fontSize: 12 }}>
//                 {f.name}
//               </MenuItem>
//             ))}
//           </Select>
//         </FormControl>

//         <TextField
//           label="Контактний номер"
//           fullWidth
//           margin="dense"
//           size="small"
//           value={contactNumber}
//           onChange={(e) => setContactNumber(e.target.value)}
//           disabled={isGuest}
//         />

//         <TextField
//           label="Примітка"
//           fullWidth
//           margin="dense"
//           size="small"
//           multiline
//           rows={3}
//           inputProps={{ maxLength: 250, style: { fontSize: 12 } }}
//           value={note}
//           onChange={(e) => setNote(e.target.value)}
//           disabled={isGuest}
//         />
//       </DialogContent>

//       <DialogActions>
//         <Tooltip title={isGuest ? "Недостатньо прав для збереження" : "Зберегти зміни"}>
//           <span>
//             <Button
//               variant="contained"
//               size="small"
//               onClick={handleSave}
//               disabled={isGuest}
//               sx={{ opacity: isGuest ? 0.5 : 1 }}
//             >
//               Зберегти
//             </Button>
//           </span>
//         </Tooltip>
//       </DialogActions>
//     </Dialog>
//   );
// }










import { useState } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  IconButton,
  Avatar,
  Typography,
  Tooltip,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuestionIco from '../../assets/ico/10965421.webp';
import { useSelector } from 'react-redux';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { personalFunctions } from '../../helpres/index';
import { usePersonnelData, useUpdatePersonnel, useSavePersonnel } from '../../hooks/usePersonnelData';
import { useGroupsData } from '../../hooks/useGroupsData';
import { BACKEND_URL } from "../../helpres";

export default function AddPersonalModal({ onClose }) {
  const { editGroupId, editPersonId } = useSelector((state) => state.modals);
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const savePersonnel = useSavePersonnel();
  const updatePersonnel = useUpdatePersonnel();
  const { data: personnel = [] } = usePersonnelData();
  const { data: groups = [] } = useGroupsData();

  const editPerson = personnel.find(person => person._id === editPersonId);

  const [firstName, setFirstName] = useState(editPerson?.firstName || '');
  const [lastName, setLastName] = useState(editPerson?.lastName || '');
  const [contactNumber, setContactNumber] = useState(editPerson?.contactNumber || '');
  const [rfid, setRfid] = useState(editPerson?.rfid || '');
  const [note, setNote] = useState(editPerson?.note || '');
  const [personnelFunction, setPersonnelFunction] = useState(editPerson?.function || '');

  const [employeePhoto, setEmployeePhoto] = useState(
    editPerson?.photoPath
      ? `${BACKEND_URL}/${editPerson.photoPath.replace(/\\/g, '/')}`
      : QuestionIco
  );

  const [selectedGroup, setSelectedGroup] = useState(editPerson ? editPerson.groupId : null);

  const handleGroupChange = (event) => setSelectedGroup(event.target.value);

  const handlePhotoChange = async (e) => {
    if (isGuest) return;
    const file = e.target.files[0];
    if (file) {
      if (file.type === 'image/webp') {
        setEmployeePhoto(file);
      } else {
        const webpBlob = await convertImageToWebP(file);
        setEmployeePhoto(webpBlob);
      }
    }
  };

  const handleSave = async () => {
    if (isGuest) return;
    try {
      const formData = new FormData();
      formData.append('firstName', firstName);
      formData.append('lastName', lastName);
      formData.append('contactNumber', contactNumber);
      formData.append('note', note);
      formData.append('rfid', rfid);
      formData.append('groupId', selectedGroup || editGroupId);
      formData.append('function', personnelFunction);

      if (employeePhoto instanceof Blob) {
        formData.append('photo', employeePhoto, 'employee.webp');
      }

      if (editPersonId) {
        await updatePersonnel.mutateAsync({ personnelId: editPersonId, personnelData: formData });
      } else {
        await savePersonnel.mutateAsync(formData);
      }

      onClose();
    } catch (error) {
      console.error('Помилка при збереженні працівника:', error);
    }
  };

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
        {editPersonId ? 'Перегляд працівника' : 'Додавання нового працівника'}
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
          <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
            <Typography variant="subtitle2" fontSize={12}>Фото працівника</Typography>
            <Tooltip title={isGuest ? "Недостатньо прав для зміни фото" : "Додати/змінити фото"}>
              <span>
                <Button
                  variant="contained"
                  size="small"
                  component="label"
                  disabled={isGuest}
                  sx={{ opacity: isGuest ? 0.5 : 1 }}
                >
                  {editPersonId ? 'Змінити фото' : 'Додати фото'}
                  <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                </Button>
              </span>
            </Tooltip>
          </div>
          <Avatar
            src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto}
            variant="square"
            sx={{ width: 100, height: 140, border: '1px solid grey' }}
          />
        </div>

        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
          <Select
            value={selectedGroup || ''}
            onChange={handleGroupChange}
            label="Група"
            size="small"
          >
            {groups.map(group => (
              <MenuItem key={group._id} value={group._id} sx={{ fontSize: 12 }}>
                {group.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Ім'я працівника"
          fullWidth
          margin="dense"
          size="small"
          value={firstName}
          onChange={(e) => setFirstName(e.target.value)}
          disabled={isGuest}
        />
        <TextField
          label="Прізвище працівника"
          fullWidth
          margin="dense"
          size="small"
          value={lastName}
          onChange={(e) => setLastName(e.target.value)}
          disabled={isGuest}
        />
        <TextField
          label="Rfid мітка"
          fullWidth
          margin="dense"
          size="small"
          value={rfid}
          onChange={(e) => setRfid(e.target.value)}
          disabled={isGuest}
        />

        <FormControl fullWidth margin="dense" disabled={isGuest}>
          <InputLabel sx={{ fontSize: 12 }}>Посада</InputLabel>
          <Select
            value={personnelFunction || ''}
            onChange={(e) => setPersonnelFunction(e.target.value)}
            size="small"
          >
            {personalFunctions.map(f => (
              <MenuItem key={f._id} value={f._id} sx={{ fontSize: 12 }}>
                {f.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <TextField
          label="Контактний номер"
          fullWidth
          margin="dense"
          size="small"
          value={contactNumber}
          onChange={(e) => setContactNumber(e.target.value)}
          disabled={isGuest}
        />

        <TextField
          label="Примітка"
          fullWidth
          margin="dense"
          size="small"
          multiline
          rows={3}
          inputProps={{ maxLength: 250, style: { fontSize: 12 } }}
          value={note}
          onChange={(e) => setNote(e.target.value)}
          disabled={isGuest}
        />
      </DialogContent>

      <DialogActions>
        <Tooltip title={isGuest ? "Недостатньо прав для збереження" : "Зберегти зміни"}>
          <span>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              disabled={isGuest}
              sx={{ opacity: isGuest ? 0.5 : 1 }}
            >
              Зберегти
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
