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

export default function AddVehicleModal({onClose}){
    const handleWrapperClick = closeModal(onClose);
    const groups = useSelector(selectAllGroups);
    const dispatch = useDispatch();

    // const [selectedGroup, setSelectedGroup] = useState(editPerson ? editGroupId : null);
    // const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editGroupId)?.name : null);
    // const [employeePhoto, setEmployeePhoto] = useState(editPerson && editPerson.photoPath 
    //     ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/') 
    //     : QuestionIco);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState(null);
    const [regNumber, setRegNumber] = useState(null)
    const [mark, setMark] = useState(null)
    const [note, setNote] = useState(null)
    const [employeePhoto, setEmployeePhoto] = useState(QuestionIco)
    const [vehicleType, setVehicleType] = useState(null)
    const [ vehicleTypeName, setVehicleTypeName]= useState(null)

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value); 
        setSelectedGroupName(option.label);
    };

    const handleVehicleTypeChange = (option) => {
        if (option) {
            setVehicleType(option.value);
            setVehicleTypeName(option.label);
        } else {
            setVehicleType(null);
            setVehicleTypeName(null);
        }
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

    // const handleSave = async () => {
        // onClose();
        // const formData = new FormData();
        // formData.append('groupId', selectedGroup);
        // formData.append('vehicleType', vehicleType);
        // formData.append('regNumber', regNumber);
        // formData.append('info', info);
        // formData.append('note', note);

        // if (employeePhoto instanceof Blob) {
        //     formData.append('photo', employeePhoto, 'vehicle.webp');
        // }

        // formData.append('groupId', selectedGroup || editGroupId);

        // for (const [key, value] of formData.entries()) {
        //     console.log(`${key}:`, value);
        // }

        // if (employeePhoto instanceof Blob) {
        //     formData.append('photo', employeePhoto, 'employee.webp');
        // } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
        //     const blob = await createBlobFromImagePath(employeePhoto); 
        //     formData.append('photo', blob, 'employee.webp');
        // }

        // try {
        //     const url = apiRoutes.addPersonnel(selectedGroup);
        //     const response = await fetch(url, { method: 'POST', body: formData });

        //     if (!response.ok) {
        //         throw new Error('Failed to save employee');
        //     }

        //     const savedEmployee = await response.json();

        //     if (editPersonId) {
        //         const deleteUrl = apiRoutes.deletePersonnel(editGroupId, editPersonId);
        //         const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

        //         if (!deleteResponse.ok) {
        //             throw new Error('Failed to delete old employee');
        //         }
        //     }

        //     dispatch(fetchGroups());
        //     onClose();
        // } catch (error) {
        //     console.error('Error saving employee:', error);
        // }
    // };

    const handleSave = async () => {
        // Закриття модалки після збереження
        onClose();
    
        // Створюємо FormData для відправки на сервер
        const formData = new FormData();
        formData.append('groupId', selectedGroup); // ID групи
        formData.append('vehicleType', vehicleType); // Тип техніки
        formData.append('regNumber', regNumber); // Реєстраційний номер
        formData.append('mark', mark); // Інформація про техніку
        formData.append('note', note); // Нотатки
    
        // Якщо фото техніки є, додаємо його до FormData
        if (employeePhoto instanceof Blob) {
            formData.append('photo', employeePhoto, 'vehicle.webp'); // Додаємо фото як WebP
        }
    
        // Логування даних для перевірки
        for (const [key, value] of formData.entries()) {
            console.log(`${key}:`, value);
        }
    
        try {
            // Виконуємо POST запит на сервер для додавання техніки
            const response = await fetch(apiRoutes.addVehicle(selectedGroup), {
                method: 'POST',
                body: formData
            });

            console.log(response)
    
            // Перевірка на успіх
            if (!response.ok) {
                throw new Error('Не вдалося зберегти техніку');
            }
    
            // Отримуємо результат
            const savedVehicle = await response.json();
    
            // Логування успішного збереження
            console.log('Техніка успішно додана:', savedVehicle);
    
            // Можна додати додаткові дії, наприклад, оновити список техніки або груп
            dispatch(fetchGroups()); // Оновлення груп чи техніки
    
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
                        value={vehicleType ? { value: vehicleType, label: vehicleTypeName } : null} // Передаємо об'єкт з поточним значенням
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