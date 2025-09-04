// components/PropertyLayer.jsx
import React from 'react';
import { Polygon, Popup } from 'react-leaflet';

export default function PropertyLayer({ propertyData, zoomLevel }) {
    if (!propertyData?.length) return null;

    return (
        <>
            {propertyData.map((property, index) => {
                const { geometry, properties } = property;

                if (geometry?.type === 'Polygon' && geometry.coordinates?.length) {
                    return (
                        <Polygon
                            key={`property-${index}`}
                            positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                            color="#006600"
                            fillColor="#00cc00"
                            fillOpacity={0.3}
                        >
                            <Popup>
                                <div>
                                    <strong>{properties?.name || 'Власність'}</strong><br />
                                    {properties?.ikn && <>Кадастр: {properties.ikn}<br /></>}
                                    {properties?.owner && <>Власник: {properties.owner}<br /></>}
                                    {properties?.area && <>Площа: {properties.area} га</>}
                                </div>
                            </Popup>
                        </Polygon>
                    );
                }

                return null;
            })}
        </>
    );
}
