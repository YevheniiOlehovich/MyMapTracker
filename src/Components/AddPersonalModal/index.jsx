import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import QuestionIco from '../../assets/ico/10965421.png';
import SelectComponent from '../Select'; 
import { getBase64Image } from '../../helpres/imgDecoding'
// import { deletePersonnel } from '../../store/groupSlice'

export default function AddPersonalModal({ onClose }) { 
    const dispatch = useDispatch();
    const editGroupId = useSelector(state => state.modals.editGroupId);
    const editPersonId = useSelector(state => state.modals.editPersonId);
    const groups = useSelector(selectAllGroups);  // Всі групи

    // console.log('editin group', editGroupId)
    // console.log('editin person', editPersonId)

    // Оскільки персонал знаходиться в групах, потрібно знайти групу, що містить цього працівника
    const editPerson = groups.flatMap(group => group.personnel).find(person => person._id === editPersonId); // Текучий працівник для редагування
    
    const handleWrapperClick = closeModal(onClose);

    // Стейти для нових/редагованих даних
    const [firstName, setFirstName] = useState(editPerson ? editPerson.firstName : '');
    const [lastName, setLastName] = useState(editPerson ? editPerson.lastName : '');
    const [contactNumber, setContactNumber] = useState(editPerson ? editPerson.contactNumber : ''); 
    const [note, setNote] = useState(editPerson ? editPerson.note : '');
    const [employeePhoto, setEmployeePhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(editPerson ? getBase64Image(editPerson.photo): QuestionIco);
    const [selectedGroup, setSelectedGroup] = useState(editPerson ? editGroupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editGroupId)?.name : null); // Ініціалізуємо selectedGroupName

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value);  // Оновлюємо ID групи
        setSelectedGroupName(option.label);  // Оновлюємо назву групи
    };

    useEffect(() => {
        dispatch(fetchGroups()); // Завантажуємо групи
    }, [dispatch]);

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
                    }, 'image/webp', 0.8); // 0.8 - quality of WebP
                };
                img.src = event.target.result;
            };
            reader.onerror = () => reject('Failed to read file');
            reader.readAsDataURL(file);
        });
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        const webpBlob = await convertImageToWebP(file);
        setEmployeePhoto(webpBlob);
        setPreviewPhoto(URL.createObjectURL(webpBlob));
    };

    const handleSave = async () => {
        const formData = new FormData();
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('contactNumber', contactNumber);
        formData.append('note', note);
        formData.append('groupId', selectedGroup || editGroupId);
    
        // Додаємо фото, якщо є нове
        if (employeePhoto) {
            formData.append('photo', employeePhoto, 'employee.webp');
        } else if (editPerson && editPerson.photo) {
            const existingPhotoBuffer = editPerson.photo;
            const photoBlob = new Blob([existingPhotoBuffer.data], { type: 'image/webp' });
            formData.append('photo', photoBlob, 'employee.webp');
        }
    
        try {
            const url = apiRoutes.addPersonnel(selectedGroup);
            const response = await fetch(url, { method: 'POST', body: formData });
    
            if (!response.ok) {
                throw new Error('Failed to save employee');
            }
    
            const savedEmployee = await response.json();
            // console.log('Created new personnel:', savedEmployee);
    
            // Якщо це редагування, видаляємо старий запис
            if (editPersonId) {
                const deleteUrl = apiRoutes.deletePersonnel(editGroupId, editPersonId);
                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
    
                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete old employee');
                }
    
                // console.log(`Deleted old personnel with id: ${editPersonId}`);
            }
    
            // Оновлення груп після операції
            dispatch(fetchGroups());
            onClose();
        } catch (error) {
            console.error('Error saving employee:', error);
        }
    };
    
    

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} />
                <StyledTitle>{editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}</StyledTitle>
                
                <StyledPhotoBlock>
                    <BlockColumn>
                        <StyledSubtitle>Фото працівника</StyledSubtitle>
                        <StyledButtonLabel>
                            <StyledText>Додати фото</StyledText>
                            <StyledInputFile 
                                type='file' 
                                accept="image/*" 
                                onChange={handlePhotoChange} 
                            />
                        </StyledButtonLabel>
                    </BlockColumn>
                    
                    <PhotoBlock>
                        <PhotoPic imageUrl={previewPhoto}></PhotoPic>
                    </PhotoBlock>
                </StyledPhotoBlock>
                
                <StyledLabel>
                    <StyledSubtitle>Виберіть групу</StyledSubtitle>
                    <SelectComponent 
                        options={groups} 
                        value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} // передаємо значення групи
                        onChange={handleGroupChange} 
                        placeholder="Оберіть групу"
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Ім'я працівника</StyledSubtitle>
                    <StyledInput 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Прізвище працівника</StyledSubtitle>
                    <StyledInput 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Контактний номер</StyledSubtitle>
                    <StyledInput 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                </StyledLabel>
                <StyledLabel>
                    
                    <StyledTextArea
                        maxLength={250}
                        value={note} 
                        onChange={(e) => setNote(e.target.value)}
                    />
                </StyledLabel>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </StyledModal>
        </StyledWrapper>
    );
}