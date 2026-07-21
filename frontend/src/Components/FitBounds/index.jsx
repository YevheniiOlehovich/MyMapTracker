import { useEffect } from "react";
import { useMap } from "react-leaflet";
import L from "leaflet";

export default function FitBounds({ positions }) {
    const map = useMap();

    useEffect(() => {
        if (positions.length < 3) return;

        const bounds = L.latLngBounds(positions);

        map.fitBounds(bounds, {
            padding: [40, 40],
        });
    }, [map, positions]);

    return null;
}