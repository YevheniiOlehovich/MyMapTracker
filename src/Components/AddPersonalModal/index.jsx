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
    const groups = useSelector(selectAllGroups);  // Всі групи

    const editPerson = groups.flatMap(group => group.personnel).find(person => person._id === editPersonId); // Текучий працівник для редагування

    const handleWrapperClick = closeModal(onClose);

    // Стейти для нових/редагованих даних
    const [firstName, setFirstName] = useState(editPerson ? editPerson.firstName : '');
    const [lastName, setLastName] = useState(editPerson ? editPerson.lastName : '');
    const [contactNumber, setContactNumber] = useState(editPerson ? editPerson.contactNumber : ''); 
    const [note, setNote] = useState(editPerson ? editPerson.note : '');
    const [employeePhoto, setEmployeePhoto] = useState(QuestionIco);

    console.log(employeePhoto)

    // Форматуємо шлях до фото, заміняючи перші два зворотних слеші на '/src/' і всі зворотні слеші на прямі
    // const formattedPhotoPath = editPerson && editPerson.photoPath
    //     ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/')
    //     : null;

    // const [previewPhoto, setPreviewPhoto] = useState(formattedPhotoPath || QuestionIco);

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
    
        if (file) {
            if (file.type === 'image/webp') {
                // Якщо файл вже WebP, зберігаємо його без змін
                setEmployeePhoto(file);
            } else {
                // Якщо файл не WebP, конвертуємо його в WebP
                const webpBlob = await convertImageToWebP(file);
                setEmployeePhoto(webpBlob); // Зберігаємо Blob або URL
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

         // Додаємо зображення, якщо воно є (Blob або URL)
        if (employeePhoto instanceof Blob) {
            console.log("Додаємо зображення на сервер:");
            console.log(`- Тип: ${employeePhoto.type}`);
            console.log(`- Розмір: ${employeePhoto.size} байт`);
            formData.append('photo', employeePhoto, 'employee.webp');
        }

        for (let [key, value] of formData.entries()) {
            if (value instanceof Blob) {
                console.log(`${key}: [Blob] - ${value.type}, ${value.size} bytes`);
            } else {
                console.log(`${key}: ${value}`);
            }
        }
    
        // Якщо нове фото, додаємо його
        // if (employeePhoto) {
        //     console.log("Зображення для завантаження:");
        //     console.log(`- Тип: ${employeePhoto.type}`);
        //     console.log(`- Розмір: ${employeePhoto.size} байт`);
    
        //     // Якщо зображення конвертоване в WebP, відправляємо його
        //     formData.append('photo', employeePhoto, 'employee.webp');
        // } else if (previewPhoto !== QuestionIco) {
        //     // Якщо фото не змінювалось, але не є стандартним, передаємо фото як є
        //     const photoBlob = new Blob([previewPhoto], { type: 'image/webp' });
        //     formData.append('photo', photoBlob, 'employee.webp');
        // } else if (editPerson && editPerson.photoPath) {
        //     // Якщо редагуємо і є фото, додаємо його без змін
        //     const photoPath = editPerson.photoPath;
            
        //     if (photoPath) {
        //         console.log("Існуюче фото для редагування:");
        //         console.log(`- Шлях: ${photoPath}`);
    
        //         // Якщо фото вже в форматі WebP, просто передаємо його в тому вигляді
        //         if (photoPath.endsWith('.webp')) {
        //             console.log(1);
        //             const photoBlob = new Blob([photoPath], { type: 'image/webp' });
        //             formData.append('photo', photoBlob, 'employee.webp');
        //         } else {
        //             console.log(2);
        //             // Якщо фото в іншому форматі, конвертуємо його в WebP (якщо необхідно)
        //             const webpBlob = await convertImageToWebP(photoPath); // Логіка для перекодування
        //             formData.append('photo', webpBlob, 'employee.webp');
        //         }
        //     } else {
        //         console.log("Немає фото для редагування.");
        //     }
        // }
    
        // Логування форми перед відправкою
        // for (let [key, value] of formData.entries()) {
        //     if (value instanceof Blob) {
        //         console.log(`${key}: [Blob] - ${value.type}, ${value.size} bytes`);
        //     } else {
        //         console.log(`${key}: ${value}`);
        //     }
        // }
    
        try {
            const url = apiRoutes.addPersonnel(selectedGroup);
            const response = await fetch(url, { method: 'POST', body: formData });
    
            if (!response.ok) {
                throw new Error('Failed to save employee');
            }
    
            const savedEmployee = await response.json();
    
            // Якщо це редагування, видаляємо старий запис
            if (editPersonId) {
                const deleteUrl = apiRoutes.deletePersonnel(editGroupId, editPersonId);
                const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });
    
                if (!deleteResponse.ok) {
                    throw new Error('Failed to delete old employee');
                }
            }
    
            dispatch(fetchGroups()); // Оновлення груп після операції
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
                        {/* <PhotoPic src={employeePhoto}></PhotoPic> */}
                        <PhotoPic src={employeePhoto instanceof Blob ? URL.createObjectURL(employeePhoto) : employeePhoto} />

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


