// import { useState } from 'react';
// import Styles from './styles';
// import closeModal from "../../helpres/closeModal";
// import Button from '../Button';
// import QuestionIco from '../../assets/ico/10965421.webp';
// import SelectComponent from '../Select';
// import { useGroupsData, useSaveTechnique, useDeleteTechnique } from '../../hooks/useGroupsData'; // Хуки для роботи з групами та персоналом
// import { useSelector } from 'react-redux';
// import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';

// export default function AddTechniqueModal({ onClose }) {
//     const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);

//     const handleWrapperClick = closeModal(onClose);

//     // Хук для збереження персоналу
//     const saveTechnique = useSaveTechnique(); 
    
//     //Отримуємо дані груп через React Query
//     const { data: groups = [] } = useGroupsData();

//     // Хуки для оновлення та видалення персоналу
//     const deleteTechnique = useDeleteTechnique();

//     const editPerson = groups
//         .flatMap(group => group.personnel)
//         .find(person => person._id === editPersonId);

//     const [firstName, setFirstName] = useState(editPerson ? editPerson.firstName : '');
//     const [lastName, setLastName] = useState(editPerson ? editPerson.lastName : '');
//     const [contactNumber, setContactNumber] = useState(editPerson ? editPerson.contactNumber : '');
//     const [note, setNote] = useState(editPerson ? editPerson.note : '');
//     const [employeePhoto, setEmployeePhoto] = useState(editPerson && editPerson.photoPath
//         ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/')
//         : QuestionIco);
//     const [selectedGroup, setSelectedGroup] = useState(editPerson ? editGroupId : null);
//     const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editGroupId)?.name : null);

//     const handleGroupChange = (option) => {
//         setSelectedGroup(option.value);
//         setSelectedGroupName(option.label);
//     };

//     const handlePhotoChange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             if (file.type === 'image/webp') {
//                 setEmployeePhoto(file);
//             } else {
//                 const webpBlob = await convertImageToWebP(file);
//                 setEmployeePhoto(webpBlob);
//             }
//         }
//     };

//     const handleSave = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('firstName', firstName);
//             formData.append('lastName', lastName);
//             formData.append('contactNumber', contactNumber);
//             formData.append('note', note);
//             formData.append('groupId', selectedGroup || editGroupId);
    
//             if (employeePhoto instanceof Blob) {
//                 formData.append('photo', employeePhoto, 'employee.webp');
//             } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
//                 const blob = await createBlobFromImagePath(employeePhoto);
//                 formData.append('photo', blob, 'employee.webp');
//             }
    
//             if (editPersonId) {
//                 // Видалення старого працівника через хук
//                 await deletePersonnel.mutateAsync({ groupId: editGroupId, personnelId: editPersonId });
//                 console.log(`Старий працівник з ID ${editPersonId} успішно видалений.`);
//             }
    
//             // Збереження нового працівника через хук
//             savePersonnel.mutate({
//                 groupId: selectedGroup,
//                 personnelData: formData,
//             });
    
//             onClose();
//         } catch (error) {
//             console.error('Помилка при збереженні працівника:', error);
//         }
//     };

//     return (
//         <Styles.StyledWrapper onClick={handleWrapperClick}>
//             <Styles.StyledModal>
//                 <Styles.StyledCloseButton onClick={onClose} />
                
//                 <Styles.StyledTitle>{editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}</Styles.StyledTitle>
                
//                 <Styles.StyledPhotoBlock>
//                     <Styles.BlockColumn>
//                         <Styles.StyledSubtitle>Фото працівника</Styles.StyledSubtitle>
//                         <Styles.StyledButtonLabel>
//                             <Styles.StyledText>{editPersonId ? 'Змінити фото' : 'Додати фото'}</Styles.StyledText>
//                             <Styles.StyledInputFile 
//                                 type='file' 
//                                 accept="image/*" 
//                                 onChange={handlePhotoChange} 
//                             />
//                         </Styles.StyledButtonLabel>
//                     </Styles.BlockColumn>
                    
//                     <Styles.PhotoBlock>
//                         <Styles.PhotoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />
//                     </Styles.PhotoBlock>
//                 </Styles.StyledPhotoBlock>
                
