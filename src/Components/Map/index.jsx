import React, { useEffect, useMemo, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, Marker, Popup, Polyline, GeoJSON, TileLayer, useMap, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import Styles from './styled';
import { haversineDistance } from '../../helpres/distance'; // Імпорт функції для обчислення відстані
import { getTileLayerConfig } from '../../helpres/tileLayerHelper'; // Імпорт хелпера
import { fetchGpsData } from '../../store/locationSlice';
import { fetchFields, selectAllFields } from '../../store/fieldsSlice';
import { fetchCadastre, selectAllCadastre } from '../../store/cadastreSlice';
import { fetchGeozone, selectAllGeozone } from '../../store/geozoneSlice';
import { selectShowFields, selectShowCadastre, selectShowGeozones } from '../../store/layersList'; // Імпорт селекторів для керування шарами
import { selectMapCenter, selectZoomLevel, setZoomLevel, setMapCenter } from '../../store/mapCenterSlice'; // Імпорт селекторів і дій для керування центром карти
import { setImei, toggleShowTrack } from '../../store/vehicleSlice'; // Імпорт дій для керування транспортом
import MapCenterUpdater from '../MapCenterUpdater'; // Імпорт компонента для оновлення центру карти

function FieldLabel({ feature, zoomLevel, type }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const bounds = L.geoJSON(feature).getBounds();
        setPosition(bounds.getCenter());
    }, [feature]);

    if (!position) return null;

    const popupContent = type === 'field' ? (
        <div>
            <strong>Назва:</strong> {feature.properties.name} <br />
            <strong>Ключ карти:</strong> {feature.properties.mapkey} <br />
            <strong>Площа:</strong> {feature.properties.area} га <br />
            <strong>Код КОАТУУ:</strong> {feature.properties.koatuu} <br />
            <strong>Примітка:</strong> {feature.properties.note} <br />
            <strong>Культура:</strong> {feature.properties.culture} <br />
            <strong>Сорт:</strong> {feature.properties.sort} <br />
            <strong>Дата:</strong> {feature.properties.date} <br />
            <strong>Урожай:</strong> {feature.properties.crop} <br />
            <strong>Філія:</strong> {feature.properties.branch} <br />
            <strong>Регіон:</strong> {feature.properties.region}
        </div>
    ) : (
        <div>
            <strong>Назва:</strong> {feature.properties.name} <br />
            <strong>Площа:</strong> {feature.properties.area} га
        </div>
    );

    return type === 'field' ? (
        <Marker position={position} icon={L.divIcon({
            className: 'field-label',
            html: zoomLevel >= 15
                ? `<div style="${Styles.fieldLabelContainer}">${feature.properties.name} (${feature.properties.area} га)</div>`
                : `<div style="${Styles.fieldLabelDot}"></div>`,
            iconSize: [0, 0]
        })}>
            <Popup>{popupContent}</Popup>
        </Marker>
    ) : (
        <Popup position={position}>{popupContent}</Popup>
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
    const showTrack = useSelector((state) => state.vehicle.showTrack); // Додаємо стан для відображення треку

    const fieldsData = useSelector(selectAllFields);
    const fieldsStatus = useSelector((state) => state.fields.status);
    const fieldsError = useSelector((state) => state.fields.error);

    const cadastreData = useSelector(selectAllCadastre);
    const cadastreStatus = useSelector((state) => state.cadastre.status);
    const cadastreError = useSelector((state) => state.cadastre.error);

    const geozoneData = useSelector(selectAllGeozone);
    const geozoneStatus = useSelector((state) => state.geozone.status);
    const geozoneError = useSelector((state) => state.geozone.error);

    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);

    const mapType = useSelector((state) => state.map.type); // Отримання типу карти з Redux
    const mapCenter = useSelector(selectMapCenter); // Отримання центру карти з Redux
    const zoomLevel = useSelector(selectZoomLevel); // Отримання рівня зуму з Redux

    const [key, setKey] = useState(0); // Додаємо стан для ключа

    useEffect(() => {
        console.log('Map center updated:', mapCenter); // Логування центру карти
    }, [mapCenter]);

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
        if (geozoneStatus === 'idle') {
            dispatch(fetchGeozone());
        }
    }, [dispatch, gpsStatus, fieldsStatus, cadastreStatus, geozoneStatus]);

    useEffect(() => {
        setKey((prevKey) => prevKey + 1); // Оновлюємо ключ при зміні типу карти
    }, [mapType]);

    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
            return validData.length > 0 ? { ...validData[validData.length - 1], imei: item.imei } : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

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

    const tileLayerConfig = getTileLayerConfig(mapType);

    const handleMarkerClick = (imei) => {
        dispatch(setImei(imei));
        dispatch(toggleShowTrack());
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
                {tileLayerConfig && (
                    <TileLayer
                        url={tileLayerConfig.url}
                        subdomains={tileLayerConfig.subdomains}
                        attribution={tileLayerConfig.attribution}
                    />
                )}

                {showTrack && routeCoordinates.length > 0 && (
                    <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
                )}

                {lastGpsPoints.map((point, index) => (
                    <Marker key={index} position={[point.latitude, point.longitude]} eventHandlers={{ click: () => handleMarkerClick(point.imei) }}>
                        <Popup>
                            <strong>Остання точка</strong> <br />
                            Час: {new Date(point.timestamp).toLocaleString()} <br />
                            IMEI: {point.imei} <br />
                            Пройдено: {totalDistance} км
                        </Popup>
                    </Marker>
                ))}

                {showFields && fieldsData.map((field, index) => (
                    <React.Fragment key={index}>
                        <GeoJSON data={field} style={Styles.fieldPolygonStyle} />
                        <FieldLabel feature={field} zoomLevel={zoomLevel} type="field" />
                    </React.Fragment>
                ))}

                {showCadastre && cadastreData.map((cadastre, index) => (
                    <GeoJSON key={index} data={cadastre} style={Styles.cadastrePolygonStyle} />
                ))}

                {showGeozones && geozoneData.map((geozone, index) => (
                    <React.Fragment key={index}>
                        <GeoJSON data={geozone} style={Styles.geozonePolygonStyle} />
                        <FieldLabel feature={geozone} zoomLevel={zoomLevel} type="geozone" />
                    </React.Fragment>
                ))}

                <ZoomTracker setZoomLevel={(zoom) => dispatch(setZoomLevel(zoom))} />
                <MapCenterUpdater /> {/* Додаємо компонент для оновлення центру карти */}
            </MapContainer>
        </Styles.wrapper>
    );
}