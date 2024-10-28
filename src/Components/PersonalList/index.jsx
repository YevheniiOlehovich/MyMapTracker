import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups, deleteGroup, deletePersonnel  } from '../../store/groupSlice'; // Імпортуємо потрібні екшени
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan } from './styled';

export default function PersonalList() {
    const dispatch = useDispatch(); // Використовуємо dispatch для виклику екшенів
    const groups = useSelector(selectAllGroups); // Отримуємо всі групи зі стейту

    useEffect(() => {
        dispatch(fetchGroups()); // Викликаємо екшен для отримання груп
    }, [dispatch]);

    const handleDeleteGroup = (groupId) => {
        dispatch(deleteGroup(groupId))
            .then(() => dispatch(fetchGroups())) // Оновлення списку після видалення
            .catch((error) => console.error('Помилка при видаленні групи:', error));
    };

    const handleDeletePersonnel = (groupId, personnelId) => {
        console.log(groupId, personnelId); // Переконайтеся, що значення правильні
        dispatch(deletePersonnel({ groupId, personnelId }))
            .then(() => {
                dispatch(fetchGroups());
            })
            .catch((error) => console.error('Помилка при видаленні персоналу:', error));
    };

    // Логування отриманих груп
    console.log('Отримані групи:', groups);

    // Рендеримо список груп та персонал
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

                                {/* Кнопка для видалення групи */}
                                <StyledButtonBlock>
                                    <StyledButton onClick={() => handleDeleteGroup(group.value)}>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                    <StyledButton >
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                </StyledButtonBlock>
                            </StyledBlock>

                            {/* Персонал групи */}
                            {group.personnel && group.personnel.length > 0 ? (
                                <StyledList>
                                    {group.personnel.map(person => (
                                        <StyledBlock key={person.contactNumber}>
                                            <StyledListItem>
                                                {person.name}  {/* Інформація про персонал */}
                                            </StyledListItem>

                                            {/* Кнопка для видалення персоналу */}
                                            <StyledButtonBlock>
                                                <StyledButton onClick={() => handleDeletePersonnel(group.value, person._id)}>
                                                    <StyledIco pic={DelIco}/>
                                                </StyledButton>
                                                <StyledButton >
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