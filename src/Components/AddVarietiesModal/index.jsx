import Styles from './styled';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import { useVarietiesData, useSaveVariety, useUpdateVariety } from '../../hooks/useVarietiesData'; // ⚠️ Перевір правильність шляху

export default function AddVarietyModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    // Отримання всіх сортів
    const { data: varieties = [] } = useVarietiesData();

    // Хуки на збереження та оновлення сорту
    const saveVariety = useSaveVariety();
    const updateVariety = useUpdateVariety();

    // ID сорту для редагування з Redux
    const editVarietyId = useSelector(state => state.modals.editVarietyId);
    const editVariety = varieties.find(variety => variety._id === editVarietyId);

    const [varietyName, setVarietyName] = useState(editVariety ? editVariety.name : '');
    const [varietyDescription, setVarietyDescription] = useState(editVariety ? editVariety.description : '');

    useEffect(() => {
        if (editVariety) {
            setVarietyName(editVariety.name);
            setVarietyDescription(editVariety.description);
        }
    }, [editVariety]);

    const handleSave = () => {
        const varietyData = {
            name: varietyName,
            description: varietyDescription,
        };

        if (editVarietyId) {
            updateVariety.mutate(
                { varietyId: editVarietyId, varietyData },
                {
                    onSuccess: () => {
                        console.log(`Сорт з ID ${editVarietyId} оновлено.`);
                        onClose();
                    },
                    onError: (error) => {
                        console.error('Помилка при оновленні сорту:', error.message);
                    },
                }
            );
        } else {
            saveVariety.mutate(varietyData, {
                onSuccess: () => {
                    console.log('Новий сорт успішно створено.');
                    onClose();
                },
                onError: (error) => {
                    console.error('Помилка при створенні сорту:', error.message);
                },
            });
        }
    };

    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />
                <Styles.Title>{editVarietyId ? 'Редагування сорту' : 'Створення нового сорту'}</Styles.Title>

                <Styles.Label>
                    <Styles.Subtitle>Назва сорту</Styles.Subtitle>
                    <Styles.Input
                        value={varietyName}
                        onChange={(e) => setVarietyName(e.target.value)}
                    />
                </Styles.Label>

                <Styles.Label>
                    <Styles.Subtitle>Опис сорту</Styles.Subtitle>
                    <Styles.TextArea
                        maxLength={250}
                        value={varietyDescription}
                        onChange={(e) => setVarietyDescription(e.target.value)}
                    />
                </Styles.Label>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.Modal>
        </Styles.Wrapper>
    );
}
