import Styles from './styled';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import { useCropsData, useSaveCrop, useUpdateCrop } from '../../hooks/useCropsData';
import { useSelector } from 'react-redux';

export default function AddCropsModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    // Отримання всіх культур
    const { data: crops = [] } = useCropsData();

    // Хуки на збереження та оновлення культури
    const saveCrop = useSaveCrop();
    const updateCrop = useUpdateCrop();

    // ID культури для редагування з Redux
    const editCropId = useSelector(state => state.modals.editCropId);
    const editCrop = crops.find(crop => crop._id === editCropId);

    const [cropName, setCropName] = useState(editCrop ? editCrop.name : '');
    const [cropDescription, setCropDescription] = useState(editCrop ? editCrop.description : '');

    useEffect(() => {
        if (editCrop) {
            setCropName(editCrop.name);
            setCropDescription(editCrop.description);
        }
    }, [editCrop]);

    const handleSave = () => {
        const cropData = {
            name: cropName,
            description: cropDescription,
        };

        if (editCropId) {
            updateCrop.mutate(
                { cropId: editCropId, cropData },
                {
                    onSuccess: () => {
                        console.log(`Культура з ID ${editCropId} оновлена.`);
                        onClose();
                    },
                    onError: (error) => {
                        console.error('Помилка при оновленні культури:', error.message);
                    },
                }
            );
        } else {
            saveCrop.mutate(cropData, {
                onSuccess: () => {
                    console.log('Нова культура успішно створена.');
                    onClose();
                },
                onError: (error) => {
                    console.error('Помилка при створенні культури:', error.message);
                },
            });
        }
    };

    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />
                <Styles.Title>{editCropId ? 'Редагування культури' : 'Створення нової культури'}</Styles.Title>

                <Styles.Label>
                    <Styles.Subtitle>Назва культури</Styles.Subtitle>
                    <Styles.Input
                        value={cropName}
                        onChange={(e) => setCropName(e.target.value)}
                    />
                </Styles.Label>

                <Styles.Label>
                    <Styles.Subtitle>Опис культури</Styles.Subtitle>
                    <Styles.TextArea
                        maxLength={250}
                        value={cropDescription}
                        onChange={(e) => setCropDescription(e.target.value)}
                    />
                </Styles.Label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.Modal>
        </Styles.Wrapper>
    );
}
