// components/CadastreLayer.jsx
import React from 'react';
import FieldLabel from '../FieldLabel';

export default function CadastreLayer({ cadastreData, zoomLevel }) {
    if (!cadastreData?.length) return null;

    return (
        <>
            {cadastreData.map((cadastre, index) => (
                <FieldLabel
                    key={index}
                    feature={cadastre}
                    zoomLevel={zoomLevel}
                    type="cadastre"
                />
            ))}
        </>
    );
}
