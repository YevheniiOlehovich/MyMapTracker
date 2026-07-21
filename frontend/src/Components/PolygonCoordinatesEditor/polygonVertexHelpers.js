export const VERTEX_STATUS = {
    ORIGINAL: "original",
    ADDED: "added",
    EDITED: "edited",
};

export const updateVertexCoordinate =
    (id, field, value) =>
    (prev) =>
        prev.map((vertex) => {
            if (vertex.id !== id) return vertex;

            return {
                ...vertex,
                [field]: value,
                status:
                    vertex.status === VERTEX_STATUS.ORIGINAL
                        ? VERTEX_STATUS.EDITED
                        : vertex.status,
            };
        });

export const addVertex = (prev) => {
    if (!prev.length) {
        return [
            {
                id: crypto.randomUUID(),
                lng: "",
                lat: "",
                status: VERTEX_STATUS.ADDED,
            },
        ];
    }

    const last = prev.at(-1);

    return [
        ...prev,
        {
            id: crypto.randomUUID(),
            lng: last.lng,
            lat: last.lat,
            status: VERTEX_STATUS.ADDED,
        },
    ];
};

export const deleteVertex =
    (id) =>
    (prev) =>
        prev.filter((vertex) => vertex.id !== id);

export const getVertexRowColor = (status) => {
    switch (status) {
        case VERTEX_STATUS.ADDED:
            return "#e8f5e9";

        case VERTEX_STATUS.EDITED:
            return "#fff8e1";

        default:
            return "inherit";
    }
};

export const getVertexStatusChipProps = (status) => {
    switch (status) {
        case VERTEX_STATUS.ADDED:
            return {
                label: "Нова",
                color: "success",
                variant: "filled",
            };

        case VERTEX_STATUS.EDITED:
            return {
                label: "Змінена",
                color: "warning",
                variant: "filled",
            };

        default:
            return {
                label: "Оригінал",
                color: "default",
                variant: "outlined",
            };
    }
};