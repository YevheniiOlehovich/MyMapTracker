import { useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { openAddVehicleModal } from '../../store/modalSlice';
import { useVehiclesData, useDeleteVehicle } from '../../hooks/useVehiclesData';
import { useGpsData } from '../../hooks/useGpsData';
import { useGroupsData } from '../../hooks/useGroupsData';
import { setMapCenter } from '../../store/mapCenterSlice';

import EditIco from '../../assets/ico/edit-icon-black.png';
import DelIco from '../../assets/ico/del-icon-black.png';
import TriangleIco from '../../assets/ico/triangle.png';
import QuestionIco from '../../assets/ico/10965421.webp';
import LocationIco from '../../assets/ico/location.png';
import AddIco from '../../assets/ico/add-icon-black.png';
import Styles from './styled';

import { vehicleTypes } from '../../helpres';

export default function VehicleList() {
    const dispatch = useDispatch();

    // Дані з API
    const { data: vehicles = [], isLoading, isError, error } = useVehiclesData();
    const { data: gpsData = [] } = useGpsData();
    const { data: groups = [] } = useGroupsData();
    const deleteVehicle = useDeleteVehicle();

    // Вибрана дата календаря (для локації)
    const selectedDate = useSelector(state => state.calendar.selectedDate);

    const [isExpanded, setIsExpanded] = useState(true);

    const toggleExpanded = () => setIsExpanded(prev => !prev);
    const handleAdd = () => dispatch(openAddVehicleModal());
    const handleEdit = (id) => dispatch(openAddVehicleModal({ vehicleId: id }));
    const handleDelete = (id) => {
        deleteVehicle.mutate(id, {
            onError: (err) => console.error('Помилка при видаленні техніки:', err),
        });
    };

    // --- Фільтрація GPS даних по даті і пошук останньої валідної точки ---
    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData
            .map(item => {
                const validPoints = item.data.filter(p => p.latitude !== 0 && p.longitude !== 0);
                return validPoints.length > 0
                    ? { ...validPoints[validPoints.length - 1], imei: item.imei }
                    : null;
            })
            .filter(point => point !== null);
    }, [filteredGpsData]);

    // Показати останню локацію техніки на мапі по останній валідній точці
    const showVehicleLocation = (vehicle) => {
        const selectedVehicle = lastGpsPoints.find(point => point.imei === vehicle.imei);
        if (selectedVehicle) {
            dispatch(setMapCenter({ lat: selectedVehicle.latitude, lng: selectedVehicle.longitude }));
        }
    };

    if (isLoading) return <p>Завантаження техніки...</p>;
    if (isError) return <p>Помилка завантаження: {error?.message}</p>;
    if (vehicles.length === 0) return <Styles.span>Техніка не знайдена.</Styles.span>;

    const getGroupName = (groupId) => {
        const group = groups.find(g => g._id === groupId);
        return group ? group.name : 'Без групи';
    };

    // Групування техніки по групах
    const groupedByGroup = vehicles.reduce((acc, vehicle) => {
        const groupId = vehicle.groupId || 'noGroup';
        if (!acc[groupId]) acc[groupId] = [];
        acc[groupId].push(vehicle);
        return acc;
    }, {});

    return (
        <Styles.mainList>
            <Styles.header onClick={toggleExpanded}>
                <Styles.title>Транспорт</Styles.title>
                <Styles.button
                    onClick={e => {
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
                    {Object.entries(groupedByGroup).map(([groupId, vehiclesInGroup]) => (
                        <Styles.groupTitle key={groupId}>
                            {getGroupName(groupId)}
                            {vehicleTypes.map(({ _id: typeId, name: typeName }) => {
                                const vehiclesOfType = vehiclesInGroup.filter(v => v.vehicleType === typeId);
                                if (vehiclesOfType.length === 0) return null;

                                return (
                                    <Styles.functionTitle key={typeId}>
                                        {typeName}
                                        {vehiclesOfType.map(vehicle => (
                                            <Styles.listItem key={vehicle._id} $hasBorder>
                                                <Styles.block>
                                                    <Styles.imgBlock
                                                        $imageUrl={
                                                            vehicle.photoPath
                                                                ? '/src/' + vehicle.photoPath.substring(3).replace(/\\/g, '/')
                                                                : QuestionIco
                                                        }
                                                    />
                                                    <Styles.vehicleName>{vehicle.mark}</Styles.vehicleName>
                                                    <Styles.buttonBlock>
                                                        <Styles.button onClick={() => showVehicleLocation(vehicle)}>
                                                            <Styles.ico $pic={LocationIco} />
                                                        </Styles.button>
                                                        <Styles.button onClick={() => handleEdit(vehicle._id)}>
                                                            <Styles.ico $pic={EditIco} />
                                                        </Styles.button>
                                                        <Styles.button onClick={() => handleDelete(vehicle._id)}>
                                                            <Styles.ico $pic={DelIco} />
                                                        </Styles.button>
                                                    </Styles.buttonBlock>
                                                </Styles.block>
                                            </Styles.listItem>
                                        ))}
                                    </Styles.functionTitle>
                                );
                            })}
                        </Styles.groupTitle>
                    ))}
                </Styles.list>
            )}
        </Styles.mainList>
    );
}