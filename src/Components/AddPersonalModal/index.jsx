import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; // Імпортуємо селектор і екшен
import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import QuestionIco from '../../assets/ico/10965421.png';
import SelectComponent from '../Select'; 



export default function AddPersonalModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);

    // Диспетчер для використання Redux
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups); // Отримуємо групи з глобального стану
    const [selectedGroup, setSelectedGroup] = useState(null); // Стан для обраної групи

    // Стан для кожного поля
    const [groupName, setGroupName] = useState('');
    const [groupOwnership, setGroupOwnership] = useState('');
    const [contactNumber, setContactNumber] = useState(''); 
    const [groupDescription, setGroupDescription] = useState('');
    const [employeePhoto, setEmployeePhoto] = useState(null);
    const [previewPhoto, setPreviewPhoto] = useState(QuestionIco); 

    // Отримання груп з бекенду при монтуванні компонента
    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setEmployeePhoto(file); 
        setPreviewPhoto(URL.createObjectURL(file));
    };

    const handleSave = async () => {
        const employeeData = {
            name: groupName,
            ownership: groupOwnership,
            contactNumber,
            description: groupDescription,
            groupId: selectedGroup ? selectedGroup.value : null
        };

        try {
            const response = await fetch(apiRoutes.addPersonnel(selectedGroup.value), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            if (!response.ok) {
                throw new Error('Failed to save employee');
            }

            const savedEmployee = await response.json();
            
            // Після успішного збереження групи, викликаємо fetchGroups для оновлення списку
            dispatch(fetchGroups());
            // Оновлюємо стан груп
            // Це краще реалізувати в Redux, але поки що залишимо так
            onClose();
        } catch (error) {
            console.error('Error saving employee:', error);
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
                    <StyledSubtitle>Виберіть групу</StyledSubtitle>
                    <SelectComponent 
                        options={groups} 
                        value={selectedGroup} 
                        onChange={(option) => setSelectedGroup(option)} 
                        placeholder="Оберіть групу"
                    />
                </StyledLabel>

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
