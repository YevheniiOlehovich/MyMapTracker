import Styles from './styled'
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import { useOperationsData, useUpdateOperation, useSaveOperation } from '../../hooks/useOperationsData';
import { useSelector } from 'react-redux';

export default function AddOperationModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    // Отримуємо дані операцій через React Query
    const { data: operations = [] } = useOperationsData();

    // Хуки для оновлення та додавання операції
    const updateOperation = useUpdateOperation();
    const saveOperation = useSaveOperation();

    // Отримуємо ID операції для редагування з Redux
    const editOperationId = useSelector(state => state.modals.editOperationId);
    const editOperation = operations.find(op => op._id === editOperationId);

    const [operationName, setOperationName] = useState(editOperation ? editOperation.name : '');
    const [operationDescription, setOperationDescription] = useState(editOperation ? editOperation.description : '');

    useEffect(() => {
        if (editOperation) {
            setOperationName(editOperation.name);
            setOperationDescription(editOperation.description);
        }
    }, [editOperation]);

    const handleSave = () => {
        const operationData = {
            name: operationName,
            description: operationDescription,
        };

        if (editOperationId) {
            // Оновлення операції через React Query
            updateOperation.mutate(
                { operationId: editOperationId, operationData },
                {
                    onSuccess: () => {
                        console.log(`Operation with ID ${editOperationId} updated successfully.`);
                        onClose();
                    },
                    onError: (error) => {
                        console.error('Помилка при оновленні операції:', error.message);
                    },
                }
            );
        } else {
            // Створення нової операції через React Query
            saveOperation.mutate(operationData, {
                onSuccess: () => {
                    console.log('Нова операція успішно створена.');
                    onClose();
                },
                onError: (error) => {
                    console.error('Помилка при створенні операції:', error.message);
                },
            });
        }
    };

    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />
                <Styles.Title>{editOperationId ? 'Редагування операції' : 'Створення нової операції'}</Styles.Title>
                
                <Styles.Label>
                    <Styles.Subtitle>Назва операції</Styles.Subtitle>
                    <Styles.Input
                        value={operationName}
                        onChange={(e) => setOperationName(e.target.value)}
                    />
                </Styles.Label>
                
                <Styles.Label>
                    <Styles.Subtitle>Опис операції</Styles.Subtitle>
                    <Styles.TextArea
                        maxLength={250}
                        value={operationDescription}
                        onChange={(e) => setOperationDescription(e.target.value)}
                    />
                </Styles.Label>
                
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.Modal>
        </Styles.Wrapper>
    );
}
