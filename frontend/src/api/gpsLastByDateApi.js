import apiRoutes from '../helpres/ApiRoutes';

export const fetchLastGpsByDateApi = async (date) => {
    if (!date) return [];

    const year = new Date(date).getFullYear();
    const url = apiRoutes.getLastLocationByDate(year, date);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`❌ Не вдалося отримати last GPS за ${date}`);
    }

    return response.json();
};
