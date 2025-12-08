import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsDataApi = async (year) => {
    const url = apiRoutes.getLocation(year);

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);
    }

    const data = await response.json();

    return data;
};