// components/UnitsLayer.jsx
import React from 'react';
import { Polygon, Marker, Popup } from 'react-leaflet';
import L from 'leaflet';

export default function UnitsLayer({ unitsData }) {
    if (!unitsData?.length) return null;

    return (
        <>
            {unitsData.map((unit, index) => {
                const { geometry, properties } = unit;

                if (geometry?.type === 'Polygon') {
                    return (
                        <Polygon
                            key={`unit-${index}`}
                            positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                            color="red"
                            fillColor="red"
                            fillOpacity={0.2}
                        >
                            <Popup>
                                <strong>{properties?.name || 'Unit'}</strong><br />
                                {properties?.area && `Площа: ${properties.area}`}<br />
                                {properties?.branch && `Філія: ${properties.branch}`}
                            </Popup>
                        </Polygon>
                    );
                }

                if (geometry?.type === 'Point') {
                    return (
                        <Marker
                            key={`unit-marker-${index}`}
                            position={[geometry.coordinates[1], geometry.coordinates[0]]}
                            icon={L.divIcon({
                                className: 'custom-unit-icon',
                                html: `<div style="width: 16px; height: 16px; background-color: red; border-radius: 50%; border: 2px solid white;"></div>`,
                            })}
                        >
                            <Popup>
                                <strong>{properties?.name || 'Unit'}</strong><br />
                                {properties?.radius && `Радіус: ${properties.radius}`}
                            </Popup>
                        </Marker>
                    );
                }

                return null;
            })}
        </>
    );
}
