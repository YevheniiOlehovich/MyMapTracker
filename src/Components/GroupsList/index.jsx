import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useGroupsData, useDeleteGroup, useDeletePersonnel, useDeleteVehicle, useDeleteTechnique } from '../../hooks/useGroupsData';
import { useGpsData } from '../../hooks/useGpsData';
import { setMapCenter } from '../../store/mapCenterSlice';
import { openAddGroupModal, openAddPersonalModal, openAddVehicleModal, openAddTechniqueModal } from '../../store/modalSlice';
import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import QuestionIco from '../../assets/ico/10965421.webp';
import TriangleIco from '../../assets/ico/triangle.png';

import Styles from './styled';

export default function GroupsList() {
    const dispatch = useDispatch();

    // Отримання груп через React Query
    const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError, error: groupsError } = useGroupsData();

    // Хуки для видалення
    const deleteGroup = useDeleteGroup();
    const deletePersonnel = useDeletePersonnel();
    const deleteVehicle = useDeleteVehicle();
    const deleteTechnique = useDeleteTechnique();

    const selectedDate = useSelector((state) => state.calendar.selectedDate);

    // Отримання GPS-даних через React Query
    const { data: gpsData = [], isLoading: isGpsLoading, isError: isGpsError, error: gpsError } = useGpsData();

    const [visibilityState, setVisibilityState] = useState({});

    const handleDeleteGroup = (groupId) => {
        deleteGroup.mutate(groupId, {
            onError: (error) => console.error('Помилка при видаленні групи:', error),
        });
    };

    const handleDeletePersonnel = (groupId, personnelId) => {
        deletePersonnel.mutate({ groupId, personnelId }, {
            onError: (error) => console.error('Помилка при видаленні персоналу:', error),
        });
    };

    const handleDeleteVehicle = (groupId, vehicleId) => {
        deleteVehicle.mutate({ groupId, vehicleId }, {
            onError: (error) => console.error('Помилка при видаленні транспорту:', error),
        });
    };

    const handleDeleteTechnique = (groupId, techniqueId) => {
        deleteTechnique.mutate({ groupId, techniqueId }, {
            onError: (error) => console.error('Помилка при видаленні техніки:', error),
        });
    };

    const handleOpenEditGroupModal = (groupId) => {
        dispatch(openAddGroupModal(groupId));
    };

    const handleOpenEditPersonnelModal = (groupId, personId) => {
        // console.log(groupId, personId);
        dispatch(openAddPersonalModal({ groupId, personId }));
    };

    const handleOpenEditVehicleModal = (groupId, vehicleId) => {
        dispatch(openAddVehicleModal({ groupId, vehicleId }));
    };

    const handleOpenEditTechniqueModal = (groupId, techniqueId) => {
        dispatch(openAddTechniqueModal({ groupId, techniqueId }));
    };

    const handleToggleVisibility = (groupId) => {
        setVisibilityState((prev) => ({
            ...prev,
            [groupId]: !prev[groupId],
        }));
    };

    const formatPhotoPath = (photoPath) => {
        // Перевірка наявності шляху і форматування для правильного відображення
        return photoPath 
            ? '/src/' + photoPath.substring(3).replace(/\\/g, '/') 
            : '/src/defaultImage.jpg'; // Шлях до дефолтного зображення, якщо фото немає
    };

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter((item) => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData
            .map((item) => {
                const validData = item.data.filter(
                    (gpsPoint) => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0
                );
                return validData.length > 0
                    ? { ...validData[validData.length - 1], imei: item.imei }
                    : null;
            })
            .filter((point) => point !== null);
    }, [filteredGpsData]);

    const handleDoubleClickVehicle = (vehicle) => {
        const selectedVehicle = lastGpsPoints.find((point) => point.imei === vehicle.imei);
        if (selectedVehicle) {
            dispatch(setMapCenter([selectedVehicle.latitude, selectedVehicle.longitude]));
        }
    };

    if (isGroupsLoading || isGpsLoading) return <p>Завантаження даних...</p>;
    if (isGroupsError || isGpsError) return <p>Помилка завантаження даних: {groupsError?.message || gpsError?.message}</p>;

    return (
        <>
            {groups.length === 0 ? (
                <Styles.span>Групи не знайдено.</Styles.span>
            ) : (
                <Styles.mainList>
                    {groups.map((group) => (
                        <Styles.listItem key={group._id} $hasBorder={true}>
                            <Styles.block>
                                <Styles.subtitle>{group.name}</Styles.subtitle>

                                <Styles.buttonBlock>
                                    <Styles.button onClick={() => handleOpenEditGroupModal(group._id)}>
                                        <Styles.ico $pic={EditIco} />
                                    </Styles.button>
                                    <Styles.button onClick={() => handleDeleteGroup(group._id)}>
                                        <Styles.ico $pic={DelIco} />
                                    </Styles.button>
                                    <Styles.button onClick={() => handleToggleVisibility(group._id)}>
                                        <Styles.ico
                                            $pic={TriangleIco}
                                            $rotation={visibilityState[group._id] ? 180 : 0}
                                        />
                                    </Styles.button>
                                </Styles.buttonBlock>
                            </Styles.block>

                            {visibilityState[group._id] && (
                                <>
                                    {group.personnel?.length > 0 ? (
                                        <>
                                            <Styles.subTitle>Список Персоналу</Styles.subTitle>
                                            <Styles.list>
                                                {group.personnel.map((person) => (
                                                    <Styles.block key={person._id}>
                                                        <Styles.imgBlock
                                                            imageUrl={
                                                                person.photoPath
                                                                    ? formatPhotoPath(person.photoPath)
                                                                    : QuestionIco
                                                            }
                                                        />
                                                        <Styles.listItem>
                                                            {person.lastName} {person.firstName}
                                                        </Styles.listItem>
                                                        <Styles.buttonBlock>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleOpenEditPersonnelModal(
                                                                        group._id,
                                                                        person._id
                                                                    )
                                                                }
                                                            >
                                                                <Styles.ico $pic={EditIco} />
                                                            </Styles.button>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleDeletePersonnel(group._id, person._id)
                                                                }
                                                            >
                                                                <Styles.ico $pic={DelIco} />
                                                            </Styles.button>
                                                        </Styles.buttonBlock>
                                                    </Styles.block>
                                                ))}
                                            </Styles.list>
                                        </>
                                    ) : (
                                        <Styles.span>Персонал не знайдено.</Styles.span>
                                    )}
                                    {group.vehicles?.length > 0 ? (
                                        <>
                                            <Styles.subTitle>Список транспортних засобів</Styles.subTitle>
                                            <Styles.list>
                                                {group.vehicles.map((vehicle) => (
                                                    <Styles.block key={vehicle._id}>
                                                        <Styles.imgBlock
                                                            imageUrl={
                                                                vehicle.photoPath
                                                                    ? formatPhotoPath(vehicle.photoPath)
                                                                    : QuestionIco
                                                            }
                                                        />
                                                        <Styles.listItem
                                                            onDoubleClick={() => handleDoubleClickVehicle(vehicle)}
                                                        >
                                                            {vehicle.mark}
                                                        </Styles.listItem>
                                                        <Styles.buttonBlock>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleOpenEditVehicleModal(
                                                                        group._id,
                                                                        vehicle._id
                                                                    )
                                                                }
                                                            >
                                                                <Styles.ico $pic={EditIco} />
                                                            </Styles.button>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleDeleteVehicle(group._id, vehicle._id)
                                                                }
                                                            >
                                                                <Styles.ico $pic={DelIco} />
                                                            </Styles.button>
                                                        </Styles.buttonBlock>
                                                    </Styles.block>
                                                ))}
                                            </Styles.list>
                                        </>
                                    ) : (
                                        <Styles.span>Транспорт не знайдено.</Styles.span>
                                    )}
                                    {group.techniques?.length > 0 ? (
                                        <>
                                            <Styles.subTitle>Список техніки</Styles.subTitle>
                                            <Styles.list>
                                                {group.techniques.map((technique) => (
                                                    <Styles.block key={technique._id}>
                                                        <Styles.imgBlock
                                                            imageUrl={
                                                                technique.photoPath
                                                                    ? formatPhotoPath(technique.photoPath)
                                                                    : QuestionIco
                                                            }
                                                        />
                                                        <Styles.listItem
                                                            // onDoubleClick={() => handleDoubleClickVehicle(vehicle)}
                                                        >
                                                            {technique.name}
                                                        </Styles.listItem>
                                                        <Styles.buttonBlock>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleOpenEditTechniqueModal(
                                                                        group._id,
                                                                        technique._id
                                                                    )
                                                                }
                                                            >
                                                                <Styles.ico $pic={EditIco} />
                                                            </Styles.button>
                                                            <Styles.button
                                                                onClick={() =>
                                                                    handleDeleteTechnique(group._id, technique._id)
                                                                }
                                                            >
                                                                <Styles.ico $pic={DelIco} />
                                                            </Styles.button>
                                                        </Styles.buttonBlock>
                                                    </Styles.block>
                                                ))}
                                            </Styles.list>
                                        </>
                                    ) : (
                                        <Styles.span>Транспорт не знайдено.</Styles.span>
                                    )}
                                </>
                            )}
                        </Styles.listItem>
                    ))}
                </Styles.mainList>
            )}
        </>
    );
}