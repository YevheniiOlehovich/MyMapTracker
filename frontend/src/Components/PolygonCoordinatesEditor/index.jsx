import React from "react";
import {
    Box,
    Button,
    Chip,
    IconButton,
    Paper,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
    TextField,
    Typography,
} from "@mui/material";

import DeleteIcon from "@mui/icons-material/Delete";
import AddIcon from "@mui/icons-material/Add";

import {
    addVertex,
    deleteVertex,
    updateVertexCoordinate,
    getVertexRowColor,
    getVertexStatusChipProps,
} from "./polygonVertexHelpers";

export default function PolygonCoordinatesEditor({
    vertices,
    setVertices,
}) {
    const handleCoordinateChange =
        (id, field) => (e) => {
            setVertices(
                updateVertexCoordinate(
                    id,
                    field,
                    e.target.value
                )
            );
        };

    const handleAddPoint = () => {
        setVertices(addVertex);
    };

    const handleDeletePoint = (id) => {
        if (vertices.length <= 3) return;

        setVertices(deleteVertex(id));
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                height: "100%",
            }}
        >
            <Typography
                variant="h6"
                gutterBottom
                fontWeight={600}
            >
                Координати полігона
            </Typography>

            <TableContainer
                component={Paper}
                sx={{
                    flex: 1,
                }}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell width={60}>№</TableCell>
                            <TableCell>Longitude</TableCell>
                            <TableCell>Latitude</TableCell>
                            <TableCell width={120}>
                                Статус
                            </TableCell>
                            <TableCell
                                width={70}
                                align="center"
                            >
                                Дія
                            </TableCell>
                        </TableRow>
                    </TableHead>

                    <TableBody>
                        {vertices.map((point, index) => (
                            <TableRow
                                key={point.id}
                                sx={{
                                    bgcolor: getVertexRowColor(
                                        point.status
                                    ),
                                }}
                            >
                                <TableCell>
                                    {index + 1}
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={point.lng}
                                        onChange={handleCoordinateChange(
                                            point.id,
                                            "lng"
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <TextField
                                        fullWidth
                                        size="small"
                                        type="number"
                                        value={point.lat}
                                        onChange={handleCoordinateChange(
                                            point.id,
                                            "lat"
                                        )}
                                    />
                                </TableCell>

                                <TableCell>
                                    <Chip
                                        size="small"
                                        {...getVertexStatusChipProps(
                                            point.status
                                        )}
                                    />
                                </TableCell>

                                <TableCell align="center">
                                    <IconButton
                                        color="error"
                                        disabled={
                                            vertices.length <= 3
                                        }
                                        onClick={() =>
                                            handleDeletePoint(
                                                point.id
                                            )
                                        }
                                    >
                                        <DeleteIcon />
                                    </IconButton>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </TableContainer>

            <Button
                sx={{ mt: 2 }}
                variant="outlined"
                startIcon={<AddIcon />}
                onClick={handleAddPoint}
            >
                Додати вершину
            </Button>
        </Box>
    );
}