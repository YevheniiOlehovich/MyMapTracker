import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap, GeoJSON } from 'react-leaflet';
import L from 'leaflet';
import Styles from './styled';

function FieldLabel({ feature, zoomLevel, type }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const bounds = L.geoJSON(feature).getBounds();
        setPosition(bounds.getCenter());
    }, [feature]);

    if (!position) return null;

    const popupContent = (
        <div>
            <strong>Назва:</strong> {feature.properties.name} <br />
            <strong>Площа:</strong> {feature.properties.area} га
        </div>
    );

    const style = {
        color: type === 'field' ? 'green' : 'red',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.1
    };

    return (
        <>
            <GeoJSON data={feature} style={style} />
            <Marker position={position} icon={L.divIcon({
                className: 'field-label',
                html: zoomLevel >= 15
                    ? `<div style="${Styles.fieldLabelContainer}">${feature.properties.name} (${feature.properties.area} га)</div>`
                    : `<div style="${Styles.fieldLabelDot}"></div>`,
                iconSize: [0, 0]
            })}>
                <Popup>{popupContent}</Popup>
            </Marker>
        </>
    );
}

export default FieldLabel;