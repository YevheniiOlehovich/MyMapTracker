import React from "react";
import {
    Box,
    Paper,
    Typography,
} from "@mui/material";

import PolygonCoordinatesEditor from "../PolygonCoordinatesEditor";
import PolygonMapEditor from "../PolygonMapEditor";

export default function LandPlotGeometryPanel({
    vertices,
    setVertices,
}) {
    return (
        <Box
            sx={{
                width: "50%",
                display: "flex",
                flexDirection: "column",
                gap: 2,
                p: 2,
                bgcolor: "#f5f5f5",
                overflow: "hidden",
            }}
        >
            {/* ================= COORDINATES ================= */}

            <Paper
                elevation={2}
                sx={{
                    height: 320,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                <PolygonCoordinatesEditor
                    vertices={vertices}
                    setVertices={setVertices}
                />
            </Paper>

            {/* ================= MAP ================= */}

            <Paper
                elevation={2}
                sx={{
                    flex: 1,
                    p: 2,
                    display: "flex",
                    flexDirection: "column",
                    minHeight: 0,
                    overflow: "hidden",
                }}
            >
                <PolygonMapEditor
                    vertices={vertices}
                    setVertices={setVertices}
                />
            </Paper>
        </Box>
    );
}