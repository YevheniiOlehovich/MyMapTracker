import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGroups, selectAllGroups, deleteGroup, deletePersonnel, deleteVehicle } from '../../store/groupSlice'; 
import { openAddGroupModal, openAddPersonalModal, openAddVehicleModal } from '../../store/modalSlice'; // Імпортуємо дії для відкриття модалок

import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import QuestionIco from '../../assets/ico/10965421.webp'
import TriangleIco from '../../assets/ico/triangle.png';

import { StyledBlock, StyledSubtitle, StyledButton, StyledIco, StyledButtonBlock, StyledList, StyledListItem, StyledMainList, StyledSpan, StyledImgBlock, StyledSubTitle } from './styled';


export default function GroupsList() {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups);

    const [rotation, setRotation] = useState(0);
    const [visibilityState, setVisibilityState] = useState({});

    useEffect(() => {
        dispatch(fetchGroups());
    }, [dispatch]);

    const handleDeleteGroup = (groupId) => {
        dispatch(deleteGroup(groupId))
            .then(() => dispatch(fetchGroups()))
            .catch((error) => console.error('Помилка при видаленні групи:', error));
    };

    const handleDeletePersonnel = (groupId, personnelId) => {
        dispatch(deletePersonnel({ groupId, personnelId }))
            .then(() => {
                dispatch(fetchGroups());
            })
            .catch((error) => console.error('Помилка при видаленні персоналу:', error));
    };

    const handleDeleteVehicle = (groupId, vehicleId) => {
        dispatch(deleteVehicle({ groupId, vehicleId }))
            .then(() => {
                dispatch(fetchGroups());
            })
            .catch((error) => console.error('Помилка при видаленні транспорту:', error));
    };

    const handleOpenEditGroupModal = (groupId) => {
        dispatch(openAddGroupModal(groupId)); // Передаємо ID групи
    };

    const handleOpenEditPersonnelModal = (groupId, personId) => {
        // Викликаємо модалку, передаючи тільки групу та id персони
        dispatch(openAddPersonalModal({ groupId, personId }));
    };

    const handleOpenEditVehicleModal = (groupId, vehicleId) => {
        console.log(1)
        // Викликаємо модалку, передаючи тільки групу та id персони
        dispatch(openAddVehicleModal({ groupId, vehicleId }));
    };

    // Форматуємо шлях до фото для відображення, якщо воно є
    const formatPhotoPath = (photoPath) => {
        // Перевірка наявності шляху і форматування для правильного відображення
        return photoPath 
            ? '/src/' + photoPath.substring(3).replace(/\\/g, '/') 
            : '/src/defaultImage.jpg'; // Шлях до дефолтного зображення, якщо фото немає
    };

    const handleToggleVisibility = (groupId) => {
        setVisibilityState((prev) => ({
            ...prev,
            [groupId]: !prev[groupId], // Перемикаємо видимість конкретної групи
        }));
    };

    return (
        <>
            {groups.length === 0 ? (
                <StyledSpan>Групи не знайдено.</StyledSpan>
            ) : (
                <StyledMainList>
                    {groups.map((group) => (
                        <StyledListItem key={group._id} hasBorder={true}>
                            <StyledBlock>
                                <StyledSubtitle>{group.name}</StyledSubtitle>
    
                                <StyledButtonBlock>
                                    <StyledButton onClick={() => handleOpenEditGroupModal(group._id)}>
                                        <StyledIco pic={EditIco} />
                                    </StyledButton>
                                    <StyledButton onClick={() => handleDeleteGroup(group._id)}>
                                        <StyledIco pic={DelIco} />
                                    </StyledButton>
                                    <StyledButton onClick={() => handleToggleVisibility(group._id)}>
                                        <StyledIco
                                            pic={TriangleIco}
                                            rotation={visibilityState[group._id] ? 180 : 0} // Обертання трикутника
                                        />
                                    </StyledButton>
                                </StyledButtonBlock>
                            </StyledBlock>
    
                            {visibilityState[group._id] && (
                                <>
                                    {group.personnel?.length > 0 ? (
                                        <>
                                            <StyledSubTitle>Список Персоналу</StyledSubTitle>
                                            <StyledList>
                                                {group.personnel.map((person) => (
                                                    <StyledBlock key={person._id}>
                                                        <StyledImgBlock
                                                            imageUrl={
                                                                person.photoPath
                                                                    ? formatPhotoPath(person.photoPath)
                                                                    : QuestionIco
                                                            }
                                                        />
                                                        <StyledListItem>
                                                            {person.lastName} {person.firstName}
                                                        </StyledListItem>
                                                        <StyledButtonBlock>
                                                            <StyledButton
                                                                onClick={() =>
                                                                    handleOpenEditPersonnelModal(
                                                                        group._id,
                                                                        person._id
                                                                    )
                                                                }
                                                            >
                                                                <StyledIco pic={EditIco} />
                                                            </StyledButton>
                                                            <StyledButton
                                                                onClick={() =>
                                                                    handleDeletePersonnel(group._id, person._id)
                                                                }
                                                            >
                                                                <StyledIco pic={DelIco} />
                                                            </StyledButton>
                                                        </StyledButtonBlock>
                                                    </StyledBlock>
                                                ))}
                                            </StyledList>
                                        </>
                                    ) : (
                                        <StyledSpan>Персонал не знайдено.</StyledSpan>
                                    )}
                                    {group.vehicles?.length > 0 ? (
                                        <>
                                            <StyledSubTitle>Список техніки</StyledSubTitle>
                                            <StyledList>
                                                {group.vehicles.map((vehicle) => (
                                                    <StyledBlock key={vehicle._id}>
                                                        <StyledImgBlock
                                                            imageUrl={
                                                                vehicle.photoPath
                                                                    ? formatPhotoPath(vehicle.photoPath)
                                                                    : QuestionIco
                                                            }
                                                        />
                                                        <StyledListItem>{vehicle.mark}</StyledListItem>
                                                        <StyledButtonBlock>
                                                            <StyledButton
                                                                onClick={() =>
                                                                    handleOpenEditVehicleModal(
                                                                        group._id,
                                                                        vehicle._id
                                                                    )
                                                                }
                                                            >
                                                                <StyledIco pic={EditIco} />
                                                            </StyledButton>
                                                            <StyledButton
                                                                onClick={() =>
                                                                    handleDeleteVehicle(group._id, vehicle._id)
                                                                }
                                                            >
                                                                <StyledIco pic={DelIco} />
                                                            </StyledButton>
                                                        </StyledButtonBlock>
                                                    </StyledBlock>
                                                ))}
                                            </StyledList>
                                        </>
                                    ) : (
                                        <StyledSpan>Техніку не знайдено.</StyledSpan>
                                    )}
                                </>
                            )}
                        </StyledListItem>
                    ))}
                </StyledMainList>
            )}
        </>
    );
    
}
