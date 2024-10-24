import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState } from 'react';
import apiRoutes from '../../helpres/ApiRoutes';
import { useDispatch } from 'react-redux';
import { fetchGroups } from '../../store/groupSlice';

export default function AddGroupModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);

    const dispatch = useDispatch(); // Створюємо dispatch

    // Стан для кожного поля
    const [groupName, setGroupName] = useState('');
    const [groupOwnership, setGroupOwnership] = useState('');
    const [groupDescription, setGroupDescription] = useState('');

    const handleSave = async () => {
        // Створення об'єкта з даними
        const groupData = {
            name: groupName,
            ownership: groupOwnership,
            description: groupDescription,
        };

        try {
            // Відправка POST-запиту на сервер
            const response = await fetch(apiRoutes.addGroup, { // Використання імпортованого маршруту
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(groupData),
            });

            if (!response.ok) {
                throw new Error('Failed to save group');
            }

            const savedGroup = await response.json();
            console.log('Group saved:', savedGroup); // Логування збереженої групи
            
            // Після успішного збереження групи, викликаємо fetchGroups для оновлення списку
            dispatch(fetchGroups());
            
            onClose(); // Закриття модального вікна
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} /> 
                <StyledTitle>Створення нової групи</StyledTitle>
                <StyledLabel>
                    <StyledSubtitle>Назва нової групи</StyledSubtitle>
                    <StyledInput 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)} // Збереження назви групи
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Приналежність групи</StyledSubtitle>
                    <StyledInput 
                        value={groupOwnership} 
                        onChange={(e) => setGroupOwnership(e.target.value)} // Збереження приналежності
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledTextArea
                        maxLength={250}
                        value={groupDescription} // Виправлено на правильний стан
                        onChange={(e) => setGroupDescription(e.target.value)} // Збереження опису
                    />
                </StyledLabel>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave}/>
                </div>
            </StyledModal>
        </StyledWrapper>
    );
}
