import React, { useEffect, useState } from 'react';
import { Marker, Popup, useMap } from 'react-leaflet';
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

    return (
        <Marker position={position} icon={L.divIcon({
            className: 'field-label',
            html: zoomLevel >= 15
                ? `<div style="${Styles.fieldLabelContainer}">${feature.properties.name} (${feature.properties.area} га)</div>`
                : `<div style="${Styles.fieldLabelDot}"></div>`,
            iconSize: [0, 0]
        })}>
            <Popup>{popupContent}</Popup>
        </Marker>
    );
}

export default FieldLabel;