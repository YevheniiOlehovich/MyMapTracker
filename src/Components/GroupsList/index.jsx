import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux'; 
import { useGroupsData, useDeleteGroup } from '../../hooks/useGroupsData';
import { openAddGroupModal } from '../../store/modalSlice';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import TriangleIco from '../../assets/ico/triangle.png';
import AddIco from '../../assets/ico/add-icon-black.png';
import Styles from './styled';

export default function GroupsList() {
    const dispatch = useDispatch();
    const { data: groups = [], isLoading, isError, error } = useGroupsData();
    const deleteGroup = useDeleteGroup();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded((prev) => !prev);
    };

    const handleDelete = (groupId) => {
        deleteGroup.mutate(groupId, {
            onError: (err) => console.error('Помилка при видаленні групи:', err),
        });
    };

    const handleEdit = (groupId) => {
        dispatch(openAddGroupModal(groupId)); // Відкриваємо модалку для редагування групи
    };

    const handleAddGroup = () => {
        dispatch(openAddGroupModal()); // Відкриваємо модалку для створення нової групи
    };

    if (isLoading) return <p>Завантаження даних...</p>;
    if (isError) return <p>Помилка завантаження даних: {error?.message}</p>;
    if (groups.length === 0) return <Styles.span>Групи не знайдено.</Styles.span>;

    return (
        <Styles.mainList>
            <Styles.header onClick={toggleExpanded}>
                <Styles.title>Групи</Styles.title>
                {/* Кнопка додавання нової групи */}
                <Styles.button onClick={(e) => { e.stopPropagation(); handleAddGroup(); }}>
                    <Styles.ico $pic={AddIco} />
                </Styles.button>
                <Styles.ico $pic={TriangleIco} $rotation={isExpanded ? 180 : 0} />
            </Styles.header>

            {isExpanded && (
                <Styles.list>
                    {groups.map((group) => (
                        <Styles.listItem key={group._id} $hasBorder>
                            <Styles.block>
                                <Styles.subtitle>{group.name}</Styles.subtitle>
                                <Styles.buttonBlock>
                                    <Styles.button onClick={() => handleEdit(group._id)}>
                                        <Styles.ico $pic={EditIco} />
                                    </Styles.button>
                                    <Styles.button onClick={() => handleDelete(group._id)}>
                                        <Styles.ico $pic={DelIco} />
                                    </Styles.button>
                                </Styles.buttonBlock>
                            </Styles.block>
                        </Styles.listItem>
                    ))}
                </Styles.list>
            )}
        </Styles.mainList>
    );
}