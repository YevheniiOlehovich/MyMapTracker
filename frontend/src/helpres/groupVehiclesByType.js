/**
 * Групує масив техніки за типом
 * @param {Array} vehiclesData - масив техніки
 * @returns {Object} - ключі = типи техніки, значення = масиви техніки цього типу
 */
export const groupVehiclesByType = (vehiclesData) => {
  return vehiclesData.reduce((acc, vehicle) => {
    const type = vehicle.vehicleType;
    if (!acc[type]) {
      acc[type] = [];
    }
    acc[type].push(vehicle);
    return acc;
  }, {});
};
