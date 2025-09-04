import { useState } from 'react';
import { useSelector } from 'react-redux';
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
    Typography
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import QuestionIco from '../../assets/ico/10965421.webp';
import SelectComponent from '../Select';
import { vehicleTypes } from '../../helpres';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { useGroupsData } from '../../hooks/useGroupsData';
import { useVehiclesData, useSaveVehicle, useUpdateVehicle } from '../../hooks/useVehiclesData';

export default function AddVehicleModal({ onClose }) {
    const { editGroupId, editVehicleId } = useSelector((state) => state.modals);

    const saveVehicle = useSaveVehicle();
    const updateVehicle = useUpdateVehicle();

    const { data: vehicles = [] } = useVehiclesData();
    const { data: groups = [] } = useGroupsData();

    const editVehicle = vehicles.find(vehicle => vehicle._id === editVehicleId);

    const [selectedGroup, setSelectedGroup] = useState(editVehicle ? editVehicle.groupId : null);
    const [regNumber, setRegNumber] = useState(editVehicle?.regNumber || '');
    const [imei, setImei] = useState(editVehicle?.imei || '');
    const [sim, setSim] = useState(editVehicle?.sim || '');
    const [mark, setMark] = useState(editVehicle?.mark || '');
    const [note, setNote] = useState(editVehicle?.note || '');
    const [vehicleType, setVehicleType] = useState(editVehicle?.vehicleType || '');
    const [fuelCapacity, setFuelCapacity] = useState(editVehicle?.fuelCapacity || '');

    const [vehiclePhoto, setVehiclePhoto] = useState(
        editVehicle?.photoPath
            ? '/src/' + editVehicle.photoPath.substring(3).replace(/\\/g, '/')
            : QuestionIco
    );

    const handleGroupChange = (event) => setSelectedGroup(event.target.value);
    const handleVehicleTypeChange = (event) => setVehicleType(event.target.value);

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
            setVehiclePhoto(webpBlob);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('groupId', selectedGroup || editGroupId);
            formData.append('vehicleType', vehicleType);
            formData.append('regNumber', regNumber);
            formData.append('mark', mark);
            formData.append('note', note);
            formData.append('imei', imei);
            formData.append('sim', sim);
            formData.append('fuelCapacity', fuelCapacity);

            if (vehiclePhoto instanceof Blob) {
                formData.append('photo', vehiclePhoto, 'vehicle.webp');
            } else if (typeof vehiclePhoto === 'string' && vehiclePhoto !== QuestionIco) {
                const blob = await createBlobFromImagePath(vehiclePhoto);
                formData.append('photo', blob, 'vehicle.webp');
            }

            if (editVehicleId) {
                await updateVehicle.mutateAsync({ id: editVehicleId, vehicleData: formData });
            } else {
                await saveVehicle.mutateAsync(formData);
            }

            onClose();
        } catch (error) {
            console.error('[ERROR] Помилка при збереженні техніки:', error);
        }
    };

    return (
        <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
                {editVehicleId ? 'Редагування техніки' : 'Додавання нової техніки'}
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 16 }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                        <Typography variant="subtitle2" fontSize={12}>Фото техніки</Typography>
                        <Button variant="contained" size="small" component="label">
                            {editVehicleId ? 'Змінити фото' : 'Додати фото'}
                            <input type="file" hidden accept="image/*" onChange={handlePhotoChange} />
                        </Button>
                    </div>
                    <Avatar
                        src={vehiclePhoto instanceof Blob ? URL.createObjectURL(vehiclePhoto) : vehiclePhoto}
                        variant="square"
                        sx={{ width: 100, height: 140, border: '1px solid grey' }}
                    />
                </div>

                <FormControl fullWidth margin="dense">
                    <InputLabel sx={{ fontSize: 12 }}>Група</InputLabel>
                    <Select value={selectedGroup || ''} onChange={handleGroupChange} size="small" label="Група">
                        {groups.map(group => (
                            <MenuItem key={group._id} value={group._id} sx={{ fontSize: 12 }}>{group.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <FormControl fullWidth margin="dense">
                    <InputLabel sx={{ fontSize: 12 }}>Тип техніки</InputLabel>
                    <Select value={vehicleType || ''} onChange={handleVehicleTypeChange} size="small" label="Тип техніки">
                        {vehicleTypes.map(v => (
                            <MenuItem key={v._id} value={v._id} sx={{ fontSize: 12 }}>{v.name}</MenuItem>
                        ))}
                    </Select>
                </FormControl>

                <TextField label="Марка засобу" fullWidth margin="dense" size="small" value={mark} onChange={(e) => setMark(e.target.value)} />
                <TextField label="Номер реєстрації" fullWidth margin="dense" size="small" value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                <TextField label="IMEI трекера" fullWidth margin="dense" size="small" value={imei} onChange={(e) => setImei(e.target.value)} />
                <TextField label="Номер Sim-карти" fullWidth margin="dense" size="small" value={sim} onChange={(e) => setSim(e.target.value)} />
                <TextField label="Обʼєм паливного баку (л)" type="number" fullWidth margin="dense" size="small" value={fuelCapacity} onChange={(e) => setFuelCapacity(e.target.value)} />

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
                />
            </DialogContent>

            <DialogActions>
                <Button variant="contained" size="small" onClick={handleSave}>Зберегти</Button>
            </DialogActions>
        </Dialog>
    );
}