//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Виберіть групу</Styles.StyledSubtitle>
//                     <SelectComponent 
//                         options={groups} 
//                         value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} 
//                         onChange={handleGroupChange} 
//                         placeholder="Оберіть групу"
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Ім'я працівника</Styles.StyledSubtitle>
//                     <Styles.StyledInput 
//                         value={firstName}
//                         onChange={(e) => setFirstName(e.target.value)}
//                     />
//                 </Styles.StyledLabel>
//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Прізвище працівника</Styles.StyledSubtitle>
//                     <Styles.StyledInput 
//                         value={lastName} 
//                         onChange={(e) => setLastName(e.target.value)}
//                     />
//                 </Styles.StyledLabel>
//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Контактний номер</Styles.StyledSubtitle>
//                     <Styles.StyledInput 
//                         value={contactNumber} 
//                         onChange={(e) => setContactNumber(e.target.value)}
//                     />
//                 </Styles.StyledLabel>
//                 <Styles.StyledLabel>
//                     <Styles.StyledTextArea
//                         maxLength={250}
//                         value={note} 
//                         onChange={(e) => setNote(e.target.value)}
//                     />
//                 </Styles.StyledLabel>
                
//                 <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
//                     <Button text={'Зберегти'} onClick={handleSave} />
//                 </div>
//             </Styles.StyledModal>
//         </Styles.StyledWrapper>
//     );
// }







































// import { useState } from 'react';
// import Styles from './styles';
// import closeModal from "../../helpres/closeModal";
// import Button from '../Button';
// import SelectComponent from '../Select';
// import { useGroupsData, useSaveTechnique } from '../../hooks/useGroupsData';
// import { useSelector } from 'react-redux';
// import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
// import { fieldOperations } from '../../helpres';

// export default function AddTechniqueModal({ onClose }) {
//     const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);

//     const handleWrapperClick = closeModal(onClose);

//     // Хук для збереження техніки
//     const saveTechnique = useSaveTechnique();

//     // Отримуємо дані груп через React Query
//     const { data: groups = [] } = useGroupsData();

//     // Стани для форми
//     const [selectedGroup, setSelectedGroup] = useState(editGroupId || null);
//     const [selectedGroupName, setSelectedGroupName] = useState(
//         editGroupId ? groups.find(group => group._id === editGroupId)?.name : null
//     );
//     const [name, setName] = useState('');
//     const [rfid, setRfid] = useState('');
//     const [uniqNum, setUniqNum] = useState('');
//     const [width, setWidth] = useState('');
//     const [speed, setSpeed] = useState('');
//     const [note, setNote] = useState('');
//     const [techniquePhoto, setTechniquePhoto] = useState(null); // Стан для зображення
//     const [fieldOperation, setFieldOperation] = useState(''); // Стан для операцій з полями

//     const handleGroupChange = (option) => {
//         setSelectedGroup(option.value);
//         setSelectedGroupName(option.label);
//     };

//     const handleFieldOperationChange = (option) => {
//         console.log(option)
//         setFieldOperation(option?.value || ''); // Зберігаємо тільки value
//     };

//     const handlePhotoChange = async (e) => {
//         const file = e.target.files[0];
//         if (file) {
//             const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
//             setTechniquePhoto(webpBlob);
//         }
//     };

//     const handleSave = async () => {
//         try {
//             const formData = new FormData();
//             formData.append('groupId', selectedGroup);
//             formData.append('name', name);
//             formData.append('rfid', rfid);
//             formData.append('uniqNum', uniqNum);
//             formData.append('width', width);
//             formData.append('speed', speed);
//             formData.append('note', note);
//             formData.append('fieldOperation', fieldOperation);

//             if (techniquePhoto instanceof Blob) {
//                 formData.append('photo', techniquePhoto, 'technique.webp');
//             }

//             saveTechnique.mutate({ groupId: selectedGroup, techniqueData: formData }, {
//                 onSuccess: () => {
//                     console.log('Техніка успішно додана.');
//                     onClose();
//                 },
//                 onError: (error) => {
//                     console.error('Помилка при додаванні техніки:', error.message);
//                 },
//             });
//         } catch (error) {
//             console.error('Помилка при збереженні техніки:', error);
//         }
//     };

//     return (
//         <Styles.StyledWrapper onClick={handleWrapperClick}>
//             <Styles.StyledModal>
//                 <Styles.StyledCloseButton onClick={onClose} />
//                 <Styles.StyledTitle>Додавання нової техніки</Styles.StyledTitle>

//                 <Styles.StyledPhotoBlock>
//                     <Styles.BlockColumn>
//                         <Styles.StyledSubtitle>Фото техніки</Styles.StyledSubtitle>
//                         <Styles.StyledButtonLabel>
//                             <Styles.StyledText>{techniquePhoto ? 'Змінити фото' : 'Додати фото'}</Styles.StyledText>
//                             <Styles.StyledInputFile
//                                 type="file"
//                                 accept="image/*"
//                                 onChange={handlePhotoChange}
//                             />
//                         </Styles.StyledButtonLabel>
//                     </Styles.BlockColumn>

