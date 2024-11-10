import { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import QuestionIco from '../../assets/ico/10965421.webp';
import SelectComponent from '../Select'; 

export default function AddPersonalModal({ onClose }) { 
    const dispatch = useDispatch();
    const editGroupId = useSelector(state => state.modals.editGroupId);
    const editPersonId = useSelector(state => state.modals.editPersonId);
    const groups = useSelector(selectAllGroups);

    const editPerson = groups.flatMap(group => group.personnel).find(person => person._id === editPersonId);

    const handleWrapperClick = closeModal(onClose);

    const [firstName, setFirstName] = useState(editPerson ? editPerson.firstName : '');
    const [lastName, setLastName] = useState(editPerson ? editPerson.lastName : '');
    const [contactNumber, setContactNumber] = useState(editPerson ? editPerson.contactNumber : ''); 
    const [note, setNote] = useState(editPerson ? editPerson.note : '');
    const [employeePhoto, setEmployeePhoto] = useState(editPerson && editPerson.photoPath 
        ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/') 
        : QuestionIco);
    const [selectedGroup, setSelectedGroup] = useState(editPerson ? editGroupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editGroupId)?.name : null);

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value); 
        setSelectedGroupName(option.label);
    };

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

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
        formData.append('firstName', firstName);
        formData.append('lastName', lastName);
        formData.append('contactNumber', contactNumber);
        formData.append('note', note);
        formData.append('groupId', selectedGroup || editGroupId);

        if (employeePhoto instanceof Blob) {
            formData.append('photo', employeePhoto, 'employee.webp');
        } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
            const blob = await createBlobFromImagePath(employeePhoto); 
            formData.append('photo', blob, 'employee.webp');
        }

        try {
            const url = apiRoutes.addPersonnel(selectedGroup);
            const response = await fetch(url, { method: 'POST', body: formData });

            if (!response.ok) {
                throw new Error('Failed to save employee');
            }

            const savedEmployee = await response.json();

            if (editPersonId) {
                const deleteUrl = apiRoutes.deletePersonnel(editGroupId, editPersonId);
                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete old employee');
                }
            }

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
                            <StyledText>{editPersonId ? 'Змінити фото' : 'Додати фото'}</StyledText>
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
                        value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} 
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
