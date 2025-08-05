import React, { useMemo } from 'react';
import { MapContainer, TileLayer, Polygon, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import { center as defaultCenter } from '../../helpres';
import L from 'leaflet';

const CenterMap = ({ coordinates }) => {
    const map = useMap();

    useMemo(() => {
        if (coordinates?.length) {
        const bounds = L.latLngBounds(coordinates);
        map.flyToBounds(bounds, { padding: [30, 30] });
        }
    }, [coordinates, map]);

    return null;
};

const MapBlock = ({
    field,
    fieldsList = [],
    height = '400px',
    zoom = 15,
    tileUrl = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution = '&copy; OpenStreetMap contributors',
    options = {},
    }) => {
    // 1. Шукаємо повний об'єкт поля по _id
    const resolvedField = useMemo(() => {
        if (!field?.value) return null;
        return fieldsList.find(f => f._id === field.value) || null;
    }, [field, fieldsList]);

    // 2. Обробляємо координати
    const coordinates = useMemo(() => {
        if (
        resolvedField?.geometry?.type === 'Polygon' &&
        resolvedField.geometry.coordinates?.[0]
        ) {
        return resolvedField.geometry.coordinates[0].map(
            ([lng, lat]) => [lat, lng]
        );
        }
        return null;
    }, [resolvedField]);

    return (
        <div style={{ height }}>
        <MapContainer
            center={defaultCenter}
            zoom={zoom}
            style={{
            height: '100%',
            width: '100%',
            borderRadius: '8px',
            zIndex: 1000,
            }}
            zoomControl={true}
            scrollWheelZoom={true}
            doubleClickZoom={false}
            dragging={true}
            attributionControl={false}
            {...options}
        >
            <TileLayer url={tileUrl} attribution={attribution} />
            {coordinates && (
            <>
                <Polygon positions={coordinates} color="blue" />
                <CenterMap coordinates={coordinates} />
            </>
            )}
        </MapContainer>
        </div>
    );
};

export default MapBlock;
