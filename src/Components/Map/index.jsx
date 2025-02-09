import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGpsData } from '../../store/locationSlice'; // Імпортуємо thunk для отримання GPS
import { MapContainer, TileLayer, Marker, Popup, Polyline } from 'react-leaflet';
import Styles from './styled';
import { google_map_api } from '../../helpres';

export default function Map() {
    const dispatch = useDispatch();

    // Отримуємо дані з Redux store
    const gpsData = useSelector((state) => state.gps.data);
    const gpsStatus = useSelector((state) => state.gps.status);
    const gpsError = useSelector((state) => state.gps.error);

    // Отримуємо вибрану дату з календаря
    const selectedDate = useSelector((state) => state.calendar.selectedDate);

    useEffect(() => {
        if (gpsStatus === 'idle') {
            dispatch(fetchGpsData());
        }
    }, [dispatch, gpsStatus]);

    // Фільтруємо GPS-дані за вибраною датою
    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0]; // Отримуємо лише YYYY-MM-DD
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    // Логуємо лише при зміні відфільтрованих даних
    useEffect(() => {
        if (gpsStatus === 'succeeded' && filteredGpsData.length > 0) {
            console.log('Filtered GPS Data:', filteredGpsData);
        } else if (gpsStatus === 'failed') {
            console.log('Error fetching GPS data:', gpsError);
        }
    }, [filteredGpsData]);

    // Логування вибраної дати
    useEffect(() => {
        console.log('Selected Date:', selectedDate);
    }, [selectedDate]);

    // Функція для перевірки валідності GPS-даних
    const isValidGpsData = (data) => {
        return data.latitude !== 0 && data.longitude !== 0 &&
               data.altitude !== 0 && data.angle !== 0 &&
               data.satellites !== 0 && data.speed !== 0;
    };

    // Збираємо всі координати з фільтрованих даних, ігноруючи "биті" дані
    const routeCoordinates = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0) return [];
        
        const validGpsData = filteredGpsData.flatMap(item => 
            item.data.filter(isValidGpsData).map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude])
        );

        return validGpsData;
    }, [filteredGpsData]);

    // Останній елемент з фільтрованих даних
    const lastGpsData = filteredGpsData.length > 0 ? filteredGpsData[filteredGpsData.length - 1].data[filteredGpsData[filteredGpsData.length - 1].data.length - 1] : null;

    return (
        <Styles.wrapper>
            <MapContainer
                center={[50.68, 32.12]}
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

                {/* Якщо є координати, рендеримо маршрут */}
                {routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
                )}

                {/* Якщо є дані, рендеримо маркер для останнього елемента */}
                {lastGpsData && (
                    <Marker position={[lastGpsData.latitude, lastGpsData.longitude]}>
                        <Popup>
                            <span>Last GPS Data: {lastGpsData.timestamp}</span>
                        </Popup>
                    </Marker>
                )}
            </MapContainer>
        </Styles.wrapper>
    );
}
