// components/FieldsLayer.jsx
import React from 'react';
import { Polygon } from 'react-leaflet';
import FieldLabel from '../FieldLabel';

export default function FieldsLayer({ fieldsData, zoomLevel, activeFieldId, onEditField }) {
    if (!fieldsData?.length) return null;

    return (
        <>
            {fieldsData.map((field, index) =>
                field.visible ? (
                    <React.Fragment key={index}>
                        <FieldLabel
                            feature={field}
                            zoomLevel={zoomLevel}
                            type="field"
                            onOpenModal={onEditField}
                        />

                        {/* Приклад закоментованого коду для можливих future plots */}
                        
                        {/* {field.matching_plots?.map((plot, plotIndex) => (
                            <Polygon
                                key={`matching-${index}-${plotIndex}`}
                                positions={plot.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                color="red"
                            />
                        ))}

                        {field.not_processed?.map((plot, plotIndex) => (
                            <Polygon
                                key={`not-processed-${index}-${plotIndex}`}
                                positions={plot.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                color="green"
                            />
                        ))} */}
                       

                        <Polygon
                            key={`${field._id}-${activeFieldId}`}
                            positions={field.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                            color={field._id === activeFieldId ? 'green' : 'blue'}
                            fillColor={field._id === activeFieldId ? 'green' : 'blue'}
                            fillOpacity={0.2}
                        />
                    </React.Fragment>
                ) : null
            )}
        </>
    );
}
