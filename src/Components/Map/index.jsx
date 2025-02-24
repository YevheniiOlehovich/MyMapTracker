import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, Marker, Popup, Polyline, GeoJSON, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Styles from './styled';
import { google_map_api } from '../../helpres';
import { haversineDistance } from '../../helpres/distance';
import { fetchGpsData } from '../../store/locationSlice';
import { fetchFields, selectAllFields } from '../../store/fieldsSlice';
import { fetchCadastre, selectAllCadastre } from '../../store/cadastreSlice';

function FieldLabel({ field, zoomLevel }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const bounds = L.geoJSON(field).getBounds();
        setPosition(bounds.getCenter());
    }, [field]);

    if (!position) return null;

    return (
        <Marker position={position} icon={L.divIcon({
            className: 'field-label',
            html: zoomLevel >= 15
                ? `<div style="${Styles.fieldLabelContainer}">${field.properties.name} (${field.properties.area} га)</div>`
                : `<div style="${Styles.fieldLabelDot}"></div>`,
            iconSize: [0, 0]
        })}>
            <Popup>
                <div>
                    <strong>Назва:</strong> {field.properties.name} <br />
                    <strong>Ключ карти:</strong> {field.properties.mapkey} <br />
                    <strong>Площа:</strong> {field.properties.area} га <br />
                    <strong>Код КОАТУУ:</strong> {field.properties.koatuu} <br />
                    <strong>Примітка:</strong> {field.properties.note} <br />
                    <strong>Культура:</strong> {field.properties.culture} <br />
                    <strong>Сорт:</strong> {field.properties.sort} <br />
                    <strong>Дата:</strong> {field.properties.date} <br />
                    <strong>Урожай:</strong> {field.properties.crop} <br />
                    <strong>Філія:</strong> {field.properties.branch} <br />
                    <strong>Регіон:</strong> {field.properties.region}
                </div>
            </Popup>
        </Marker>
    );
}

function ZoomTracker({ setZoomLevel }) {
    useMapEvents({
        zoomend: (e) => {
            setZoomLevel(e.target.getZoom());
        },
    });

    return null;
}

export default function Map() {
    const dispatch = useDispatch();
    const gpsData = useSelector((state) => state.gps.data);
    const gpsStatus = useSelector((state) => state.gps.status);
    const gpsError = useSelector((state) => state.gps.error);
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const selectedImei = useSelector((state) => state.vehicle.imei);

    const fieldsData = useSelector(selectAllFields);
    const fieldsStatus = useSelector((state) => state.fields.status);
    const fieldsError = useSelector((state) => state.fields.error);

    const cadastreData = useSelector(selectAllCadastre);
    const cadastreStatus = useSelector((state) => state.cadastre.status);
    const cadastreError = useSelector((state) => state.cadastre.error);

    const mapType = useSelector((state) => state.map.type); // Отримання типу карти з Redux

    const [mapCenter, setMapCenter] = useState([50.68, 32.12]);
    const [zoomLevel, setZoomLevel] = useState(13);
    const [key, setKey] = useState(0); // Додаємо стан для ключа

    useEffect(() => {
        if (gpsStatus === 'idle') {
            dispatch(fetchGpsData());
        }
        if (fieldsStatus === 'idle') {
            dispatch(fetchFields());
        }
        if (cadastreStatus === 'idle') {
            dispatch(fetchCadastre());
        }
    }, [dispatch, gpsStatus, fieldsStatus, cadastreStatus]);

    useEffect(() => {
        setKey((prevKey) => prevKey + 1); // Оновлюємо ключ при зміні типу карти
    }, [mapType]);

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate || !selectedImei) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted && item.imei === selectedImei);
    }, [gpsData, selectedDate, selectedImei]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
            return validData.length > 0 ? validData[validData.length - 1] : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

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

    const renderTileLayer = () => {
        console.log('Selected map type:', mapType); // Логування вибраного типу карти
        switch (mapType) {
            case 'google':
                return (
                    <TileLayer
                        url={`https://{s}.google.com/maps/vt?lyrs=m&x={x}&y={y}&z={z}&key=${google_map_api}`}
                        subdomains={['mt0', 'mt1', 'mt2', 'mt3']}
                    />
                );
            case 'osm':
                return (
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        subdomains={['a', 'b', 'c']} // Додаємо піддомени
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    />
                );
            default:
                return null;
        }
    };

    return (
        <Styles.wrapper>
            <MapContainer
                key={key} // Додаємо ключ для примусового ререндеру
                center={mapCenter}
                zoom={zoomLevel}
                attributionControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                easeLinearity={0.8}
                style={{ height: '100vh', width: '100%' }}
            >
                {renderTileLayer()}

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

                {fieldsData.map((field, index) => (
                    <React.Fragment key={index}>
                        <GeoJSON data={field} style={Styles.fieldPolygonStyle} />
                        <FieldLabel field={field} zoomLevel={zoomLevel} />
                    </React.Fragment>
                ))}

                <ZoomTracker setZoomLevel={setZoomLevel} />
            </MapContainer>
        </Styles.wrapper>
    );
}