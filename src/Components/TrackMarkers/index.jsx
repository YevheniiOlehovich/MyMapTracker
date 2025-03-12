import React, { useMemo, useEffect, useState } from 'react';
import { Marker, Polyline, Popup } from 'react-leaflet';
import { useDispatch, useSelector } from 'react-redux';
import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
import { selectAllGroups } from '../../store/groupSlice';
import { haversineDistance } from '../../helpres/distance';
import L from 'leaflet';
import parkingIco from '../../assets/ico/parking-ico.png';
import carIco from '../../assets/ico/car-ico.png';
import tractorIco from '../../assets/ico/tractor-ico.png';
import combineIco from '../../assets/ico/combine-ico.png';  
import truckIco from '../../assets/ico/truck-ico.png';

const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
    const dispatch = useDispatch();
    const [showParkingMarkers, setShowParkingMarkers] = useState(false);

    // Отримуємо дані груп з Redux
    const groups = useSelector(selectAllGroups);

    // Логування груп
    useEffect(() => {
        console.log('Groups:', groups);
    }, [groups]);

    const getVehicleTypeByImei = (imei) => {
        if (!Array.isArray(groups)) {
            console.error('Groups is not an array:', groups);
            return 'car'; // Тип за замовчуванням
        }

        for (const group of groups) {
            const vehicle = group.vehicles.find((v) => v.imei === imei);
            if (vehicle) {
                return vehicle.vehicleType;
            }
        }
        return 'car'; // Тип за замовчуванням
    };

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    const routeCoordinates = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
        const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
        if (!selectedVehicleData) return [];
        return selectedVehicleData.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0).map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude]);
    }, [filteredGpsData, selectedImei]);

    const totalDistance = useMemo(() => {
        if (routeCoordinates.length < 2) return 0;

        return routeCoordinates.reduce((sum, coord, index, array) => {
            if (index === 0) return sum;
            const [lat1, lon1] = array[index - 1];
            const [lat2, lon2] = coord;
            return sum + haversineDistance(lat1, lon1, lat2, lon2);
        }, 0).toFixed(2);
    }, [routeCoordinates]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
            return validData.length > 0 ? { ...validData[validData.length - 1], imei: item.imei } : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

    const stationarySegments = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
        const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
        if (!selectedVehicleData) return [];

        const segments = [];
        let currentSegment = [];

        selectedVehicleData.data.forEach((gpsPoint, index, array) => {
            if (index === 0) return;
            const prevPoint = array[index - 1];
            if (gpsPoint.latitude === prevPoint.latitude && gpsPoint.longitude === prevPoint.longitude) {
                currentSegment.push(gpsPoint);
            } else {
                if (currentSegment.length > 0) {
                    segments.push(currentSegment);
                    currentSegment = [];
                }
            }
        });

        if (currentSegment.length > 0) {
            segments.push(currentSegment);
        }

        // Обчислюємо тривалість стоянки для кожного сегмента
        return segments.map(segment => {
            const startTime = new Date(segment[0].timestamp);
            const endTime = new Date(segment[segment.length - 1].timestamp);
            const duration = (endTime - startTime) / 1000; // Тривалість у секундах
            return segment.map(point => ({ ...point, duration }));
        });
    }, [filteredGpsData, selectedImei]);

    useEffect(() => {
        console.log('Stationary Segments:', stationarySegments);
    }, [stationarySegments]);

    const handleMarkerClick = (imei) => {
        dispatch(setImei(imei));
        dispatch(toggleShowTrack());
        setShowParkingMarkers(!showParkingMarkers);
    };

    const getIconByType = (type) => {
        switch (type) {
            case 'car':
                return carIco;
            case 'tractor':
                return tractorIco;
            case 'combine':
                return combineIco;
            case 'truck':
                return truckIco;
            default:
                return carIco;
        }
    };

    return (
        <>
            {showTrack && routeCoordinates.length > 0 && (
                <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
            )}

            {lastGpsPoints.map((point, index) => {
                const vehicleType = getVehicleTypeByImei(point.imei);
                return (
                    <Marker key={index} position={[point.latitude, point.longitude]} icon={new L.Icon({
                        iconUrl: getIconByType(vehicleType),
                        iconSize: [30, 30], // Розмір іконки
                        iconAnchor: [12, 25], // Точка прив'язки іконки
                        popupAnchor: [0, -25] // Точка прив'язки попапу
                    })} zIndexOffset={1000} eventHandlers={{ click: () => handleMarkerClick(point.imei) }}>
                        <Popup>
                            <strong>Остання точка</strong> <br />
                            Час: {new Date(point.timestamp).toLocaleString()} <br />
                            IMEI: {point.imei} <br />
                            Пройдено: {totalDistance} км
                        </Popup>
                    </Marker>
                );
            })}

            {showParkingMarkers && stationarySegments.map((segment, segmentIndex) => (
                segment.slice(0, -1).map((point, pointIndex) => (
                    <Marker key={`stationary-${segmentIndex}-${pointIndex}`} position={[point.latitude, point.longitude]} icon={new L.Icon({
                        iconUrl: parkingIco,
                        iconSize: [25, 25], // Розмір іконки
                        iconAnchor: [12, 25], // Точка прив'язки іконки
                        popupAnchor: [0, -25] // Точка прив'язки попапу
                    })} zIndexOffset={500}>
                        <Popup>
                            <strong>Техніка стоїть</strong> <br />
                            Час: {new Date(point.timestamp).toLocaleString()} <br />
                            IMEI: {point.imei} <br />
                            Стоїть: {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
                        </Popup>
                    </Marker>
                ))
            ))}
        </>
    );
};

export default TrackMarkers;