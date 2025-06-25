import apiRoutes from '../helpres/ApiRoutes';

export const fetchPersonnelApi = async () => {
    const response = await fetch(apiRoutes.getPersonnel);
    if (!response.ok) throw new Error('Не вдалося отримати персонал');
    return await response.json();
};

export const savePersonnelApi = async (personnelData) => {
    const response = await fetch(apiRoutes.addPersonnel, {
        method: 'POST',
        body: personnelData,
    });
    if (!response.ok) throw new Error('Не вдалося створити персонал');
    return await response.json();
};

export const updatePersonnelApi = async ({ personnelId, personnelData }) => {
    const response = await fetch(apiRoutes.updatePersonnel(personnelId), {
        method: 'PUT',
        body: personnelData,
    });
    if (!response.ok) throw new Error('Не вдалося оновити персонал');
    return await response.json();
};

export const deletePersonnelApi = async (id) => {
    const response = await fetch(apiRoutes.deletePersonnel(id), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити персонал');
    return id;
};