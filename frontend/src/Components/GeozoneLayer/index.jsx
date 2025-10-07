// components/GeozoneLayer.jsx
import React from 'react';
import FieldLabel from '../FieldLabel';

export default function GeozoneLayer({ geozoneData, zoomLevel }) {
    if (!geozoneData?.length) return null;

    return (
        <>
            {geozoneData.map((geozone, index) => (
                <FieldLabel
                    key={index}
                    feature={geozone}
                    zoomLevel={zoomLevel}
                    type="geozone"
                />
            ))}
        </>
    );
}
