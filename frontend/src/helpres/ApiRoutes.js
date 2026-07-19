// const API_BASE_URL = `http://localhost:5000`; // Локальний сервер

const API_BASE_URL = "/api";  

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

    // getLocation: `${API_BASE_URL}/avl_records`,
    
    getLocationByDate: (year, date) => `${API_BASE_URL}/trek_${year}?date=${date}`,
    getLastLocationByDate: (year, date) => `${API_BASE_URL}/trek_${year}/last?date=${date}`,
    getLocationByImei: (year, date, imei) => `${API_BASE_URL}/trek_${year}?date=${date}&imei=${imei}`,
    
    getLocationByImeiMonth: (year, month, imei) => `${API_BASE_URL}/trek_${year}/month?month=${month}&imei=${imei}`,

    getFields: `${API_BASE_URL}/geo_data/fields`, 
    addFields: `${API_BASE_URL}/geo_data/fields`, 
    updateField: (fieldId) => `${API_BASE_URL}/geo_data/fields/${fieldId}`, 
    getCadastre: `${API_BASE_URL}/geo_data/cadastre`, 
    addCadastre: `${API_BASE_URL}/geo_data/cadastre`, 
    getGeozone: `${API_BASE_URL}/geo_data/geozone`,
    getLandSquatting: `${API_BASE_URL}/geo_data/land_squatting`,

    // Операції
    getOperations: `${API_BASE_URL}/operations`,
    addOperation: `${API_BASE_URL}/operations`,
    updateOperation: (id) => `${API_BASE_URL}/operations/${id}`,
    deleteOperation: (id) => `${API_BASE_URL}/operations/${id}`,

    // 🌾 Культури
    getCrops: `${API_BASE_URL}/crops`,
    addCrop: `${API_BASE_URL}/crops`,
    updateCrop: (id) => `${API_BASE_URL}/crops/${id}`,
    deleteCrop: (id) => `${API_BASE_URL}/crops/${id}`,

    // 🌱 Сорти культур
    getVarieties: `${API_BASE_URL}/varieties`,
    addVariety: `${API_BASE_URL}/varieties`,
    updateVariety: (id) => `${API_BASE_URL}/varieties/${id}`,
    deleteVariety: (id) => `${API_BASE_URL}/varieties/${id}`,

    // Господарські ділянки
    getUnits: `${API_BASE_URL}/units`,
    addUnit: `${API_BASE_URL}/units`,
    updateUnit: (id) => `${API_BASE_URL}/units/${id}`,
    deleteUnit: (id) => `${API_BASE_URL}/units/${id}`,

    // Орендовані ділянки
    getRents: `${API_BASE_URL}/rent`,
    addRent: `${API_BASE_URL}/rent`,
    updateRent: (id) => `${API_BASE_URL}/rent/${id}`,
    deleteRent: (id) => `${API_BASE_URL}/rent/${id}`,

    // Орендовані ділянки 2026
    getRent2026: `${API_BASE_URL}/rent_2026`,
    addRent2026: `${API_BASE_URL}/rent_2026`,
    updateRent2026: (id) => `${API_BASE_URL}/rent_2026/${id}`,
    deleteRent2026: (id) => `${API_BASE_URL}/rent_2026/${id}`,

    // Власність (property)
    getProperties: `${API_BASE_URL}/property`,
    addProperty: `${API_BASE_URL}/property`,
    updateProperty: (id) => `${API_BASE_URL}/property/${id}`,
    deleteProperty: (id) => `${API_BASE_URL}/property/${id}`,

    // === Таски ===
    getTasks: `${API_BASE_URL}/tasks`,
    getTaskById: (id) => `${API_BASE_URL}/tasks/${id}`,
    addTask: `${API_BASE_URL}/tasks`,
    updateTask: (id) => `${API_BASE_URL}/tasks/${id}`,
    deleteTask: (id) => `${API_BASE_URL}/tasks/${id}`,
    updateTaskReport: (id) => `${API_BASE_URL}/tasks/${id}/report`,

    getTaskIdsByRange: (startDate, endDate) =>
        `${API_BASE_URL}/tasks/range?startDate=${startDate}&endDate=${endDate}`,  
};

export default apiRoutes;