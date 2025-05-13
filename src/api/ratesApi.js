import apiRoutes from '../helpres/ApiRoutes';

export const fetchRatesApi = async () => {
    const response = await fetch(apiRoutes.getRates);
    if (!response.ok) {
        throw new Error('Не вдалося отримати тарифи');
    }
    return response.json(); // Повертаємо дані тарифів
};