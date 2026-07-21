import React, { useMemo } from "react";
import {
    Box,
    Typography,
} from "@mui/material";

import {
    MapContainer,
    TileLayer,
    Polygon,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";

import FitBounds from "../FitBounds";

export default function PolygonMapEditor({
    vertices,
}) {
    const polygonPositions = useMemo(() => {
        return vertices
            .filter(
                ({ lat, lng }) =>
                    lat !== "" &&
                    lng !== "" &&
                    !Number.isNaN(Number(lat)) &&
                    !Number.isNaN(Number(lng))
            )
            .map(({ lat, lng }) => [
                Number(lat),
                Number(lng),
            ]);
    }, [vertices]);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                flex: 1,
                minHeight: 0,
            }}
        >
            <Typography
                variant="h6"
                fontWeight={600}
                gutterBottom
            >
                Карта полігона
            </Typography>

            <Box
                sx={{
                    flex: 1,
                    minHeight: 0,
                    overflow: "hidden",
                    borderRadius: 2,
                }}
            >
                <MapContainer
                    center={[50.45, 30.52]}
                    zoom={17}
                    style={{
                        width: "100%",
                        height: "100%",
                    }}
                >
                    <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="&copy; OpenStreetMap contributors"
                    />

                    {polygonPositions.length >= 3 && (
                        <>
                            <Polygon
                                positions={polygonPositions}
                                pathOptions={{
                                    color: "#1976d2",
                                    weight: 3,
                                    fillColor: "#42a5f5",
                                    fillOpacity: 0.3,
                                }}
                            />

                            <FitBounds
                                positions={polygonPositions}
                            />
                        </>
                    )}
                </MapContainer>
            </Box>
        </Box>
    );
}