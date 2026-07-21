export const buildVerticesFromGeometry = (geometry) => {
    const coords = geometry?.coordinates?.[0] || [];

    if (!coords.length) return [];

    const polygon =
        coords.length > 1 &&
        coords[0][0] === coords.at(-1)[0] &&
        coords[0][1] === coords.at(-1)[1]
            ? coords.slice(0, -1)
            : coords;

    return polygon.map(([lng, lat]) => ({
        id: crypto.randomUUID(),
        lng,
        lat,
        status: "original",
    }));
};

export const buildGeometryFromVertices = (vertices) => {
    if (vertices.length < 3) {
        return {
            type: "Polygon",
            coordinates: [[]],
        };
    }

    const coordinates = vertices.map((v) => [
        Number(v.lng),
        Number(v.lat),
    ]);

    return {
        type: "Polygon",
        coordinates: [
            [
                ...coordinates,
                [...coordinates[0]],
            ],
        ],
    };
};