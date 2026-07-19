import React from "react";
import FieldLabel from "../FieldLabel";
import { useRent2026Data } from "../../hooks/useRent2026";

export default function LandPlotsLayer({ zoomLevel }) {
    const {
        data: rent2026Data = [],
        isLoading,
        isError,
    } = useRent2026Data();

    if (isLoading || isError || !rent2026Data.length) {
        return null;
    }

    return (
        <>
            {rent2026Data.map((item) => {
                if (
                    !item.geometry ||
                    !item.geometry.type ||
                    !item.geometry.coordinates?.length
                ) {
                    return null;
                }

                const feature = {
                    type: "Feature",
                    geometry: item.geometry,
                    properties: {
                        ...item,
                        cadnum: item.plot?.cadnum,
                        area: item.plot?.area,
                        owner: item.owner,
                        source: item.source,
                        name: `${item.plot?.cadnum || "Без номера"} | ${
                            item.plot?.area ?? 0
                        } га`,
                    },
                };

                return (
                    <FieldLabel
                        key={item._id}
                        feature={feature}
                        zoomLevel={zoomLevel}
                        type="cadastre"
                    />
                );
            })}
        </>
    );
}