import apiRoutes from '../helpres/ApiRoutes';

export const fetchCropsApi = async () => {
    const response = await fetch(apiRoutes.getCrops);
    if (!response.ok) throw new Error('Не вдалося отримати культури');
    return await response.json();
};

export const saveCropApi = async (cropData) => {
    const response = await fetch(apiRoutes.addCrop, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData),
    });
    if (!response.ok) throw new Error('Не вдалося створити культуру');
    return await response.json();
};

export const updateCropApi = async ({ cropId, cropData }) => {
    const response = await fetch(apiRoutes.updateCrop(cropId), {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(cropData),
    });
    if (!response.ok) throw new Error('Не вдалося оновити культуру');
    return await response.json();
};

export const deleteCropApi = async (cropId) => {
    const response = await fetch(apiRoutes.deleteCrop(cropId), { method: 'DELETE' });
    if (!response.ok) throw new Error('Не вдалося видалити культуру');
    return cropId;
};
