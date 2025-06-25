import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { useTechniquesData, useDeleteTechnique } from '../../hooks/useTechniquesData';
import { openAddTechniqueModal } from '../../store/modalSlice';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import TriangleIco from '../../assets/ico/triangle.png';
import AddIco from '../../assets/ico/add-icon-black.png';
import Styles from './styled';
import QuestionIco from '../../assets/ico/10965421.webp';

export default function TechniqueList() {
    const dispatch = useDispatch();
    const { data: techniques = [], isLoading, isError, error } = useTechniquesData();
    const deleteTechnique = useDeleteTechnique();
    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => {
        setIsExpanded(prev => !prev);
    };

    const handleEdit = (techniqueId) => {
        dispatch(openAddTechniqueModal({ techniqueId }));
    };

    const handleAdd = () => dispatch(openAddTechniqueModal());

    const handleDelete = (techniqueId) => {
        deleteTechnique.mutate(techniqueId, {
            onError: (err) => console.error('Помилка при видаленні техніки:', err),
        });
    };

    if (isLoading) return <p>Завантаження техніки...</p>;
    if (isError) return <p>Помилка завантаження техніки: {error?.message}</p>;

    return (
        <Styles.mainList>
            <Styles.header onClick={toggleExpanded}>
                <Styles.title>Техніка</Styles.title>
                <Styles.button
                    onClick={(e) => {
                        e.stopPropagation();
                        handleAdd();
                    }}
                >
                    <Styles.ico $pic={AddIco} />
                </Styles.button>
                <Styles.ico $pic={TriangleIco} $rotation={isExpanded ? 180 : 0} />
            </Styles.header>

            {isExpanded && (
                <Styles.list>
                    {techniques.map((tech) => (
                        <Styles.listItem key={tech._id} $hasBorder>
                            <Styles.block>
                                <Styles.imgBlock
                                    $imageUrl={
                                        tech.photoPath
                                            ? '/src/' + tech.photoPath.substring(3).replace(/\\/g, '/')
                                            : QuestionIco
                                    }
                                />
                                <Styles.subtitle>{tech.name}</Styles.subtitle>
                                <Styles.buttonBlock>
                                    <Styles.button onClick={() => handleEdit(tech._id)}>
                                        <Styles.ico $pic={EditIco} />
                                    </Styles.button>
                                    <Styles.button onClick={() => handleDelete(tech._id)}>
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