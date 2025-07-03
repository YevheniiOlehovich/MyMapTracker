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

    // Операції
    getOperations: `${API_BASE_URL}/operations`,
    addOperation: `${API_BASE_URL}/operations`,
    updateOperation: (id) => `${API_BASE_URL}/operations/${id}`,
    deleteOperation: (id) => `${API_BASE_URL}/operations/${id}`,
};

export default apiRoutes;
