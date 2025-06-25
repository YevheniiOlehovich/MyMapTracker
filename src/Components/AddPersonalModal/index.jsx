import { useState } from 'react';
import Styles from './styles';
import closeModal from '../../helpres/closeModal';
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';
import SelectComponent from '../Select';
import { useSelector } from 'react-redux';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { personalFunctions } from '../../helpres/index';

import { usePersonnelData, useUpdatePersonnel, useDeletePersonnel, useSavePersonnel } from '../../hooks/usePersonnelData';
import { useGroupsData } from '../../hooks/useGroupsData';

export default function AddPersonalModal({ onClose }) {
    const { editGroupId, editPersonId } = useSelector((state) => state.modals);
    const handleWrapperClick = closeModal(onClose);

    const savePersonnel = useSavePersonnel();
    const deletePersonnel = useDeletePersonnel();
    const updatePersonnel = useUpdatePersonnel();
    const { data: personnel = [] } = usePersonnelData();
    const { data: groups = [] } = useGroupsData();

    const editPerson = personnel.find(person => person._id === editPersonId);

    const [firstName, setFirstName] = useState(editPerson?.firstName || '');
    const [lastName, setLastName] = useState(editPerson?.lastName || '');
    const [contactNumber, setContactNumber] = useState(editPerson?.contactNumber || '');
    const [rfid, setRfid] = useState(editPerson?.rfid || '');
    const [note, setNote] = useState(editPerson?.note || '');
    const [personnelFunction, setPersonnelFunction] = useState(editPerson?.function || '');

    const [employeePhoto, setEmployeePhoto] = useState(editPerson?.photoPath
        ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/')
        : QuestionIco);

    const [selectedGroup, setSelectedGroup] = useState(editPerson ? editPerson.groupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editPerson.groupId)?.name : null);

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
            formData.append('rfid', rfid);
            formData.append('groupId', selectedGroup || editGroupId);
            formData.append('function', personnelFunction);

            if (employeePhoto instanceof Blob) {
            formData.append('photo', employeePhoto, 'employee.webp');
            } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
            const blob = await createBlobFromImagePath(employeePhoto);
            formData.append('photo', blob, 'employee.webp');
            }

            if (editPersonId) {
            // Оновлення
            await updatePersonnel.mutateAsync({ personnelId: editPersonId, personnelData: formData });
            } else {
            // Створення нового
            await savePersonnel.mutateAsync(formData);
            }

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
                    <Styles.StyledInput value={firstName} onChange={(e) => setFirstName(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Прізвище працівника</Styles.StyledSubtitle>
                    <Styles.StyledInput value={lastName} onChange={(e) => setLastName(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Rfid мітка</Styles.StyledSubtitle>
                    <Styles.StyledInput value={rfid} onChange={(e) => setRfid(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Посада працівника</Styles.StyledSubtitle>
                    <SelectComponent 
                        options={personalFunctions}
                        value={personnelFunction 
                            ? { value: personnelFunction, label: personalFunctions.find(f => f._id === personnelFunction)?.name } 
                            : null
                        }
                        onChange={option => setPersonnelFunction(option.value)}
                        placeholder="Оберіть посаду"
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Контактний номер</Styles.StyledSubtitle>
                    <Styles.StyledInput value={contactNumber} onChange={(e) => setContactNumber(e.target.value)} />
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
