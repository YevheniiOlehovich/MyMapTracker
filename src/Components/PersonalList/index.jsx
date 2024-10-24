// import { useEffect } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; // Імпортуємо селектор і екшен
// import EditIco from '../../assets/ico/edit-icon-black.png'
// import DelIco from '../../assets/ico/del-icon-black.png'
// import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco } from './styled'

// export default function PersonalList() {
//     const dispatch = useDispatch(); // Використовуємо dispatch для виклику екшенів
//     const groups = useSelector(selectAllGroups); // Отримуємо всі групи зі стейту

//     useEffect(() => {
//         dispatch(fetchGroups()); // Викликаємо екшен для отримання груп
//     }, [dispatch]);

//     // Логування отриманих груп
//     console.log('Отримані групи:', groups);

//     // Рендеримо список груп та персонал
//     return (
//         <>
//             <StyledTitle>Cписок Груп</StyledTitle>
//             <StyledBlock>
//                 <StyledSubtitle></StyledSubtitle>
                
//                 <StyledButton>
//                         <StyledIco pic={EditIco}></StyledIco>
//                     </StyledButton>
//                     <StyledButton>
//                         <StyledIco pic={DelIco}></StyledIco>
//                     </StyledButton>
//             </StyledBlock>
//         </>
//         // <div>
//         //     <h2>Список Груп</h2>
//         //     {groups.length === 0 ? (
//         //         <p>Групи не знайдено.</p>
//         //     ) : (
//         //         <ul>
//         //             {groups.map(group => (
//         //                 <li key={group.value}>
//         //                     {group.label} {/* Назва групи */}
//         //                     {group.personnel && group.personnel.length > 0 ? ( // Якщо є персонал
//         //                         <ul>
//         //                             {group.personnel.map(person => (
//         //                                 <li key={person.contactNumber}>
//         //                                     {person.name} - {person.contactNumber} {/* Інформація про персонал */}
//         //                                 </li>
//         //                             ))}
//         //                         </ul>
//         //                     ) : (
//         //                         <p>Персонал не знайдено.</p>
//         //                     )}
//         //                 </li>
//         //             ))}
//         //         </ul>
//         //     )}
//         // </div>
//     );
// }


import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; // Імпортуємо селектор і екшен
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import { StyledTitle, StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan } from './styled';

export default function PersonalList() {
    const dispatch = useDispatch(); // Використовуємо dispatch для виклику екшенів
    const groups = useSelector(selectAllGroups); // Отримуємо всі групи зі стейту

    useEffect(() => {
        dispatch(fetchGroups()); // Викликаємо екшен для отримання груп
    }, [dispatch]);

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
                        <StyledListItem key={group.value}>
                            <StyledBlock>
                                <StyledSubtitle>{group.label}</StyledSubtitle>
                                
                                {/* Кнопки для редагування та видалення */}
                                <StyledButtonBlock>
                                    <StyledButton>
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                    <StyledButton>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                </StyledButtonBlock>
                                
                            </StyledBlock>

                            {/* Персонал групи */}
                            {group.personnel && group.personnel.length > 0 ? (
                                <StyledList>
                                    {group.personnel.map(person => (
                                        <StyledBlock>
                                            <StyledListItem key={person.contactNumber}>
                                                {person.name} - {person.contactNumber} {/* Інформація про персонал */}
                                            </StyledListItem>

                                            <StyledButtonBlock>
                                            <StyledButton>
                                                <StyledIco pic={EditIco} />
                                            </StyledButton>
                                            <StyledButton>
                                                <StyledIco pic={DelIco} />
                                            </StyledButton>
                                            </StyledButtonBlock>
                                        </StyledBlock>
                                    ))}
                                </StyledList>
                            ) : (
                                <p>Персонал не знайдено.</p>
                            )}
                        </StyledListItem>
                    ))}
                </StyledMainList>
            )}
        </>
    );
}
