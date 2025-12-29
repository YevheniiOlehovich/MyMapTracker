import { splitGpsSegments } from './splitGpsSegments';
import { fetchGpsByImeiMonth } from './fetchGpsData';

export const calculateMileageHelper = async (vehicles, month, year, rates = []) => {

  const vehicleArray = Array.isArray(vehicles) ? vehicles : [vehicles];

  // 🔹 паралельні розрахунки
  const results = await Promise.all(
    vehicleArray.map(async (vehicle) => {
      if (!vehicle?.imei) {
        return null;
      }

      try {
        const gpsDataByMonth = await fetchGpsByImeiMonth(vehicle.imei, month, year);

        // якщо даних немає — повертаємо порожній запис
        if (!gpsDataByMonth || !gpsDataByMonth.length) {
          return {
            vehicle,
            dailyResults: [],
            totalDistance: 0,
            totalCost: 0,
          };
        }

        const dailyMap = {};

        // ставка
        let rateValue = 0;
        const rateObj = Array.isArray(rates) ? rates[0] : rates;

        switch (vehicle.vehicleType) {
          case 'car':
            rateValue = rateObj?.carRate || 0;
            break;
          case 'truck':
            rateValue = rateObj?.truckRate || 0;
            break;
          case 'tractor':
            rateValue = rateObj?.tracktorRate || 0;
            break;
          case 'combine':
            rateValue = rateObj?.combineRate || 0;
            break;
          default:
            rateValue = 0;
        }

        // проходимо по днях
        for (const day of gpsDataByMonth) {
          const points = day?.data || [];
          if (!points.length) continue;

          const segments = splitGpsSegments(points, vehicle.imei) || [];
          if (!segments.length) continue;

          for (const seg of segments) {
            if (seg.type !== 'moving') continue;

            const dateKey = day.date;

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

            const dist = seg.distance || 0;

            dailyMap[dateKey].distance += dist;
            dailyMap[dateKey].cost += dist * rateValue;
            dailyMap[dateKey].segments.push(seg);
          }
        }

        const dailyResults = Object.values(dailyMap);

        return {
          vehicle,
          dailyResults,
          totalDistance: Number(
            dailyResults.reduce((sum, d) => sum + d.distance, 0).toFixed(2)
          ),
          totalCost: Number(
            dailyResults.reduce((sum, d) => sum + d.cost, 0).toFixed(2)
          ),
        };
      } catch {
        return {
          vehicle,
          dailyResults: [],
          totalDistance: 0,
          totalCost: 0,
        };
      }
    })
  );

  // приберемо null (коли не було imei)
  const filtered = results.filter(Boolean);

  return Array.isArray(vehicles) ? filtered : filtered[0] || null;
};