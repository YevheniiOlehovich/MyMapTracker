import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups, deleteGroup, deletePersonnel } from '../../store/groupSlice'; 
import { openAddGroupModal, openAddPersonalModal } from '../../store/modalSlice'; // Імпортуємо дії для відкриття модалок
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan, StyledImgBlock } from './styled';
import { getBase64Image } from '../../helpres/imgDecoding'

export default function PersonalList() {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups);

    

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleDeleteGroup = (groupId) => {
        dispatch(deleteGroup(groupId))
            .then(() => dispatch(fetchGroups()))
            .catch((error) => console.error('Помилка при видаленні групи:', error));
    };

    const handleDeletePersonnel = (groupId, personnelId) => {
        console.log(groupId, personnelId);
        dispatch(deletePersonnel({ groupId, personnelId }))
            .then(() => {
                dispatch(fetchGroups());
            })
            .catch((error) => console.error('Помилка при видаленні персоналу:', error));
    };

    const handleOpenEditGroupModal = (groupId) => {
        dispatch(openAddGroupModal(groupId)); // Передаємо ID групи
    };

    const handleOpenEditPersonnelModal = (groupId, personId) => {
        // Викликаємо модалку, передаючи тільки групу та id персони
        dispatch(openAddPersonalModal({ groupId, personId }));
    };
    

    return (
        <>
            <StyledTitle>Список Груп</StyledTitle>
            {groups.length === 0 ? (
                <StyledSpan>Групи не знайдено.</StyledSpan>
            ) : (
                <StyledMainList>
                    {groups.map(group => (
                        <StyledListItem key={group._id}>
                            <StyledBlock>
                                <StyledSubtitle>{group.name}</StyledSubtitle>
                                
                                <StyledButtonBlock>
                                    <StyledButton onClick={() => {
                                        handleOpenEditGroupModal(group._id); // Викликаємо функцію з переданим ID
                                    }}>
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                    <StyledButton onClick={() => handleDeleteGroup(group._id)}>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                </StyledButtonBlock>
                            </StyledBlock>

                            {group.personnel && group.personnel.length > 0 ? (
                                <StyledList>
                                    {group.personnel.map(person => (
                                        <StyledBlock key={person.contactNumber}>
                                            <StyledImgBlock imageUrl={person.photo ? getBase64Image(person.photo) : 'defaultImage.jpg'} />
                                            <StyledListItem>
                                                {person.lastName} {person.firstName}
                                            </StyledListItem>
                                            <StyledButtonBlock>
                                                <StyledButton onClick={() => handleOpenEditPersonnelModal(group._id, person._id)}>
                                                    <StyledIco pic={EditIco} />
                                                </StyledButton>
                                                <StyledButton onClick={() => handleDeletePersonnel(group._id, person._id)}>
                                                    <StyledIco pic={DelIco} />
                                                </StyledButton>
                                            </StyledButtonBlock>
                                        </StyledBlock>
                                    ))}
                                </StyledList>
                            ) : (
                                <StyledSpan>Персонал не знайдено.</StyledSpan>
                            )}


                        </StyledListItem>
                    ))}
                </StyledMainList>
            )}
        </>
    );
}
