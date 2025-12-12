// import apiRoutes from '../helpres/ApiRoutes';

// export const fetchGpsDataApi = async (year) => {
//     const url = apiRoutes.getLocation(year);

//     const response = await fetch(url);

//     if (!response.ok) {
//         throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);
//     }

//     const data = await response.json();

//     return data;
// };


import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsDataApi = async (date) => {
    if (!date) return [];

    const year = new Date(date).getFullYear();
    const url = apiRoutes.getLocationByDate(year, date);

    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);
    }

    const data = await response.json();
    return data;
};