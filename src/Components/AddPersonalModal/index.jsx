import { useEffect, useState } from 'react';
import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import QuestionIco from '../../assets/ico/10965421.png';
import SelectComponent from '../Select'; // Імпортуємо компонент SelectComponent

export default function AddPersonalModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);

    // Стан для кожного поля
    const [groupName, setGroupName] = useState('');
    const [groupOwnership, setGroupOwnership] = useState('');
    const [contactNumber, setContactNumber] = useState(''); 
    const [groupDescription, setGroupDescription] = useState('');
    const [employeePhoto, setEmployeePhoto] = useState(null); // Стан для фото працівника
    const [previewPhoto, setPreviewPhoto] = useState(QuestionIco); // Стан для попереднього перегляду фото
    const [groups, setGroups] = useState([]); // Стан для груп
    const [selectedGroup, setSelectedGroup] = useState(null); // Стан для обраної групи

    // Отримання груп з бекенду
    useEffect(() => {
        const fetchGroups = async () => {
            try {
                const response = await fetch(apiRoutes.getGroups); // Маршрут для отримання груп
                const data = await response.json();
                const groupOptions = data.map(group => ({ value: group._id, label: group.name })); // Форматування даних для Select
                setGroups(groupOptions); // Зберігаємо групи в стані
            } catch (error) {
                console.error('Error fetching groups:', error);
            }
        };

        fetchGroups();
    }, []);

    const handlePhotoChange = (e) => {
        const file = e.target.files[0];
        setEmployeePhoto(file); // Зберігаємо вибране зображення
        setPreviewPhoto(URL.createObjectURL(file)); // Створюємо тимчасовий URL для попереднього перегляду
    };

    const handleSave = async () => {
        const employeeData = {
            name: groupName,
            ownership: groupOwnership,
            contactNumber,
            description: groupDescription,
            groupId: selectedGroup ? selectedGroup.value : null
        };

        console.log(employeeData)
    
        try {
            const response = await fetch(apiRoutes.addPersonnel(selectedGroup.value), {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(employeeData),
            });

            console.log(response)
    
            if (!response.ok) {
                throw new Error('Failed to save employee');
            }
    
            const savedEmployee = await response.json();

            console.log('Employee saved:', savedEmployee);
    
            // Оновлюємо стан груп
            setGroups((prevGroups) =>
                prevGroups.map((group) =>
                    group.value === selectedGroup.value
                        ? { ...group, personnel: [...group.personnel, savedEmployee] }
                        : group
                )
            );
    
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
                        options={groups} // Передаємо отримані групи як пропси
                        value={selectedGroup} // Вибрана група
                        onChange={(option) => setSelectedGroup(option)} // Обробка вибору
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

