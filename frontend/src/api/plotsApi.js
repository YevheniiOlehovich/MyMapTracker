import apiRoutes from "../helpres/ApiRoutes";

// Отримати всі ділянки
export const fetchPlots = async () => {
    const response = await fetch(apiRoutes.getPlots);

    if (!response.ok) {
        throw new Error("Failed to fetch plots");
    }

    return response.json();
};

// Додати одну або масив
export const addPlotApi = async (data) => {
    const response = await fetch(apiRoutes.addPlot, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to add plot");
    }

    return response.json();
};

// Оновити
export const updatePlotApi = async ({ id, data }) => {
    const response = await fetch(
        apiRoutes.updatePlot(id),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update plot");
    }

    return response.json();
};

// Видалити
export const deletePlotApi = async (id) => {
    const response = await fetch(
        apiRoutes.deletePlot(id),
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete plot");
    }

    return response.json();
};