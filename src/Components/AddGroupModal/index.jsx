import Styles from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import { useGroupsData, useUpdateGroup, useSaveGroup } from '../../hooks/useGroupsData'; // Хуки для роботи з групами
import apiRoutes from '../../helpres/ApiRoutes';
import { useSelector } from 'react-redux';

export default function AddGroupModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    // Отримуємо дані груп через React Query
    const { data: groups = [] } = useGroupsData();

    // Хук для оновлення групи
    const updateGroup = useUpdateGroup();
    const saveGroup = useSaveGroup();

    // Отримуємо ID групи для редагування
    const editGroupId = useSelector(state => state.modals.editGroupId);
    const editGroup = groups.find(group => group._id === editGroupId);

    const [groupName, setGroupName] = useState(editGroup ? editGroup.name : '');
    const [groupOwnership, setGroupOwnership] = useState(editGroup ? editGroup.ownership : '');
    const [groupDescription, setGroupDescription] = useState(editGroup ? editGroup.description : '');

    useEffect(() => {
        if (editGroup) {
            setGroupName(editGroup.name);
            setGroupOwnership(editGroup.ownership);
            setGroupDescription(editGroup.description);
        }
    }, [editGroup]);

    const handleSave = () => {
        const groupData = {
            name: groupName,
            ownership: groupOwnership,
            description: groupDescription,
        };

        if (editGroupId) {
            // Оновлення групи через React Query
            updateGroup.mutate(
                { groupId: editGroupId, groupData },
                {
                    onSuccess: () => {
                        console.log(`Group with ID ${editGroupId} updated successfully.`);
                        onClose();
                    },
                    onError: (error) => {
                        console.error('Помилка при оновленні групи:', error.message);
                    },
                }
            );
        } else {
            // Створення нової групи через React Query
            saveGroup.mutate(groupData, {
                onSuccess: () => {
                    console.log('Нова група успішно створена.');
                    onClose();
                },
                onError: (error) => {
                    console.error('Помилка при створенні групи:', error.message);
                },
            });
        }
    };
    
    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />
                <Styles.Title>{editGroupId ? 'Редагування групи' : 'Створення нової групи'}</Styles.Title>
                <Styles.Label>
                    <Styles.Subtitle>Назва нової групи</Styles.Subtitle>
                    <Styles.Input
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)}
                    />
                </Styles.Label>
                <Styles.Label>
                    <Styles.Subtitle>Приналежність групи</Styles.Subtitle>
                    <Styles.Input
                        value={groupOwnership}
                        onChange={(e) => setGroupOwnership(e.target.value)}
                    />
                </Styles.Label>
                <Styles.Label>
                    <Styles.TextArea
                        maxLength={250}
                        value={groupDescription}
                        onChange={(e) => setGroupDescription(e.target.value)}
                    />
                </Styles.Label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </Styles.Modal>
        </Styles.Wrapper>
    );
}