import apiRoutes from '../helpres/ApiRoutes';

export const fetchGpsDataApi = async (year) => {
    const url = apiRoutes.getLocation(year);

    console.log(year)

    const response = await fetch(url);

    if (!response.ok) {
        throw new Error(`❌ Не вдалося отримати дані GPS з ${url}`);
    }

    const data = await response.json();

    return data;
};


























// export const fetchGpsDataApi = async (year) => {

//     console.log(API_BASE_URL);

//     const url = `http://localhost:5000/trek_${year}`;

//     console.log(`🌐 Fetching GPS data from: ${url}`);

//     const response = await fetch(url);

//     if (!response.ok) {
//         throw new Error(`Не вдалося отримати дані GPS з ${url}`);
//     }

//     const data = await response.json();
    
//     console.log("📍 GPS Data:", data);
    
//     return data;
// };
