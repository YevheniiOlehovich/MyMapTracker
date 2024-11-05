import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput, StyledTextArea } from './styles';
import closeModal from "../../helpres/closeModal";
import Button from '../Button';
import { useState, useEffect } from 'react';
import apiRoutes from '../../helpres/ApiRoutes';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, updateGroup } from '../../store/groupSlice';

export default function AddGroupModal({ onClose }) { 
    const handleWrapperClick = closeModal(onClose);
    const dispatch = useDispatch(); // Create dispatch

    const editGroupId = useSelector(state => state.modals.editGroupId);
    const groups = useSelector(state => state.groups.groups);
    const editGroup = groups.find(group => group._id === editGroupId); // Find the group being edited

    // Log the group ID
    console.log('Edit Group ID in Modal:', editGroupId); 

    // State for each field, initialized with the group's current data if editing
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

    // const handleSave = async () => {
    //     // Create an object with the data
    //     const groupData = {
    //         name: groupName,
    //         ownership: groupOwnership,
    //         description: groupDescription,
    //     };

    //     try {
    //         if (editGroupId) {
    //             // If we are editing, dispatch the update action
    //             await dispatch(updateGroup({ groupId: editGroupId, groupData }));
    //         } else {
    //             // Handle the creation of a new group
    //             const response = await fetch(apiRoutes.addGroup, {
    //                 method: 'POST',
    //                 headers: {
    //                     'Content-Type': 'application/json',
    //                 },
    //                 body: JSON.stringify(groupData),
    //             });

    //             if (!response.ok) {
    //                 throw new Error('Failed to save group');
    //             }
    //             const savedGroup = await response.json();
    //             console.log('Group saved:', savedGroup);
    //             dispatch(fetchGroups()); // Refresh the group list
    //         }

    //         onClose(); // Close the modal
    //     } catch (error) {
    //         console.error('Error saving group:', error);
    //     }
    // };

    const handleSave = async () => {
        // Створюємо об'єкт з даними групи
        const groupData = {
            name: groupName,
            ownership: groupOwnership,
            description: groupDescription,
        };
    
        try {
            if (editGroupId) {
                // Якщо редагуємо існуючу групу
                await dispatch(updateGroup({ groupId: editGroupId, groupData }));
                console.log(`Group with ID ${editGroupId} updated successfully.`);
            } else {
                // Якщо створюємо нову групу
                const response = await fetch(apiRoutes.addGroup, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(groupData),
                });
    
                if (!response.ok) {
                    throw new Error('Failed to save new group'); // Обробка помилки
                }
    
                const savedGroup = await response.json();
                console.log('New group created:', savedGroup);
                dispatch(fetchGroups()); // Оновлюємо список груп
            }
    
            onClose(); // Закриваємо модальне вікно
        } catch (error) {
            console.error('Error saving group:', error);
        }
    };
    

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} /> 
                <StyledTitle>{editGroupId ? 'Редагування групи' : 'Створення нової групи'}</StyledTitle>
                <StyledLabel>
                    <StyledSubtitle>Назва нової групи</StyledSubtitle>
                    <StyledInput 
                        value={groupName}
                        onChange={(e) => setGroupName(e.target.value)} // Save group name
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Приналежність групи</StyledSubtitle>
                    <StyledInput 
                        value={groupOwnership} 
                        onChange={(e) => setGroupOwnership(e.target.value)} // Save ownership
                    />
                </StyledLabel>
                <StyledLabel>
                    <StyledTextArea
                        maxLength={250}
                        value={groupDescription} // Correctly bind to state
                        onChange={(e) => setGroupDescription(e.target.value)} // Save description
                    />
                </StyledLabel>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave}/>
                </div>
            </StyledModal>
        </StyledWrapper>
    );
}
