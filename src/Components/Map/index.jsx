import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGpsData } from '../../store/locationSlice'; // Імпортуємо thunk для отримання GPS
import { MapContainer, TileLayer, Polygon, Popup, Marker } from 'react-leaflet';
import Styles from './styled';
import { google_map_api } from '../../helpres';
import { calendarSlice } from '../../store/calendarSlice';

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

    // Логування GPS даних
    useEffect(() => {
        if (gpsStatus === 'succeeded') {
            console.log('GPS Data:', gpsData); // Вивести дані в консоль
        } else if (gpsStatus === 'failed') {
            console.log('Error fetching GPS data:', gpsError);
        }
    }, [gpsData, gpsStatus, gpsError]);

    // Дані для полігонів (ви можете додати ці дані до стану з GPS)
    const polygonsData = [
        {
            coordinates: [
                [50.68, 32.12],
                [50.70, 32.15],
                [50.67, 32.18],
                [50.68, 32.12],
            ],
            name: 'Полігон 1',
            description: [
                'Перша строчка тексту',
                'Друга строчка тексту',
                'Третя строчка тексту',
            ],
            color: 'blue',
        },
        {
            coordinates: [
                [50.65, 32.10],
                [50.66, 32.14],
                [50.63, 32.16],
                [50.65, 32.10],
            ],
            name: 'Полігон 2',
            description: [
                'Це опис для другого полігону',
                'Додаткова інформація',
                'Заключна строчка тексту',
            ],
            color: 'green',
        },
    ];

    // Логування вибраної дати
    useEffect(() => {
        console.log('Selected Date:', selectedDate); // Логування дати з календаря
    }, [selectedDate]);

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
                {/* Рендеримо полігони */}
                {polygonsData.map((polygon, index) => (
                    <Polygon
                        key={index}
                        positions={polygon.coordinates}
                        pathOptions={{ color: polygon.color }}
                    >
                        <Popup>
                            <div>
                                <h3>{polygon.name}</h3>
                                {polygon.description.map((line, i) => (
                                    <p key={i}>{line}</p>
                                ))}
                            </div>
                        </Popup>
                    </Polygon>
                ))}
                {/* Додаємо маркер */}
            </MapContainer>
        </Styles.wrapper>
    );
}
