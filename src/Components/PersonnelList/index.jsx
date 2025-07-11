import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { usePersonnelData, useDeletePersonnel } from '../../hooks/usePersonnelData';
import { useGroupsData } from '../../hooks/useGroupsData';
import { openAddPersonalModal } from '../../store/modalSlice';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import TriangleIco from '../../assets/ico/triangle.png';
import AddIco from '../../assets/ico/add-icon-black.png';
import QuestionIco from '../../assets/ico/10965421.webp';
import Styles from './styled';
import { personalFunctions } from '../../helpres';


export default function PersonnelList() {
    const dispatch = useDispatch();
    const { data: personnel = [], isLoading, isError, error } = usePersonnelData();
    const { data: groups = [] } = useGroupsData(); // список груп
    const deletePersonnel = useDeletePersonnel();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => setIsExpanded(prev => !prev);
    const handleEdit = (id) => dispatch(openAddPersonalModal({ personId: id }));
    const handleAdd = () => dispatch(openAddPersonalModal());
    const handleDelete = (id) =>
        deletePersonnel.mutate(id, {
            onError: (err) => console.error('Помилка при видаленні:', err),
        });

    const getGroupName = (groupId) => {
        const group = groups.find(g => g._id === groupId);
        return group ? group.name : 'Без групи';
    };

    if (isLoading) return <p>Завантаження персоналу...</p>;
    if (isError) return <p>Помилка: {error?.message}</p>;
    if (personnel.length === 0) return <Styles.span>Персонал не знайдено.</Styles.span>;

    // групування по groupId
    const groupedByGroup = personnel.reduce((acc, person) => {
        const key = person.groupId || 'noGroup';
        if (!acc[key]) acc[key] = [];
        acc[key].push(person);
        return acc;
    }, {});

    return (
        <Styles.mainList>
            <Styles.header onClick={toggleExpanded}>
                <Styles.title>Персонал</Styles.title>
                <Styles.button onClick={(e) => { e.stopPropagation(); handleAdd(); }}>
                    <Styles.ico $pic={AddIco} />
                </Styles.button>
                <Styles.ico $pic={TriangleIco} $rotation={isExpanded ? 180 : 0} />
            </Styles.header>

            {isExpanded && (
                <Styles.list>
                    {Object.entries(groupedByGroup).map(([groupId, people]) => (
                        <div key={groupId}>
                            <Styles.groupTitle>{getGroupName(groupId)}</Styles.groupTitle>

                            {personalFunctions.map((func) => {
                                const filtered = people.filter(p => p.function === func._id);
                                if (filtered.length === 0) return null;

                                return (
                                    <div key={func._id}>
                                        <Styles.functionTitle>{func.name}</Styles.functionTitle>
                                        {filtered.map((person) => (
                                            <Styles.listItem key={person._id} $hasBorder>
                                                <Styles.block>
                                                    <Styles.imgBlock
                                                        $imageUrl={
                                                            person.photoPath
                                                                ? '/src/' + person.photoPath.substring(3).replace(/\\/g, '/')
                                                                : QuestionIco
                                                        }
                                                    />
                                                    <Styles.personName>{person.lastName} {person.firstName}</Styles.personName>
                                                    <Styles.buttonBlock>
                                                        <Styles.button onClick={() => handleEdit(person._id)}>
                                                            <Styles.ico $pic={EditIco} />
                                                        </Styles.button>
                                                        <Styles.button onClick={() => handleDelete(person._id)}>
                                                            <Styles.ico $pic={DelIco} />
                                                        </Styles.button>
                                                    </Styles.buttonBlock>
                                                </Styles.block>
                                            </Styles.listItem>
                                        ))}
                                    </div>
                                );
                            })}
                        </div>
                    ))}
                </Styles.list>
            )}
        </Styles.mainList>
    );
}
