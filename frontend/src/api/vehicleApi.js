import apiRoutes from '../helpres/ApiRoutes';

export const fetchVehiclesApi = async () => {
    const response = await fetch(apiRoutes.getVehicles);
    if (!response.ok) throw new Error('Не вдалося отримати транспорт');
    return await response.json();
};

export const saveVehicleApi = async (vehicleData) => {
    const response = await fetch(apiRoutes.addVehicle, {
        method: 'POST',
        body: vehicleData,
    });
    if (!response.ok) throw new Error('Не вдалося створити транспорт');
    return await response.json();
};

export const updateVehicleApi = async ({ id, vehicleData }) => {
    const response = await fetch(apiRoutes.updateVehicle(id), {
        method: 'PUT',
        body: vehicleData,
    });
    if (!response.ok) throw new Error('Не вдалося оновити транспорт');
    return await response.json();
};

export const deleteVehicleApi = async (vehicleId) => {
    const response = await fetch(apiRoutes.deleteVehicle(vehicleId), {
        method: 'DELETE',
    });
    if (!response.ok) throw new Error('Не вдалося видалити транспорт');
    return vehicleId;
};