//                     <Styles.PhotoBlock>
//                         {techniquePhoto && (
//                             <Styles.PhotoPic
//                                 src={techniquePhoto instanceof Blob ? URL.createObjectURL(techniquePhoto) : techniquePhoto}
//                             />
//                         )}
//                     </Styles.PhotoBlock>
//                 </Styles.StyledPhotoBlock>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Виберіть групу</Styles.StyledSubtitle>
//                     <SelectComponent
//                         options={groups}
//                         value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null}
//                         onChange={handleGroupChange}
//                         placeholder="Оберіть групу"
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Операція з полями</Styles.StyledSubtitle>
//                     <SelectComponent
//                         options={fieldOperations}
//                         value={
//                             fieldOperation 
//                                 ? {
//                                     value: fieldOperation,
//                                     label: fieldOperations.find(op => op._id === fieldOperation)?.name
//                                 }
//                                 : null
//                         }
//                         onChange={handleFieldOperationChange}
//                         placeholder="Оберіть операцію"
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Найменування</Styles.StyledSubtitle>
//                     <Styles.StyledInput
//                         value={name}
//                         onChange={(e) => setName(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Номер RFID мітки</Styles.StyledSubtitle>
//                     <Styles.StyledInput
//                         value={rfid}
//                         onChange={(e) => setRfid(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Унікальний номер</Styles.StyledSubtitle>
//                     <Styles.StyledInput
//                         value={uniqNum}
//                         onChange={(e) => setUniqNum(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Ширина, м</Styles.StyledSubtitle>
//                     <Styles.StyledInput
//                         value={width}
//                         onChange={(e) => setWidth(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledSubtitle>Макс. швидкість, км/год</Styles.StyledSubtitle>
//                     <Styles.StyledInput
//                         value={speed}
//                         onChange={(e) => setSpeed(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <Styles.StyledLabel>
//                     <Styles.StyledTextArea
//                         maxLength={250}
//                         value={note}
//                         onChange={(e) => setNote(e.target.value)}
//                     />
//                 </Styles.StyledLabel>

//                 <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
//                     <Button text={'Зберегти'} onClick={handleSave} />
//                 </div>
//             </Styles.StyledModal>
//         </Styles.StyledWrapper>
//     );
// }







import { useState } from 'react';
import Styles from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import SelectComponent from '../Select';
import { useGroupsData, useSaveTechnique, useDeleteTechnique } from '../../hooks/useGroupsData';
import { useSelector } from 'react-redux';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { fieldOperations } from '../../helpres';

