import { Styles } from './styles';
import closeModal from "../../helpres/closeModal";
import { useState } from 'react';
import SelectComponent from '../Select';
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';
import { vehicleTypes } from '../../helpres';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { useGroupsData, useDeleteVehicle, useSaveVehicle } from '../../hooks/useGroupsData'; // Хуки для роботи з групами та технікою
import { useSelector } from 'react-redux';

export default function AddVehicleModal({ onClose }) {
    const { editGroupId, editVehicleId } = useSelector((state) => state.modals);
    const saveVehicle = useSaveVehicle();
    
    const handleWrapperClick = closeModal(onClose);

    // Отримуємо дані груп через React Query
    const { data: groups = [] } = useGroupsData();

    // Хуки для оновлення та видалення техніки
    const deleteVehicle = useDeleteVehicle();

    const editVehicle = groups
        .flatMap(group => group.vehicles)
        .find(vehicle => vehicle._id === editVehicleId);

    const [selectedGroup, setSelectedGroup] = useState(editVehicle ? editGroupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editVehicle ? groups.find(group => group._id === editGroupId)?.name : '');
    const [regNumber, setRegNumber] = useState(editVehicle?.regNumber || '');
    const [imei, setImei] = useState(editVehicle?.imei || '');
    const [mark, setMark] = useState(editVehicle?.mark || '');
    const [note, setNote] = useState(editVehicle?.note || '');
    const [vehicleType, setVehicleType] = useState(editVehicle?.vehicleType || '');
    const [employeePhoto, setEmployeePhoto] = useState(editVehicle?.photoPath ? `/src/${editVehicle.photoPath.substring(3).replace(/\\/g, '/')}` : QuestionIco);

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value);
        setSelectedGroupName(option.label);
    };

    const handleVehicleTypeChange = (option) => {
        setVehicleType(option?.value || '');
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
            setEmployeePhoto(webpBlob);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('groupId', selectedGroup);
            formData.append('vehicleType', vehicleType);
            formData.append('regNumber', regNumber);
            formData.append('mark', mark);
            formData.append('note', note);
            formData.append('imei', imei);
    
            if (employeePhoto instanceof Blob) {
                formData.append('photo', employeePhoto, 'vehicle.webp');
            } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
                const blob = await createBlobFromImagePath(employeePhoto);
                formData.append('photo', blob, 'vehicle.webp');
            }
    
            if (editVehicleId) {
                // Видалення старих даних через хук
                await deleteVehicle.mutateAsync({ groupId: editGroupId, vehicleId: editVehicleId });
                console.log(`Стара техніка з ID ${editVehicleId} успішно видалена.`);
            }
    
            // Збереження нових даних через хук
            saveVehicle.mutate({
                groupId: selectedGroup,
                vehicleData: formData,
            });
    
            onClose();
        } catch (error) {
            console.error('Помилка при збереженні техніки:', error);
        }
    };

    return (
        <Styles.wrapper onClick={handleWrapperClick}>
            <Styles.modal>
                <Styles.title>{editVehicleId ? 'Редагування техніки' : 'Додавання нової техніки'}</Styles.title>
                <Styles.closeButton onClick={onClose} />
                <Styles.styledPhotoBlock>
                    <Styles.blockColumn>
                        <Styles.subtitle>Фото техніки</Styles.subtitle>
                        <Styles.styledButtonLabel>
                            <Styles.styledText>Додати фото</Styles.styledText>
                            <Styles.styledInputFile type="file" accept="image/*" onChange={handlePhotoChange} />
                        </Styles.styledButtonLabel>
                    </Styles.blockColumn>
                    <Styles.photoBlock>
                        <Styles.photoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />
                    </Styles.photoBlock>
                </Styles.styledPhotoBlock>
                <Styles.lable>
                    <Styles.subtitle>Виберіть групу</Styles.subtitle>
                    <SelectComponent  
                        options={groups} 
                        value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} 
                        onChange={handleGroupChange} 
                        placeholder="Оберіть групу" 
                    />
                </Styles.lable>
                <Styles.lable>
                    <Styles.subtitle>Виберіть тип техніки</Styles.subtitle>
                    <SelectComponent 
                        options={vehicleTypes} 
                        value={vehicleType ? { value: vehicleType, label: vehicleTypes.find(vt => vt._id === vehicleType)?.name } : null} 
                        onChange={handleVehicleTypeChange} 
                        placeholder="Оберіть тип техніки"
                    />
                </Styles.lable>
                <Styles.lable>
                    <Styles.subtitle>Марка засобу</Styles.subtitle>
                    <Styles.input value={mark} onChange={(e) => setMark(e.target.value)} />
                </Styles.lable>
                <Styles.lable>
                    <Styles.subtitle>Номер реєстрації</Styles.subtitle>
                    <Styles.input value={regNumber} onChange={(e) => setRegNumber(e.target.value)} />
                </Styles.lable>
                <Styles.lable>
                    <Styles.subtitle>IMEI трекера</Styles.subtitle>
                    <Styles.input value={imei} onChange={(e) => setImei(e.target.value)} />
                </Styles.lable>
                <Styles.lable>
                    <Styles.textarea maxLength={250} value={note} onChange={(e) => setNote(e.target.value)} />
                </Styles.lable>
                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button text="Зберегти" onClick={handleSave} />
                </div>
            </Styles.modal>
        </Styles.wrapper>
    );
}