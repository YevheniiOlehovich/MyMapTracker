import apiRoutes from '../helpres/ApiRoutes';

// ✅ Отримати всі орендовані ділянки
export const fetchRents = async () => {
    const response = await fetch(apiRoutes.getRents);
    if (!response.ok) {
        throw new Error('Failed to fetch rents');
    }
    const data = await response.json();
    return data;
};

// ✅ Додати нову або масив орендованих ділянок
export const addRentApi = async (rentData) => {
    const response = await fetch(apiRoutes.addRent, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rentData),
    });

    if (!response.ok) {
        throw new Error('Failed to add rent(s)');
    }

    return response.json();
};

// ✅ Оновити орендовану ділянку за ID
export const updateRentApi = async (rentData) => {
    const response = await fetch(apiRoutes.updateRent(rentData._id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(rentData),
    });

    if (!response.ok) {
        throw new Error('Failed to update rent');
    }

    return response.json();
};

// ✅ Видалити орендовану ділянку за ID
export const deleteRentApi = async (rentId) => {
    const response = await fetch(apiRoutes.deleteRent(rentId), {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete rent');
    }

    return response.json();
};
