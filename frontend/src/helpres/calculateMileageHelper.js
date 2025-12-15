import { splitGpsSegments } from './splitGpsSegments';
import { fetchGpsByImeiMonth } from './fetchGpsData';

/**
 * Розрахунок пробігу для одного або кількох транспортних засобів за місяць
 * @param {Array|Object} vehicles - один або масив об'єктів транспортних засобів
 * @param {number} month - місяць (1-12)
 * @param {number} year - рік (YYYY)
 * @param {Array|Object} rates - масив або об'єкт ставок для техніки
 * @returns {Array|Object} результат з dailyResults і totalDistance
 */
export const calculateMileageHelper = async (vehicles, month, year, rates = []) => {
  const vehicleArray = Array.isArray(vehicles) ? vehicles : [vehicles];
  const results = [];

  console.log('🚗 Vehicles:', vehicleArray);
  console.log('💰 Rates:', rates);

  for (const vehicle of vehicleArray) {
    if (!vehicle?.imei) continue;

    try {
      // ✅ ОДИН запит на місяць
      const gpsDataByMonth = await fetchGpsByImeiMonth(vehicle.imei, month, year);

      if (!gpsDataByMonth?.length) {
        results.push({
          vehicle,
          dailyResults: [],
          totalDistance: 0,
          totalCost: 0,
        });
        continue;
      }

      const dailyMap = {};

      // Ставка для цього транспортного засобу
      let rateValue = 0;
      if (rates) {
        const rateObj = Array.isArray(rates) ? rates[0] : rates;
        switch (vehicle.vehicleType) {
          case 'car':
            rateValue = rateObj.carRate || 0;
            break;
          case 'truck':
            rateValue = rateObj.truckRate || 0;
            break;
          case 'tractor':
            rateValue = rateObj.tracktorRate || 0;
            break;
          case 'combine':
            rateValue = rateObj.combineRate || 0;
            break;
          default:
            rateValue = 0;
        }
      }

      console.log(`💲 Rate for ${vehicle.regNumber} (${vehicle.vehicleType}):`, rateValue);

      // Проходимо по кожному дню
      for (const day of gpsDataByMonth) {
        const points = day.data || [];
        if (!points.length) continue;

        // Розбиваємо точки на сегменти
        const segments = splitGpsSegments(points, vehicle.imei);

        for (const seg of segments) {
          if (seg.type !== 'moving') continue; // враховуємо лише рух

          const dateKey = day.date; // yyyy-mm-dd

          if (!dailyMap[dateKey]) {
            dailyMap[dateKey] = {
              date: new Date(dateKey),
              distance: 0,
              cost: 0,
              driver: seg.driver || vehicle.driver1 || '',
              vehicle: vehicle.regNumber,
              segments: [],
            };
          }

          dailyMap[dateKey].distance += seg.distance || 0;
          dailyMap[dateKey].cost += (seg.distance || 0) * rateValue;
          dailyMap[dateKey].segments.push(seg);
        }
      }

      const dailyResults = Object.values(dailyMap);

      const vehicleResult = {
        vehicle,
        dailyResults,
        totalDistance: Number(dailyResults.reduce((sum, d) => sum + d.distance, 0).toFixed(2)),
        totalCost: Number(dailyResults.reduce((sum, d) => sum + d.cost, 0).toFixed(2)),
      };

      results.push(vehicleResult);

      console.log('✅ Mileage result for vehicle:', vehicle.regNumber, vehicleResult);

    } catch (error) {
      console.error('❌ Error calculating mileage for vehicle:', vehicle.regNumber, error);
      results.push({
        vehicle,
        dailyResults: [],
        totalDistance: 0,
        totalCost: 0,
      });
    }
  }

  return Array.isArray(vehicles) ? results : results[0];
};
