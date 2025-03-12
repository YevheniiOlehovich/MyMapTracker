import React, { useEffect, useState } from 'react';
import { Marker, GeoJSON, useMap } from 'react-leaflet';
import L from 'leaflet';
import Styles from './styled';

function FieldLabel({ feature, zoomLevel, type, onOpenModal }) {
    const map = useMap();
    const [position, setPosition] = useState(null);

    useEffect(() => {
        const bounds = L.geoJSON(feature).getBounds();
        setPosition(bounds.getCenter());
    }, [feature]);

    if (!position) return null;

    const style = {
        color: type === 'field' ? 'green' : 'red',
        weight: 2,
        opacity: 1,
        fillOpacity: 0.1
    };

    const handleMarkerClick = () => {
        if (type === 'field') {
            onOpenModal(feature);
        }
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
            })} eventHandlers={type === 'field' ? { click: handleMarkerClick } : {}}>
            </Marker>
        </>
    );
}

export default FieldLabel;