import Styles from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import apiRoutes from '../../helpres/ApiRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, updateGroup } from '../../store/groupSlice';

export default function AddGroupModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);
    const dispatch = useDispatch();

    const editGroupId = useSelector(state => state.modals.editGroupId);
    const groups = useSelector(state => state.groups.groups);
    const editGroup = groups.find(group => group._id === editGroupId);

    console.log('Edit Group ID in Modal:', editGroupId); 

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

    const handleSave = async () => {
        const groupData = {
            name: groupName,
            ownership: groupOwnership,
            description: groupDescription,
        };
    
        try {
            if (editGroupId) {
                await dispatch(updateGroup({ groupId: editGroupId, groupData }));
                console.log(`Group with ID ${editGroupId} updated successfully.`);
            } else {
                const response = await fetch(apiRoutes.addGroup, {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify(groupData),
                });
    
                if (!response.ok) throw new Error('Failed to save new group');
    
                const savedGroup = await response.json();
                console.log('New group created:', savedGroup);
                dispatch(fetchGroups());
            }
    
            onClose();
        } catch (error) {
            console.error('Error saving group:', error);
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