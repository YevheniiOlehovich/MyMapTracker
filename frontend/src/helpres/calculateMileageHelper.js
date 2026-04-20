import { splitGpsSegments } from './splitGpsSegments';
import { fetchGpsByImeiMonth } from './fetchGpsData';

export const calculateMileageHelper = async (
  vehicles,
  month,
  year,
  rates = []
) => {
  const vehicleArray = Array.isArray(vehicles) ? vehicles : [vehicles];

  const chunkSize = 5;
  const results = [];

  for (let i = 0; i < vehicleArray.length; i += chunkSize) {
    const chunk = vehicleArray.slice(i, i + chunkSize);

    const chunkResults = await Promise.all(
      chunk.map(async (vehicle) => {
        if (!vehicle?.imei) {
          return null;
        }

        try {
          const gpsDataByMonth = await fetchGpsByImeiMonth(
            vehicle.imei,
            month,
            year
          );

          if (!gpsDataByMonth?.length) {
            return {
              vehicle,
              dailyResults: [],
              totalDistance: 0,
              totalCost: 0,
              totalDuration: 0,
            };
          }

          const dailyMap = {};

          // 🔹 ТАРИФ
          let rateValue = 0;
          const rateObj = Array.isArray(rates) ? rates[0] : rates;

          switch (vehicle.vehicleType) {
            case "car":
              rateValue = rateObj?.carRate || 0;
              break;

            case "truck":
              rateValue = rateObj?.truckRate || 0;
              break;

            case "tractor":
              rateValue = rateObj?.tractorRate || 0;
              break;

            case "combine":
              rateValue = rateObj?.combineRate || 0;
              break;

            default:
              rateValue = 0;
          }

          // 🔹 ОБРОБКА ДНІВ
          for (const day of gpsDataByMonth) {
            const points = day?.data || [];

            if (!points.length) continue;

            const segments =
              splitGpsSegments(points, vehicle.imei) || [];

            if (!segments.length) continue;

            const dateKey = day.date;

            if (!dailyMap[dateKey]) {
              dailyMap[dateKey] = {
                date: new Date(dateKey),
                distance: 0,
                cost: 0,
                duration: 0,
                driver: "",
                vehicle: vehicle.regNumber,
                segments: [],
              };
            }

            for (const seg of segments) {
              // тільки рух
              if (seg.type !== "moving") continue;

              const dist = seg.distance || 0;
              const duration = seg.duration || 0;

              // пропускаємо сміття
              if (!dist && !duration) continue;

              dailyMap[dateKey].distance += dist;
              dailyMap[dateKey].cost += dist * rateValue;
              dailyMap[dateKey].duration += duration;

              if (!dailyMap[dateKey].driver) {
                dailyMap[dateKey].driver =
                  seg.driver ||
                  vehicle.driver1 ||
                  "";
              }

              dailyMap[dateKey].segments.push(seg);
            }
          }

          const dailyResults = Object.values(dailyMap);

          // 🔹 ПІДСУМКИ
          const totalDistance = Number(
            dailyResults
              .reduce((sum, d) => sum + d.distance, 0)
              .toFixed(2)
          );

          const totalCost = Number(
            dailyResults
              .reduce((sum, d) => sum + d.cost, 0)
              .toFixed(2)
          );

          const totalDuration = dailyResults.reduce(
            (sum, d) => sum + d.duration,
            0
          );

          return {
            vehicle,
            dailyResults,
            totalDistance,
            totalCost,
            totalDuration,
          };
        } catch (err) {
          console.error(
            "❌ ERROR vehicle:",
            vehicle?.regNumber,
            err
          );

          return {
            vehicle,
            dailyResults: [],
            totalDistance: 0,
            totalCost: 0,
            totalDuration: 0,
          };
        }
      })
    );

    results.push(...chunkResults);
  }

  const filtered = results.filter(Boolean);

  return Array.isArray(vehicles)
    ? filtered
    : filtered[0] || null;
};