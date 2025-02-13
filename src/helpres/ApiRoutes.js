import { userName, userPass } from '../helpres/index.js';

const API_BASE_URL = `http://localhost:5000`; // Змініть порт відповідно до налаштувань вашого сервера

const apiRoutes = {
    getLocation: `${API_BASE_URL}/avl_records`,
    getGroups: `${API_BASE_URL}/groups`,  
    addGroup: `${API_BASE_URL}/groups`, 
    updateGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
    deleteGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
    addPersonnel: (groupId) => `${API_BASE_URL}/groups/${groupId}/personnel`,
    deletePersonnel: (groupId, personnelId) => `${API_BASE_URL}/groups/${groupId}/personnel/${personnelId}`,
    addVehicle: (groupId) => `${API_BASE_URL}/groups/${groupId}/vehicles`, // Додавання техніки до групи
    deleteVehicle: (groupId, vehicleId) => `${API_BASE_URL}/groups/${groupId}/vehicles/${vehicleId}`, // Видалення техніки з групи
    getRates: `${API_BASE_URL}/rates`, // Отримати останні тарифи
    addRates: `${API_BASE_URL}/rates`, // Додати нові тарифи

};


export default apiRoutes;
