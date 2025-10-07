import apiRoutes from '../helpres/ApiRoutes';

export const fetchGeozoneApi = async () => {
    const response = await fetch(apiRoutes.getGeozone);
    if (!response.ok) {
        throw new Error('Failed to fetch geozone data');
    }
    return response.json(); // Повертаємо дані геозон
};