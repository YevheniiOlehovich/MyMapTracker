import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGpsData } from '../../store/locationSlice';
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import Styles from './styled';
import { google_map_api } from '../../helpres';
import { haversineDistance } from '../../helpres/distance';

export default function Map() {
    const dispatch = useDispatch();
    const gpsData = useSelector((state) => state.gps.data);
    const gpsStatus = useSelector((state) => state.gps.status);
    const gpsError = useSelector((state) => state.gps.error);
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const selectedImei = useSelector((state) => state.vehicle.imei);

    const [mapCenter, setMapCenter] = useState([50.68, 32.12]); // Початкові координати

    useEffect(() => {
        if (gpsStatus === 'idle') {
            dispatch(fetchGpsData());
        }
    }, [dispatch, gpsStatus]);

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate || !selectedImei) return []; // Якщо IMEI null, повертаємо []
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted && item.imei === selectedImei);
    }, [gpsData, selectedDate, selectedImei]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
            return validData.length > 0 ? validData[validData.length - 1] : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

    // Оновлюємо центр карти на останніх координатах
    useEffect(() => {
        if (lastGpsPoints.length > 0) {
            const lastPoint = lastGpsPoints[lastGpsPoints.length - 1];
            setMapCenter([lastPoint.latitude, lastPoint.longitude]);
        }
    }, [lastGpsPoints]);

    const routeCoordinates = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0) return [];
        return filteredGpsData.flatMap(item => 
            item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0).map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude])
        );
    }, [filteredGpsData]);

    const totalDistance = useMemo(() => {
        if (routeCoordinates.length < 2) return 0;

        return routeCoordinates.reduce((sum, coord, index, array) => {
            if (index === 0) return sum;
            const [lat1, lon1] = array[index - 1];
            const [lat2, lon2] = coord;
            return sum + haversineDistance(lat1, lon1, lat2, lon2);
        }, 0).toFixed(2);
    }, [routeCoordinates]);

    return (
        <Styles.wrapper>
            <MapContainer
                center={mapCenter} // Центруємо карту на останніх координатах
                zoom={13}
                attributionControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                easeLinearity={0.8}
                style={{ height: '100vh', width: '100%' }}
            >
                <TileLayer
                    url={`https://{s}.google.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=${google_map_api}`}
                    subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                />

                {routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
                )}

                {lastGpsPoints.map((point, index) => (
                    <Marker key={index} position={[point.latitude, point.longitude]}>
                        <Popup>
                            <strong>Остання точка</strong> <br />
                            Час: {new Date(point.timestamp).toLocaleString()} <br />
                            IMEI: {selectedImei || 'Всі'} <br />
                            Пройдено: {totalDistance} км
                        </Popup>
                    </Marker>
                ))}
            </MapContainer>
        </Styles.wrapper>
    );
}
