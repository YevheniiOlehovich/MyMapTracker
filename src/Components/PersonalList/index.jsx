import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups, deleteGroup, deletePersonnel } from '../../store/groupSlice'; 
import { openAddGroupModal, openAddPersonalModal } from '../../store/modalSlice'; // Імпортуємо дії для відкриття модалок
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan } from './styled';

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

    const handleOpenEditGroupModal = () => {
        dispatch(openAddGroupModal()); // Виклик модалки для редагування групи
    };

    const handleOpenEditPersonnelModal = () => {
        dispatch(openAddPersonalModal()); // Виклик модалки для редагування персоналу
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
                                <StyledSubtitle>{group.label}</StyledSubtitle>

                                <StyledButtonBlock>
                                    <StyledButton onClick={() => handleDeleteGroup(group.value)}>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                    <StyledButton onClick={handleOpenEditGroupModal}> {/* Кнопка редагування групи */}
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                </StyledButtonBlock>
                            </StyledBlock>

                            {group.personnel && group.personnel.length > 0 ? (
                                <StyledList>
                                    {group.personnel.map(person => (
                                        <StyledBlock key={person.contactNumber}>
                                            <StyledListItem>
                                                {person.name}
                                            </StyledListItem>

                                            <StyledButtonBlock>
                                                <StyledButton onClick={() => handleDeletePersonnel(group.value, person._id)}>
                                                    <StyledIco pic={DelIco}/>
                                                </StyledButton>
                                                <StyledButton onClick={handleOpenEditPersonnelModal}> {/* Кнопка редагування персоналу */}
                                                    <StyledIco pic={EditIco} />
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
