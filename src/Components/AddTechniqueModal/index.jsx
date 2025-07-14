import { useState } from 'react';
import Styles from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import SelectComponent from '../Select';
import { useSelector } from 'react-redux';
import { createBlobFromImagePath, convertImageToWebP } from '../../helpres/imageUtils';
import { fieldOperations } from '../../helpres';
import QuestionIco from '../../assets/ico/10965421.webp';
import { useGroupsData } from '../../hooks/useGroupsData';
import { useSaveTechnique, useDeleteTechnique, useTechniquesData, useUpdateTechnique } from '../../hooks/useTechniquesData';


export default function AddTechniqueModal({ onClose }) {

    const { editGroupId, editTechniqueId } = useSelector((state) => state.modals);

    const handleWrapperClick = closeModal(onClose);

    const saveTechnique = useSaveTechnique();
    const deleteTechnique = useDeleteTechnique();
    const updateTechnique = useUpdateTechnique();

    const { data: groups = [] } = useGroupsData();
    const { data: techniques = [] } = useTechniquesData();

    const editTechnique = techniques.find(technique => technique._id === editTechniqueId);

    const [selectedGroup, setSelectedGroup] = useState(
        editTechnique?.groupId || editGroupId || null
    );
    const [selectedGroupName, setSelectedGroupName] = useState(
        editTechnique
            ? groups.find(group => group._id === editTechnique.groupId)?.name || ''
            : groups.find(group => group._id === editGroupId)?.name || ''
    );
    const [name, setName] = useState(editTechnique?.name || '');
    const [rfid, setRfid] = useState(editTechnique?.rfid || '');
    const [uniqNum, setUniqNum] = useState(editTechnique?.uniqNum || '');
    const [width, setWidth] = useState(editTechnique?.width || '');
    const [speed, setSpeed] = useState(editTechnique?.speed || '');
    const [note, setNote] = useState(editTechnique?.note || '');
    const [fieldOperation, setFieldOperation] = useState(editTechnique?.fieldOperation || '');
    const [techniquePhoto, setTechniquePhoto] = useState(
        editTechnique?.photoPath
            ? '/src/' + editTechnique.photoPath.substring(3).replace(/\\/g, '/')
            : QuestionIco
    );

    const handleGroupChange = (option) => {
        setSelectedGroup(option.value);
        setSelectedGroupName(option.label);
    };

    const handleFieldOperationChange = (option) => {
        setFieldOperation(option?.value || '');
    };

    const handlePhotoChange = async (e) => {
        const file = e.target.files[0];
        if (file) {
            const webpBlob = file.type === 'image/webp' ? file : await convertImageToWebP(file);
            setTechniquePhoto(webpBlob);
        }
    };

    const handleSave = async () => {
        try {
            const formData = new FormData();
            formData.append('groupId', selectedGroup || editGroupId);
            formData.append('name', name);
            formData.append('rfid', rfid);
            formData.append('uniqNum', uniqNum);
            formData.append('width', width);
            formData.append('speed', speed);
            formData.append('note', note);
            formData.append('fieldOperation', fieldOperation);

            if (techniquePhoto instanceof Blob) {
                formData.append('photo', techniquePhoto, 'technique.webp');
            } else if (typeof techniquePhoto === 'string' && techniquePhoto !== QuestionIco) {
                const blob = await createBlobFromImagePath(techniquePhoto);
                formData.append('photo', blob, 'technique.webp');
            }

            if (editTechniqueId) {
                await updateTechnique.mutateAsync({
                    id: editTechniqueId,
                    techniqueData: formData,
                });
            } else {
                await saveTechnique.mutateAsync(formData);
            }

            onClose();
        } catch (error) {
            console.error('❌ Помилка при збереженні техніки:', error);
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
                    <Styles.StyledSubtitle>Тип обладнання</Styles.StyledSubtitle>
                    <SelectComponent
                        options={fieldOperations}
                        value={fieldOperation ? { value: fieldOperation, label: fieldOperation } : null}
                        onChange={handleFieldOperationChange}
                        placeholder="Оберіть операцію"
                    />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Найменування</Styles.StyledSubtitle>
                    <Styles.StyledInput value={name} onChange={(e) => setName(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Номер RFID мітки</Styles.StyledSubtitle>
                    <Styles.StyledInput value={rfid} onChange={(e) => setRfid(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Унікальний номер</Styles.StyledSubtitle>
                    <Styles.StyledInput value={uniqNum} onChange={(e) => setUniqNum(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Ширина, м</Styles.StyledSubtitle>
                    <Styles.StyledInput value={width} onChange={(e) => setWidth(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledSubtitle>Макс. швидкість, км/год</Styles.StyledSubtitle>
                    <Styles.StyledInput value={speed} onChange={(e) => setSpeed(e.target.value)} />
                </Styles.StyledLabel>

                <Styles.StyledLabel>
                    <Styles.StyledTextArea maxLength={250} value={note} onChange={(e) => setNote(e.target.value)} />
                </Styles.StyledLabel>

                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.StyledModal>
        </Styles.StyledWrapper>
    );
}