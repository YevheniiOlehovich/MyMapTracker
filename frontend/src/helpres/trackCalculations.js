import { isPointInUkraine } from './trekHelpers';

/**
 * Повертає сегменти стоянок для одного транспортного засобу
 * @param {Array} vehicleData - масив GPS точок одного транспортного засобу
 * @param {string} imei - IMEI транспортного засобу
 * @returns {Array} segments масив точок з доданою тривалістю
 */
export const getStationarySegments = (vehicleData, imei) => {
  if (!vehicleData || vehicleData.length === 0) return [];

  const segments = [];
  let current = [];

  vehicleData.forEach((p, i, arr) => {
    if (i === 0) return;
    const prev = arr[i - 1];
    if (p.latitude === prev.latitude && p.longitude === prev.longitude) {
      current.push(p);
    } else {
      if (current.length) segments.push(current);
      current = [];
    }
  });

  if (current.length) segments.push(current);

  return segments.map(seg => {
    const start = new Date(seg[0].timestamp);
    const end = new Date(seg.at(-1).timestamp);
    const duration = (end - start) / 1000;
    return seg.map(p => ({ ...p, duration, imei }));
  });
};

/**
 * Повертає масив аномалій (втрати сигналу) для транспортного засобу
 * @param {Array} vehicleData - масив GPS точок одного транспортного засобу
 * @param {string} imei - IMEI транспортного засобу
 * @returns {Array} anomalyMarkers
 */
export const getAnomalyMarkers = (vehicleData, imei) => {
  if (!vehicleData || vehicleData.length === 0) return [];

  let lastValid = null;
  let anomalyStart = null;
  const result = [];

  vehicleData.forEach(p => {
    const valid = p.latitude && p.longitude && isPointInUkraine(p.latitude, p.longitude);
    if (valid) {
      if (anomalyStart && lastValid) {
        result.push({ ...lastValid, anomalyStart, anomalyEnd: p.timestamp, imei });
        anomalyStart = null;
      }
      lastValid = p;
    } else {
      if (!anomalyStart && lastValid) anomalyStart = p.timestamp;
    }
  });

  return result;
};
