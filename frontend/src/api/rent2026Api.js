import apiRoutes from "../helpres/ApiRoutes";

// Отримати всі ділянки
export const fetchRent2026 = async () => {
    const response = await fetch(apiRoutes.getRent2026);

    if (!response.ok) {
        throw new Error("Failed to fetch rent_2026");
    }

    return response.json();
};

// Додати одну або масив
export const addRent2026Api = async (data) => {
    const response = await fetch(apiRoutes.addRent2026, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to add rent_2026");
    }

    return response.json();
};

// Оновити
export const updateRent2026Api = async ({ id, data }) => {
    const response = await fetch(
        apiRoutes.updateRent2026(id),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update rent_2026");
    }

    return response.json();
};

// Видалити
export const deleteRent2026Api = async (id) => {
    const response = await fetch(
        apiRoutes.deleteRent2026(id),
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete rent_2026");
    }

    return response.json();
};