import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea, StyledPhotoBlock, PhotoBlock, BlockColumn, PhotoPic, StyledButtonLabel, StyledInputFile, StyledText } from './styles';
import closeModal from "../../helpres/closeModal";
import { useEffect, useState } from 'react';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
import { useDispatch, useSelector } from 'react-redux';
import SelectComponent from '../Select';
import Button from '../Button';
import QuestionIco from '../../assets/ico/10965421.webp';

export default function AddVehicleModal({onClose}){
    const handleWrapperClick = closeModal(onClose);
    const groups = useSelector(selectAllGroups);
    const dispatch = useDispatch();

    // const [selectedGroup, setSelectedGroup] = useState(editPerson ? editGroupId : null);
    // const [selectedGroupName, setSelectedGroupName] = useState(editPerson ? groups.find(group => group._id === editGroupId)?.name : null);
    // const [employeePhoto, setEmployeePhoto] = useState(editPerson && editPerson.photoPath 
    //     ? '/src/' + editPerson.photoPath.substring(3).replace(/\\/g, '/') 
    //     : QuestionIco);
    const [selectedGroup, setSelectedGroup] = useState(null);
    const [selectedGroupName, setSelectedGroupName] = useState(null);
    const [regNumber, setRegNumber] = useState(null)
    const [info, setInfo] = useState(null)
    const [note, setNote] = useState(null)
    const [employeePhoto, setEmployeePhoto] = useState(QuestionIco)

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value); 
        setSelectedGroupName(option.label);
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
                    }, 'image/webp', 0.8); 
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
        onClose();
        // const formData = new FormData();
        // formData.append('firstName', firstName);
        // formData.append('lastName', lastName);
        // formData.append('contactNumber', contactNumber);
        // formData.append('note', note);
        // formData.append('groupId', selectedGroup || editGroupId);

        // if (employeePhoto instanceof Blob) {
        //     formData.append('photo', employeePhoto, 'employee.webp');
        // } else if (typeof employeePhoto === 'string' && employeePhoto !== QuestionIco) {
        //     const blob = await createBlobFromImagePath(employeePhoto); 
        //     formData.append('photo', blob, 'employee.webp');
        // }

        // try {
        //     const url = apiRoutes.addPersonnel(selectedGroup);
        //     const response = await fetch(url, { method: 'POST', body: formData });

        //     if (!response.ok) {
        //         throw new Error('Failed to save employee');
        //     }

        //     const savedEmployee = await response.json();

        //     if (editPersonId) {
        //         const deleteUrl = apiRoutes.deletePersonnel(editGroupId, editPersonId);
        //         const deleteResponse = await fetch(deleteUrl, { method: 'DELETE' });

        //         if (!deleteResponse.ok) {
        //             throw new Error('Failed to delete old employee');
        //         }
        //     }

        //     dispatch(fetchGroups());
        //     onClose();
        // } catch (error) {
        //     console.error('Error saving employee:', error);
        // }
    };

    return(
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                {/* <StyledTitle>{editPersonId ? 'Редагування працівника' : 'Додавання нового працівника'}</StyledTitle> */}
                <StyledTitle>Додавання нової техніки</StyledTitle>
                <StyledCloseButton onClick={onClose} />

                <StyledPhotoBlock>
                    <BlockColumn>
                        <StyledSubtitle>Фото техніки</StyledSubtitle>
                        <StyledButtonLabel>
                            {/* <StyledText>{editPersonId ? 'Змінити фото' : 'Додати фото'}</StyledText> */}
                            <StyledText>Додати фото</StyledText>
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
                        // value={selectedGroup ? { value: selectedGroup, label: selectedGroupName } : null} 
                        value={{ value: selectedGroup, label: selectedGroupName }}
                        onChange={handleGroupChange} 
                        placeholder="Оберіть групу"
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Інфо</StyledSubtitle>
                    <StyledInput 
                        value={info}
                        onChange={(e) => setInfo(e.target.value)}
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledSubtitle>Номер реєстрації</StyledSubtitle>
                    <StyledInput 
                        value={regNumber}
                        onChange={(e) => setRegNumber(e.target.value)}
                    />
                </StyledLabel>

                <StyledLabel>
                    <StyledTextArea
                        maxLength={250}
                        value={note} 
                        onChange={(e) => setNote(e.target.value)}
                    />
                </StyledLabel>

                <div style={{ display: 'flex', justifyContent: 'flex-end'}}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </StyledModal>
        </StyledWrapper>
    )
}