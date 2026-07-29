import React from "react";
import { Polygon, Popup } from "react-leaflet";

export default function CadastreLayer({ cadastreData }) {
    if (!cadastreData?.length) {
        return null;
    }

    return (
        <>
            {cadastreData.map((feature, index) => {
                const { _id, geometry, properties = {} } = feature;

                if (
                    geometry?.type !== "Polygon" ||
                    !geometry.coordinates?.length
                ) {
                    return null;
                }

                return (
                    <Polygon
                        key={_id ?? index}
                        positions={geometry.coordinates[0].map(
                            ([lng, lat]) => [lat, lng]
                        )}
                        color="#1976d2"
                        fillColor="#64b5f6"
                        fillOpacity={0.2}
                        weight={1.5}
                    >
                        <Popup>
                            <div style={{ minWidth: 300 }}>
                                <h3>{properties.cadnum ?? "-"}</h3>

                                <strong>Площа:</strong><br />
                                {properties.area ?? "-"} га
                                <br /><br />

                                <strong>Кадастровий номер:</strong><br />
                                {properties.cadnum ?? "-"}
                                <br /><br />

                                <strong>Призначення:</strong><br />
                                {properties.purpose ?? "-"}
                                <br /><br />

                                <strong>Власник:</strong><br />
                                {properties.owner ?? "-"}
                            </div>
                        </Popup>
                    </Polygon>
                );
            })}
        </>
    );
}