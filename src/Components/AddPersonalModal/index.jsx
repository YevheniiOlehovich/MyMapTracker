import { useState } from 'react';
import Styles from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';
import SelectComponent from '../Select';
import { useGroupsData, useDeletePersonnel, useSavePersonnel } from '../../hooks/useGroupsData'; // Хуки для роботи з групами та персоналом
import { useSelector } from 'react-redux';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';

export default function AddPersonalModal({ onClose }) {
    const { editGroupId, editPersonId } = useSelector((state) => state.modals);

    const handleWrapperClick = closeModal(onClose);

    const savePersonnel = useSavePersonnel(); // Хук для збереження персоналу

    // Отримуємо дані груп через React Query
    const { data: groups = [] } = useGroupsData();

    // Хуки для оновлення та видалення персоналу
    const deletePersonnel = useDeletePersonnel();

    const editPerson = groups
        .flatMap(group => group.personnel)
        .find(person => person._id === editPersonId);

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
        try {
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
    
            if (editPersonId) {
                // Видалення старого працівника через хук
                await deletePersonnel.mutateAsync({ groupId: editGroupId, personnelId: editPersonId });
                console.log(`Старий працівник з ID ${editPersonId} успішно видалений.`);
            }
    
            // Збереження нового працівника через хук
            savePersonnel.mutate({
                groupId: selectedGroup,
                personnelData: formData,
            });
    
            onClose();
        } catch (error) {
            console.error('Помилка при збереженні працівника:', error);
        }
    };

    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal>
                <Styles.StyledCloseButton onClick={onClose} />
                <Styles.StyledTitle>{editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}</Styles.StyledTitle>
                
                <Styles.StyledPhotoBlock>
                    <Styles.BlockColumn>
                        <Styles.StyledSubtitle>Фото працівника</Styles.StyledSubtitle>
                        <Styles.StyledButtonLabel>
                            <Styles.StyledText>{editPersonId ? 'Змінити фото' : 'Додати фото'}</Styles.StyledText>
                            <Styles.StyledInputFile 
                                type='file' 
                                accept="image/*" 
                                onChange={handlePhotoChange} 
                            />
                        </Styles.StyledButtonLabel>
                    </Styles.BlockColumn>
                    
                    <Styles.PhotoBlock>
                        <Styles.PhotoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />
                    </Styles.PhotoBlock>
                </Styles.StyledPhotoBlock>
                
                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Виберіть групу</Styles.StyledSubtitle>
                    <SelectComponent 
                        options={groups} 
                        value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} 
                        onChange={handleGroupChange} 
                        placeholder="Оберіть групу"
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Ім'я працівника</Styles.StyledSubtitle>
                    <Styles.StyledInput 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                </Styles.StyledLabel>
                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Прізвище працівника</Styles.StyledSubtitle>
                    <Styles.StyledInput 
                        value={lastName} 
                        onChange={(e) => setLastName(e.target.value)}
                    />
                </Styles.StyledLabel>
                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Контактний номер</Styles.StyledSubtitle>
                    <Styles.StyledInput 
                        value={contactNumber} 
                        onChange={(e) => setContactNumber(e.target.value)}
                    />
                </Styles.StyledLabel>
                <Styles.StyledLabel>
                    <Styles.StyledTextArea
                        maxLength={250}
                        value={note} 
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Styles.StyledLabel>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}