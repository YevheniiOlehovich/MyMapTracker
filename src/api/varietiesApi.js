import apiRoutes from '../helpres/ApiRoutes';

export const fetchVarietiesApi = async () => {
    const response = await fetch(apiRoutes.getVarieties);
    if (!response.ok) throw new Error('Не вдалося отримати сорти культур');
    return await response.json();
};

export const saveVarietyApi = async (varietyData) => {
    const response = await fetch(apiRoutes.addVariety, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(varietyData),
    });
    if (!response.ok) throw new Error('Не вдалося створити сорт культури');
    return await response.json();
};

export const updateVarietyApi = async ({ varietyId, varietyData }) => {
    const response = await fetch(apiRoutes.updateVariety(varietyId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(varietyData),
    });
    if (!response.ok) throw new Error('Не вдалося оновити сорт культури');
    return await response.json();
};

export const deleteVarietyApi = async (varietyId) => {
    const response = await fetch(apiRoutes.deleteVariety(varietyId), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити сорт культури');
    return varietyId;
};
