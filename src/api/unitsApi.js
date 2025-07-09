import apiRoutes from '../helpres/ApiRoutes';

// ✅ Отримати всі ділянки
export const fetchUnits = async () => {
    const response = await fetch(apiRoutes.getUnits);
    if (!response.ok) {
        throw new Error('Failed to fetch units');
    }
    const data = await response.json();
    return data;
};

// ✅ Додати нову ділянку або масив ділянок
export const addUnitApi = async (unitData) => {
    const response = await fetch(apiRoutes.addUnit, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
    });

    if (!response.ok) {
        throw new Error('Failed to add unit(s)');
    }

    return response.json();
};

// ✅ Оновити ділянку за ID
export const updateUnitApi = async (unitData) => {
    const response = await fetch(apiRoutes.updateUnit(unitData._id), {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(unitData),
    });

    if (!response.ok) {
        throw new Error('Failed to update unit');
    }

    return response.json();
};

// ✅ Видалити ділянку за ID
export const deleteUnitApi = async (unitId) => {
    const response = await fetch(apiRoutes.deleteUnit(unitId), {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete unit');
    }

    return response.json();
};
