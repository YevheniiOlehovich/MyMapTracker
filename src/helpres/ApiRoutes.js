// src/apiRoutes.js
import { userName, userPass } from '../helpres/index.js';

const API_BASE_URL = `http://localhost:5000`; // Змініть порт відповідно до налаштувань вашого сервера


// const API_BASE_URL = `mongodb+srv://${userName}:${userPass}@cluster0.k4l1p.mongodb.net/myDatabaseName?retryWrites=true&w=majority&appName=Cluster0`; 

const apiRoutes = {
    getGroups: `${API_BASE_URL}/groups`,  // Для отримання груп
    addGroup: `${API_BASE_URL}/groups`, // Для POST-запиту на додавання нової групи
    addPersonnel: (groupId) => `${API_BASE_URL}/groups/${groupId}/personnel`,
    // Додайте інші ендпоінти за потреби
};

export default apiRoutes;
