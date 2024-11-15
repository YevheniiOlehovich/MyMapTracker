import { userName, userPass } from '../helpres/index.js';

const API_BASE_URL = `http://localhost:5000`; // Змініть порт відповідно до налаштувань вашого сервера

const apiRoutes = {
    getGroups: `${API_BASE_URL}/groups`,  
    addGroup: `${API_BASE_URL}/groups`, 
    updateGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
    deleteGroup: (groupId) => `${API_BASE_URL}/groups/${groupId}`, 
    addPersonnel: (groupId) => `${API_BASE_URL}/groups/${groupId}/personnel`,
    // updatePersonnel: (groupId, personId) => `${API_BASE_URL}/groups/${groupId}/personnel/${personId}`,
    deletePersonnel: (groupId, personnelId) => `${API_BASE_URL}/groups/${groupId}/personnel/${personnelId}`,
    addVehicle: (groupId) => `${API_BASE_URL}/groups/${groupId}/vehicles`, // Додавання техніки до групи
    deleteVehicle: (groupId, equipmentId) => `${API_BASE_URL}/groups/${groupId}/vehicles/${equipmentId}`, // Видалення техніки з групи

};


export default apiRoutes;
