// components/Rent2026Layer.jsx

import React from "react";
import { Polygon, Popup } from "react-leaflet";

const sourceStyles = {
    "КРОК": {
        color: "#1565C0",
        fillColor: "#64B5F6",
    },

    "ЛАДА": {
        color: "#db4c4c",
        fillColor: "#ff0000",
    },

    default: {
        color: "#616161",
        fillColor: "#BDBDBD",
    },
};

export default function Rent2026Layer({ rentData }) {
    if (!rentData?.length) return null;

    return (
        <>
            {rentData.map((rent) => {
                const {
                    _id,
                    source,
                    owner,
                    plot,
                    agreement,
                    geometry,
                } = rent;

                if (
                    geometry?.type !== "Polygon" ||
                    !geometry.coordinates?.length
                ) {
                    return null;
                }

                const style =
                    sourceStyles[source] ||
                    sourceStyles.default;

                return (
                    <Polygon
                        key={_id}
                        positions={geometry.coordinates[0].map(
                            ([lng, lat]) => [lat, lng]
                        )}
                        color={style.color}
                        fillColor={style.fillColor}
                        fillOpacity={0.35}
                        weight={2}
                    >
                        <Popup>
                            <div style={{ minWidth: 280 }}>
                                <h3
                                    style={{
                                        margin: "0 0 8px",
                                        color: style.color,
                                    }}
                                >
                                    {owner?.name}
                                </h3>

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: 10,
                                    }}
                                >
                                    {source}
                                </div>

                                <hr />

                                <strong>Кадастровий номер:</strong>
                                <br />
                                {plot?.cadnum || "-"}
                                <br />
                                <br />

                                <strong>Тип угідь:</strong>
                                <br />
                                {plot?.plotType || "-"}
                                <br />
                                <br />

                                <strong>Площа:</strong>
                                <br />
                                {plot?.area ?? "-"} га
                                <br />
                                <br />

                                <strong>Нормативна оцінка:</strong>
                                <br />
                                {plot?.normativeValuation ?? "-"} грн
                                <br />
                                <br />

                                <strong>Договір:</strong>
                                <br />
                                {agreement?.contractNumber || "-"}
                                <br />
                                <br />

                                <strong>Дата підписання:</strong>
                                <br />
                                {agreement?.signDate || "-"}
                                <br />
                                <br />

                                <strong>Закінчення договору:</strong>
                                <br />
                                {agreement?.endDate || "-"}
                                <br />
                                <br />

                                <strong>Орендна ставка:</strong>
                                <br />
                                {agreement?.rentPercent ?? "-"} %
                                <br />
                                <br />

                                <strong>Телефон:</strong>
                                <br />
                                {owner?.phone || "-"}
                            </div>
                        </Popup>
                    </Polygon>
                );
            })}
        </>
    );
}