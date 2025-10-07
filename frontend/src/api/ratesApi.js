import apiRoutes from '../helpres/ApiRoutes';

export const fetchRatesApi = async () => {
    const response = await fetch(apiRoutes.getRates);
    if (!response.ok) {
        throw new Error('Не вдалося отримати тарифи');
    }
    return response.json(); // Повертаємо дані тарифів
};

export const addRatesApi = async (ratesData) => {
    const response = await fetch(apiRoutes.addRates, {
        method: 'POST',
        headers: {
        'Content-Type': 'application/json',
        },
        body: JSON.stringify(ratesData),
    });

    if (!response.ok) {
        throw new Error('Не вдалося додати тарифи');
    }

    return response.json();
};