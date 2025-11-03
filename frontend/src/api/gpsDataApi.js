import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsDataApi = async () => {
    const response = await fetch(apiRoutes.getLocation);
    if (!response.ok) {
        throw new Error('Не вдалося отримати дані GPS');
    }
    return response.json(); // Повертаємо дані GPS
};



