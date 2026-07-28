import React from "react";
import { useSelector } from "react-redux";
import { Polygon, Popup } from "react-leaflet";

import {
    selectShowOwnPlots,
    selectShowLadaRentPlots,
    selectShowKrokRentPlots,
} from "../../store/layersList";

const plotStyles = {
    own: {
        "КРОК": {
            color: "#1565C0",
            fillColor: "#64B5F6",
        },
        "ЛАДА": {
            color: "#2E7D32",
            fillColor: "#81C784",
        },
    },

    rent: {
        "КРОК": {
            color: "#EF6C00",
            fillColor: "#FFB74D",
        },
        "ЛАДА": {
            color: "#C62828",
            fillColor: "#EF5350",
        },
    },

    default: {
        color: "#616161",
        fillColor: "#BDBDBD",
    },
};

export default function PlotsLayer({ plotsData }) {
    const showOwnPlots = useSelector(selectShowOwnPlots);
    const showLadaRentPlots = useSelector(selectShowLadaRentPlots);
    const showKrokRentPlots = useSelector(selectShowKrokRentPlots);

    if (!plotsData?.length) return null;

    const filteredPlots = plotsData.filter((plotItem) => {
        if (
            plotItem.ownershipType === "own" &&
            !showOwnPlots
        ) {
            return false;
        }

        if (
            plotItem.ownershipType === "rent" &&
            plotItem.source === "ЛАДА" &&
            !showLadaRentPlots
        ) {
            return false;
        }

        if (
            plotItem.ownershipType === "rent" &&
            plotItem.source === "КРОК" &&
            !showKrokRentPlots
        ) {
            return false;
        }

        return true;
    });

    return (
        <>
            {filteredPlots.map((plotItem) => {
                const {
                    _id,
                    ownershipType,
                    source,
                    owner,
                    plot,
                    agreement,
                    geometry,
                } = plotItem;

                if (
                    geometry?.type !== "Polygon" ||
                    !geometry.coordinates?.length
                ) {
                    return null;
                }

                const style =
                    plotStyles?.[ownershipType]?.[source] ||
                    plotStyles.default;

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
                            <div style={{ minWidth: 300 }}>
                                <h3
                                    style={{
                                        margin: "0 0 8px",
                                        color: style.color,
                                    }}
                                >
                                    {owner?.name || "-"}
                                </h3>

                                <div
                                    style={{
                                        fontWeight: "bold",
                                        marginBottom: 10,
                                    }}
                                >
                                    {ownershipType === "own"
                                        ? "Власність"
                                        : "Оренда"}{" "}
                                    • {source}
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

                                {ownershipType === "rent" && (
                                    <>
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
                                    </>
                                )}

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