import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import { useEffect, useState } from 'react';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import SelectComponent from '../Select';
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';
import { vehicleTypes } from '../../helpres';
import apiRoutes from '../../helpres/ApiRoutes';

export default function AddVehicleModal({ onClose }){
    const dispatch = useDispatch();
    const editVehicleId = useSelector(state => state.modals.editVehicleId);
    const editGroupId = useSelector(state => state.modals.editGroupId);
    const groups = useSelector(selectAllGroups);   

    const editVehicle = groups
    .flatMap(group => group.vehicles) // Перебір всіх груп
    .find(vehicle => vehicle._id === editVehicleId); // Пошук потрібного об'єкта

    const handleWrapperClick = closeModal(onClose);

    const [selectedGroup, setSelectedGroup] = useState(editVehicle ? editGroupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editVehicle ? groups.find(group => group._id === editGroupId)?.name : null);;
    const [regNumber, setRegNumber] = useState(editVehicle ? editVehicle.regNumber : '')
    const [mark, setMark] = useState(editVehicle ? editVehicle.mark : '')
    const [note, setNote] = useState(editVehicle ? editVehicle.note : '')
    const [employeePhoto, setEmployeePhoto] = useState(editVehicle && editVehicle.photoPath 
        ? '/src/' + editVehicle.photoPath.substring(3).replace(/\\/g, '/') 
        : QuestionIco)
    const [vehicleType, setVehicleType] = useState(editVehicle ? editVehicle.vehicleType : '')
    const [ vehicleTypeName, setVehicleTypeName]= useState(null)
    
    console.log(vehicleTypes)

    const handleGroupChange = (option) => {
        
        setSelectedGroup(option.value); 
        setSelectedGroupName(option.label);
    };

    useEffect(() => {
            dispatch(fetchGroups());
        }, [dispatch]);

        const handleVehicleTypeChange = (option) => {
            if (option) {
                setVehicleType(option.value); // Оновлення типу техніки за значенням
                setVehicleTypeName(option.label); // Оновлення назви типу
            } else {
                setVehicleType(null);
                setVehicleTypeName(null);
            }
        };

    const createBlobFromImagePath = async (imagePath) => {
        const response = await fetch(imagePath); 
        const imageBuffer = await response.arrayBuffer(); 
        const blob = new Blob([imageBuffer], { type: 'image/webp' });
        return blob;
    };

    const convertImageToWebP = (file) => {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (event) => {
                const img = new Image();
                img.onload = () => {
                    const canvas = document.createElement('canvas');
                    canvas.width = img.width;
                    canvas.height = img.height;
                    const ctx = canvas.getContext('2d');
                    ctx.drawImage(img, 0, 0);
                    canvas.toBlob((blob) => {
                        if (blob) {
                            resolve(blob);
                        } else {
                            reject('Failed to create WebP Blob');
                        }
                    }, 'image/webp', 0.8); 
                };
                img.src = event.target.result;
            };
            reader.onerror = () => reject('Failed to read file');
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e) => {
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
        const formData = new FormData();
        formData.append('groupId', selectedGroup); // ID групи
        formData.append('vehicleType', vehicleType); // Тип техніки
        formData.append('regNumber', regNumber); // Реєстраційний номер
        formData.append('mark', mark); // Марка
        formData.append('note', note); // Нотатки
    
        // Додаємо фото техніки, якщо воно є
        if (employeePhoto instanceof Blob) {
            formData.append('photo', employeePhoto, 'vehicle.webp');
        } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
            const blob = await createBlobFromImagePath(employeePhoto);
            formData.append('photo', blob, 'vehicle.webp');
        }
    
        try {
            // Створюємо нову техніку через POST
            const url = apiRoutes.addVehicle(selectedGroup);
            const response = await fetch(url, { method: 'POST', body: formData });
    
            if (!response.ok) {
                throw new Error('Не вдалося зберегти техніку');
            }
    
            const savedVehicle = await response.json();
            console.log('Техніка успішно збережена:', savedVehicle);
    
            // Якщо редагуємо техніку (editVehicleId є), видаляємо стару
            if (editVehicleId) {
                const deleteUrl = apiRoutes.deleteVehicle(editGroupId, editVehicleId);
                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
    
                if (!deleteResponse.ok) {
                    throw new Error('Не вдалося видалити стару техніку');
                }
            }
    
            // Оновлюємо список груп та техніки
            dispatch(fetchGroups());
    
            // Закриваємо модалку після успішного збереження
            onClose();
        } catch (error) {
            console.error('Помилка при збереженні техніки:', error);
        }
    };
    
    

    return(
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                {/* <StyledTitle>{editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}</StyledTitle> */}
                <StyledTitle>Додавання нової техніки</StyledTitle>
                <StyledCloseButton onClick={onClose} />

                <StyledPhotoBlock>
                    <BlockColumn>
                        <StyledSubtitle>Фото техніки</StyledSubtitle>
                        <StyledButtonLabel>
                            {/* <StyledText>{editPersonId ? 'Змінити фото' : 'Додати фото'}</StyledText> */}
                            <StyledText>Додати фото</StyledText>
                            <StyledInputFile 
                                type='file' 
                                accept="image/*" 
                                onChange={handlePhotoChange} 
                            />
                        </StyledButtonLabel>
                    </BlockColumn>
                    
                    <PhotoBlock>
                        <PhotoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />
                    </PhotoBlock>
                </StyledPhotoBlock>

                <StyledLabel>
                    <StyledSubtitle>Виберіть групу</StyledSubtitle>
                    <SelectComponent 
                        options={groups} 
                        value={groups.length > 0 && selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null}
                        onChange={handleGroupChange} 
                        placeholder="Оберіть групу"
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Виберіть тип техніки</StyledSubtitle>
                    <SelectComponent 
                        options={vehicleTypes} // Масив об'єктів передається у options
                        value={vehicleType ? { value: vehicleType, label: vehicleTypes.find(vt => vt._id === vehicleType)?.name } : null}
                        onChange={handleVehicleTypeChange} // Оновлюємо стан при зміні вибору
                        placeholder="Оберіть тип техніки"
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Марка засобу</StyledSubtitle>
                    <StyledInput 
                        value={mark}
                        onChange={(e) => setMark(e.target.value)}
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Номер реєстрації</StyledSubtitle>
                    <StyledInput 
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledTextArea
                        maxLength={250}
                        value={note} 
                        onChange={(e) => setNote(e.target.value)}
                    />
                </StyledLabel>

                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </StyledModal>
        </StyledWrapper>
    )
}