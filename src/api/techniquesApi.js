import apiRoutes from '../helpres/ApiRoutes';

export const fetchTechniquesApi = async () => {
    const response = await fetch(apiRoutes.getTechniques);
    if (!response.ok) throw new Error('Не вдалося отримати техніку');
    return await response.json();
};

export const saveTechniqueApi = async (techniqueData) => {
    const response = await fetch(apiRoutes.addTechnique, {
        method: 'POST',
        body: techniqueData,
    });
    if (!response.ok) throw new Error('Не вдалося створити техніку');
    return await response.json();
};

export const updateTechniqueApi = async ({ id, techniqueData }) => {
    const response = await fetch(apiRoutes.updateTechnique(id), {
        method: 'PUT',
        body: techniqueData,
    });
    if (!response.ok) throw new Error('Не вдалося оновити техніку');
    return await response.json();
};

export const deleteTechniqueApi = async (id) => {
    const response = await fetch(apiRoutes.deleteTechnique(id), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити техніку');
    return id;
};