export default function AddTechniqueModal({ onClose }) {
    const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);

    const handleWrapperClick = closeModal(onClose);

    // Хуки для збереження та оновлення техніки
    const saveTechnique = useSaveTechnique();
    const deleteTechnique = useDeleteTechnique();

    // Отримуємо дані груп через React Query
    const { data: groups = [] } = useGroupsData();

    // Знаходимо техніку для редагування
    const editTechnique = groups
        .flatMap(group => group.techniques || [])
        .find(technique => technique._id === editTechniqueId);

    // Стани для форми
    const [selectedGroup, setSelectedGroup] = useState(editTechnique ? editGroupId : null);
    const [selectedGroupName, setSelectedGroupName] = useState(
        editTechnique ? groups.find(group => group._id === editGroupId)?.name : null
    );
    const [name, setName] = useState(editTechnique ? editTechnique.name : '');
    const [rfid, setRfid] = useState(editTechnique ? editTechnique.rfid : '');
    const [uniqNum, setUniqNum] = useState(editTechnique ? editTechnique.uniqNum : '');
    const [width, setWidth] = useState(editTechnique ? editTechnique.width : '');
    const [speed, setSpeed] = useState(editTechnique ? editTechnique.speed : '');
    const [note, setNote] = useState(editTechnique ? editTechnique.note : '');
    const [techniquePhoto, setTechniquePhoto] = useState(
        editTechnique && editTechnique.photoPath
            ? '/src/' + editTechnique.photoPath.substring(3).replace(/\\/g, '/')
            : null
    );
    const [fieldOperation, setFieldOperation] = useState(editTechnique ? editTechnique.fieldOperation : '');

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value);
        setSelectedGroupName(option.label);
    };

    const handleFieldOperationChange = (option) => {
        setFieldOperation(option?.value || ''); // Зберігаємо тільки value
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
            setTechniquePhoto(webpBlob);
        }
    };

    // const handleSave = async () => {
    //     try {
    //         const formData = new FormData();
    //         formData.append('groupId', selectedGroup);
    //         formData.append('name', name);
    //         formData.append('rfid', rfid);
    //         formData.append('uniqNum', uniqNum);
    //         formData.append('width', width);
    //         formData.append('speed', speed);
    //         formData.append('note', note);
    //         formData.append('fieldOperation', fieldOperation);

            

    //         if (techniquePhoto instanceof Blob) {
    //             formData.append('photo', techniquePhoto, 'technique.webp');
    //         } else if (typeof techniquePhoto === 'string') {
    //             const blob = await createBlobFromImagePath(techniquePhoto);
    //             formData.append('photo', blob, 'technique.webp');
    //         }

    //         if (editTechniqueId) {
    //             // Оновлення техніки
    //             updateTechnique.mutate({
    //                 groupId: selectedGroup,
    //                 techniqueId: editTechniqueId,
    //                 techniqueData: formData,
    //             });
    //             console.log(`Техніка з ID ${editTechniqueId} успішно оновлена.`);
    //         } else {
    //             // Додавання нової техніки
    //             saveTechnique.mutate({
    //                 groupId: selectedGroup,
    //                 techniqueData: formData,
    //             });
    //             console.log('Нова техніка успішно додана.');
    //         }

    //         onClose();
    //     } catch (error) {
    //         console.error('Помилка при збереженні техніки:', error);
    //     }
    // };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('groupId', selectedGroup);
            formData.append('name', name);
            formData.append('rfid', rfid);
            formData.append('uniqNum', uniqNum);
            formData.append('width', width);
            formData.append('speed', speed);
            formData.append('note', note);
            formData.append('fieldOperation', fieldOperation);
    
            if (techniquePhoto instanceof Blob) {
                formData.append('photo', techniquePhoto, 'technique.webp');
            } else if (typeof techniquePhoto === 'string') {
                const blob = await createBlobFromImagePath(techniquePhoto);
                formData.append('photo', blob, 'technique.webp');
            }
    
            if (editTechniqueId) {
                // Видалення старої техніки через хук
                await deleteTechnique.mutateAsync({ groupId: editGroupId, techniqueId: editTechniqueId });
                console.log(`Стара техніка з ID ${editTechniqueId} успішно видалена.`);
            }
    
            // Збереження нової техніки через хук
            saveTechnique.mutate({
                groupId: selectedGroup,
                techniqueData: formData,
            });
    
            onClose();
        } catch (error) {
            console.error('Помилка при збереженні техніки:', error);
        }
    };

    return (
        <Styles.StyledWrapper onClick={handleWrapperClick}>
            <Styles.StyledModal>
                <Styles.StyledCloseButton onClick={onClose} />
                <Styles.StyledTitle>{editTechniqueId ? 'Редагування техніки' : 'Додавання нової техніки'}</Styles.StyledTitle>

                <Styles.StyledPhotoBlock>
                    <Styles.BlockColumn>
                        <Styles.StyledSubtitle>Фото техніки</Styles.StyledSubtitle>
                        <Styles.StyledButtonLabel>
                            <Styles.StyledText>{techniquePhoto ? 'Змінити фото' : 'Додати фото'}</Styles.StyledText>
                            <Styles.StyledInputFile
                                type="file"
                                accept="image/*"
                                onChange={handlePhotoChange}
                            />
                        </Styles.StyledButtonLabel>
                    </Styles.BlockColumn>

                    <Styles.PhotoBlock>
                        {techniquePhoto && (
                            <Styles.PhotoPic
                                src={techniquePhoto instanceof Blob ? URL.createObjectURL(techniquePhoto) : techniquePhoto}
                            />
                        )}
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
                    <Styles.StyledSubtitle>Операція з полями</Styles.StyledSubtitle>
                    <SelectComponent
                        options={fieldOperations}
                        value={fieldOperation ? { value: fieldOperation, label: fieldOperation } : null}
                        onChange={handleFieldOperationChange}
                        placeholder="Оберіть операцію"
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Найменування</Styles.StyledSubtitle>
                    <Styles.StyledInput
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Номер RFID мітки</Styles.StyledSubtitle>
                    <Styles.StyledInput
                        value={rfid}
                        onChange={(e) => setRfid(e.target.value)}
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Унікальний номер</Styles.StyledSubtitle>
                    <Styles.StyledInput
                        value={uniqNum}
                        onChange={(e) => setUniqNum(e.target.value)}
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Ширина, м</Styles.StyledSubtitle>
                    <Styles.StyledInput
                        value={width}
                        onChange={(e) => setWidth(e.target.value)}
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Макс. швидкість, км/год</Styles.StyledSubtitle>
                    <Styles.StyledInput
                        value={speed}
                        onChange={(e) => setSpeed(e.target.value)}
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledTextArea
                        maxLength={250}
                        value={note}
                        onChange={(e) => setNote(e.target.value)}
                    />
                </Styles.StyledLabel>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}