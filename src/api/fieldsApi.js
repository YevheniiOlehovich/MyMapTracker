import apiRoutes from '../helpres/ApiRoutes';

// Функція для отримання полів
export const fetchFields = async () => {
    const response = await fetch(apiRoutes.getFields);
    if (!response.ok) {
        throw new Error('Failed to fetch fields');
    }
    const data = await response.json();
    return data;
};

// Функція для оновлення поля
export const updateFieldApi = async (fieldData) => {

    const response = await fetch(apiRoutes.updateField(fieldData._id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(fieldData),
    });

    if (!response.ok) {
        throw new Error('Failed to update field');
    }

    return response.json(); // Повертаємо результат запиту
};