import React from "react";
import { Polygon, Popup } from "react-leaflet";

export default function PropertyLayer({ propertyData }) {

    console.log(propertyData)
    if (!propertyData?.length) return null;

    return (
        <>
            {propertyData.map((property) => {
                const { _id, geometry, owner, plot } = property;

                if (
                    geometry?.type !== "Polygon" ||
                    !geometry?.coordinates?.length
                ) {
                    return null;
                }

                return (
                    <Polygon
                        key={_id}
                        positions={geometry.coordinates[0].map(
                            ([lng, lat]) => [lat, lng]
                        )}
                        color="#006600"
                        fillColor="#00cc00"
                        fillOpacity={0.3}
                    >
                        <Popup>
                            <div>
                                <strong>
                                    {owner?.name || "Власність"}
                                </strong>

                                <br />

                                {plot?.cadnum && (
                                    <>
                                        Кадастровий номер: {plot.cadnum}
                                        <br />
                                    </>
                                )}

                                {plot?.area && (
                                    <>
                                        Площа: {plot.area} га
                                        <br />
                                    </>
                                )}

                                {owner?.address && (
                                    <>
                                        Адреса: {owner.address}
                                        <br />
                                    </>
                                )}

                                {owner?.phone && (
                                    <>
                                        Телефон: {owner.phone}
                                        <br />
                                    </>
                                )}
                            </div>
                        </Popup>
                    </Polygon>
                );
            })}
        </>
    );
}