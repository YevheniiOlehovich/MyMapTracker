// import { userName, userPass } from '../helpres/index.js';

// const API_BASE_URL = `http://localhost:5000`; // Змініть порт відповідно до налаштувань вашого сервера

// const apiRoutes = {
//     getLocation: `${API_BASE_URL}/avl_records`,
//     getGroups: `${API_BASE_URL}/groups`,  
//     addGroup: `${API_BASE_URL}/groups`, 
//     updateGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
//     deleteGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
//     addPersonnel: (groupId) => `${API_BASE_URL}/groups/${groupId}/personnel`,
//     deletePersonnel: (groupId, personnelId) => `${API_BASE_URL}/groups/${groupId}/personnel/${personnelId}`,
//     addVehicle: (groupId) => `${API_BASE_URL}/groups/${groupId}/vehicles`, // Додавання техніки до групи
//     deleteVehicle: (groupId, vehicleId) => `${API_BASE_URL}/groups/${groupId}/vehicles/${vehicleId}`, // Видалення техніки з групи
//     addTechnique: (groupId) => `${API_BASE_URL}/groups/${groupId}/techniques/`,
//     deleteTechnique: (groupId, techniqueId) => `${API_BASE_URL}/groups/${groupId}/techniques/${techniqueId}`, // Видалення техніки з групи
//     getRates: `${API_BASE_URL}/rates`, // Отримати останні тарифи
//     addRates: `${API_BASE_URL}/rates`, // Додати нові тарифи

//     // Додані шляхи для кадастрових даних і для полів
//     getFields: `${API_BASE_URL}/geo_data/fields`, // Отримати всі поля
//     addFields: `${API_BASE_URL}/geo_data/fields`, // Додати нові поля
//     updateField: (fieldId) => `${API_BASE_URL}/geo_data/fields/${fieldId}`, // Оновити поле
//     getCadastre: `${API_BASE_URL}/geo_data/cadastre`, // Отримати всі кадастрові дані
//     addCadastre: `${API_BASE_URL}/geo_data/cadastre`, // Додати нові кадастрові дані
//     getGeozone: `${API_BASE_URL}/geo_data/geozone`,
//     getLandSquatting: `${API_BASE_URL}/geo_data/land_squatting`,
// };

// export default apiRoutes;


const API_BASE_URL = `http://localhost:5000`;

const apiRoutes = {
    getGroups: `${API_BASE_URL}/groups`,
    addGroup: `${API_BASE_URL}/groups`,
    updateGroup: (id) => `${API_BASE_URL}/groups/${id}`,
    deleteGroup: (id) => `${API_BASE_URL}/groups/${id}`,

    getPersonnel: `${API_BASE_URL}/personnel`,
    getPersonnelById: (id) => `${API_BASE_URL}/personnel/${id}`,
    addPersonnel: `${API_BASE_URL}/personnel`,
    updatePersonnel: (id) => `${API_BASE_URL}/personnel/${id}`,
    deletePersonnel: (id) => `${API_BASE_URL}/personnel/${id}`,

    getVehicles: `${API_BASE_URL}/vehicles`,
    getVehicleById: (id) => `${API_BASE_URL}/vehicles/${id}`,
    addVehicle: `${API_BASE_URL}/vehicles`,
    updateVehicle: (id) => `${API_BASE_URL}/vehicles/${id}`,
    deleteVehicle: (id) => `${API_BASE_URL}/vehicles/${id}`,

    getTechniques: `${API_BASE_URL}/techniques`,
    getTechniqueById: (id) => `${API_BASE_URL}/techniques/${id}`,
    addTechnique: `${API_BASE_URL}/techniques`,
    updateTechnique: (id) => `${API_BASE_URL}/techniques/${id}`,
    deleteTechnique: (id) => `${API_BASE_URL}/techniques/${id}`,

    getRates: `${API_BASE_URL}/rates`, // Отримати останні тарифи
    addRates: `${API_BASE_URL}/rates`, // Додати нові тарифи

    getLocation: `${API_BASE_URL}/avl_records`,
    getFields: `${API_BASE_URL}/geo_data/fields`, 
    addFields: `${API_BASE_URL}/geo_data/fields`, 
    updateField: (fieldId) => `${API_BASE_URL}/geo_data/fields/${fieldId}`, 
    getCadastre: `${API_BASE_URL}/geo_data/cadastre`, 
    addCadastre: `${API_BASE_URL}/geo_data/cadastre`, 
    getGeozone: `${API_BASE_URL}/geo_data/geozone`,
    getLandSquatting: `${API_BASE_URL}/geo_data/land_squatting`,
};

export default apiRoutes;
