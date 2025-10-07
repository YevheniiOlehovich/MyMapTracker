import apiRoutes from '../helpres/ApiRoutes';

export const fetchCadastre = async () => {
    const response = await fetch(apiRoutes.getCadastre);
    if (!response.ok) {
        throw new Error('Failed to fetch cadastre data');
    }
    return response.json();
};