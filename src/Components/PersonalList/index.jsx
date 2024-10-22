import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; // Імпортуємо селектор і екшен

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
        <div>
            <h2>Список Груп</h2>
            {groups.length === 0 ? (
                <p>Групи не знайдено.</p>
            ) : (
                <ul>
                    {groups.map(group => (
                        <li key={group.value}>
                            {group.label} {/* Назва групи */}
                            {group.personnel && group.personnel.length > 0 ? ( // Якщо є персонал
                                <ul>
                                    {group.personnel.map(person => (
                                        <li key={person.contactNumber}>
                                            {person.name} - {person.contactNumber} {/* Інформація про персонал */}
                                        </li>
                                    ))}
                                </ul>
                            ) : (
                                <p>Персонал не знайдено.</p>
                            )}
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}
