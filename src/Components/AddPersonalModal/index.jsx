import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState } from 'react';
import apiRoutes from '../../helpres/ApiRoutes';
import QuestionIco from '../../assets/ico/10965421.png'

export default function AddPersonalModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);

    // Стан для кожного поля
    const [groupName, setGroupName] = useState('');
    const [groupOwnership, setGroupOwnership] = useState('');
    const [contactNumber, setContactNumber] = useState(''); 
    const [groupDescription, setGroupDescription] = useState('');
    const [employeePhoto, setEmployeePhoto] = useState(null); // Стан для фото працівника
    const [previewPhoto, setPreviewPhoto] = useState(QuestionIco); // Стан для попереднього перегляду фото

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setEmployeePhoto(file); // Зберігаємо вибране зображення
        setPreviewPhoto(URL.createObjectURL(file)); // Створюємо тимчасовий URL для попереднього перегляду
    };

    const handleSave = async () => {
        const groupData = new FormData();
        groupData.append('name', groupName);
        groupData.append('ownership', groupOwnership);
        groupData.append('contactNumber', contactNumber); 
        groupData.append('description', groupDescription);

        if (employeePhoto) {
            groupData.append('photo', employeePhoto);
        }

        try {
            const response = await fetch(apiRoutes.addGroup, { 
                method: 'POST',
                body: groupData,
            });

            if (!response.ok) {
                throw new Error('Failed to save group');
            }

            const savedGroup = await response.json();
            console.log('Group saved:', savedGroup); 
            onClose(); 
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} /> 
                <StyledTitle>Додавання нового працівника</StyledTitle>
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
                        <PhotoPic src={previewPhoto} alt="Прев'ю фото"></PhotoPic>
                    </PhotoBlock>
                </StyledPhotoBlock>
                <StyledLabel>
                    <StyledSubtitle>Ім'я працівника</StyledSubtitle>
                    <StyledInput 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Прізвище працівника</StyledSubtitle>
                    <StyledInput 
                        value={groupOwnership} 
                        onChange={(e) => setGroupOwnership(e.target.value)}
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
                        value={groupDescription} 
                        onChange={(e) => setGroupDescription(e.target.value)}
                    />
                </StyledLabel>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </StyledModal>
        </StyledWrapper>
    );
}
