// components/RentLayer.jsx
import React from 'react';
import { Polygon, Popup } from 'react-leaflet';

export default function RentLayer({ rentData }) {
    if (!rentData?.length) return null;

    return (
        <>
            {rentData.map((rent, index) => {
                const { geometry, properties } = rent;

                if (geometry?.type === 'Polygon' && geometry.coordinates?.length) {
                    return (
                        <Polygon
                            key={`rent-${index}`}
                            positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                            color="#003366"
                            fillColor="#0077cc"
                            fillOpacity={0.3}
                        >
                            <Popup>
                                <div>
                                    <strong>{properties?.name || 'Орендар'}</strong><br />
                                    {properties?.ikn && <>Кадастр: {properties.ikn}<br /></>}
                                    {properties?.lessor && <>Орендодавець: {properties.lessor}<br /></>}
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
