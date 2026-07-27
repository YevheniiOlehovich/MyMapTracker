// import apiRoutes from '../helpres/ApiRoutes';

// // ✅ Отримати всі ділянки у власності
// export const fetchProperties = async () => {
//     const response = await fetch(apiRoutes.getProperties);
//     if (!response.ok) {
//         throw new Error('Failed to fetch properties');
//     }
//     const data = await response.json();
//     return data;
// };

// // ✅ Додати нову або масив ділянок у власності
// export const addPropertyApi = async (propertyData) => {
//     const response = await fetch(apiRoutes.addProperty, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(propertyData),
//     });

//     if (!response.ok) {
//         throw new Error('Failed to add property(ies)');
//     }

//     return response.json();
// };

// // ✅ Оновити ділянку у власності за ID
// export const updatePropertyApi = async (propertyData) => {
//     const response = await fetch(apiRoutes.updateProperty(propertyData._id), {
//         method: 'PUT',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify(propertyData),
//     });

//     if (!response.ok) {
//         throw new Error('Failed to update property');
//     }

//     return response.json();
// };

// // ✅ Видалити ділянку у власності за ID
// export const deletePropertyApi = async (propertyId) => {
//     const response = await fetch(apiRoutes.deleteProperty(propertyId), {
//         method: 'DELETE',
//     });

//     if (!response.ok) {
//         throw new Error('Failed to delete property');
//     }

//     return response.json();
// };











import apiRoutes from "../helpres/ApiRoutes";

// ======================
// Отримати всі ділянки
// ======================

export const fetchProperties = async () => {
    const response = await fetch(apiRoutes.getProperties);

    if (!response.ok) {
        throw new Error("Failed to fetch property");
    }

    return response.json();
};

// ======================
// Додати одну або масив
// ======================

export const addPropertyApi = async (data) => {
    const response = await fetch(apiRoutes.addProperty, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
    });

    if (!response.ok) {
        throw new Error("Failed to add property");
    }

    return response.json();
};

// ======================
// Оновити
// ======================

export const updatePropertyApi = async ({ id, data }) => {
    const response = await fetch(
        apiRoutes.updateProperty(id),
        {
            method: "PUT",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify(data),
        }
    );

    if (!response.ok) {
        throw new Error("Failed to update property");
    }

    return response.json();
};

// ======================
// Видалити
// ======================

export const deletePropertyApi = async (id) => {
    const response = await fetch(
        apiRoutes.deleteProperty(id),
        {
            method: "DELETE",
        }
    );

    if (!response.ok) {
        throw new Error("Failed to delete property");
    }

    return response.json();
};