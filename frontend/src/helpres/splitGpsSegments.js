import { haversineDistance } from './distance';

/**
 * Розбиває GPS-дані на сегменти руху, парковок та аномалій
 * @param {Array} gpsData - масив GPS точок
 * @param {string|null} imei - ідентифікатор транспорту
 * @returns {Array} масив сегментів
 */
export function splitGpsSegments(gpsData = [], imei = null) {
  if (!gpsData.length) return [];

  // Фільтруємо некоректні точки
  const filtered = gpsData.filter(p => p.latitude && p.longitude && p.satellites > 0);
  if (!filtered.length) return [];

  const segments = [];
  let currentSegment = [];
  let currentType = 'moving';
  let stopStartIdx = null;

  for (let i = 0; i < filtered.length; i++) {
    const p = filtered[i];
    const prev = filtered[i - 1];

    if (!prev) {
      currentSegment.push(p);
      continue;
    }

    // Перевірка на різкий стрибок координат (аномалія)
    const latDiff = Math.abs(p.latitude - prev.latitude);
    const lonDiff = Math.abs(p.longitude - prev.longitude);
    if (latDiff > 5 || lonDiff > 5) {
      // Закриваємо поточний сегмент
      if (currentSegment.length) {
        segments.push(createSegment(currentSegment, currentType, imei));
      }
      // Аномальний сегмент
      segments.push(createSegment([p], 'anomaly', imei));
      currentSegment = [];
      currentType = 'moving';
      stopStartIdx = null;
      continue;
    }

    const distance = haversineDistance(prev.latitude, prev.longitude, p.latitude, p.longitude);

    // Потенційна зупинка
    if (distance < 0.005) { // ~5 м
      if (currentType === 'moving') {
        if (currentSegment.length) segments.push(createSegment(currentSegment, 'moving', imei));
        currentSegment = [p];
        currentType = 'stop';
        stopStartIdx = i - 1;
      } else {
        currentSegment.push(p);
      }
    } else {
      // Рух
      if (currentType === 'stop') {
        const startTime = new Date(filtered[stopStartIdx].timestamp);
        const endTime = new Date(filtered[i - 1].timestamp);
        const duration = (endTime - startTime) / 1000;

        if (duration >= 90) {
          segments.push(createSegment(filtered.slice(stopStartIdx, i), 'parking', imei));
        }
        currentSegment = [p];
        currentType = 'moving';
        stopStartIdx = null;
      } else {
        currentSegment.push(p);
      }
    }
  }

  // Додаємо останній сегмент
  if (currentSegment.length) {
    if (currentType === 'stop' && stopStartIdx !== null) {
      const startTime = new Date(filtered[stopStartIdx].timestamp);
      const endTime = new Date(currentSegment.at(-1).timestamp);
      const duration = (endTime - startTime) / 1000;
      if (duration >= 90) {
        segments.push(createSegment(filtered.slice(stopStartIdx), 'parking', imei));
      }
    } else {
      segments.push(createSegment(currentSegment, currentType, imei));
    }
  }

  return segments;
}

/**
 * Формує об'єкт сегмента
 */
function createSegment(points, type, imei) {
  const startTime = new Date(points[0].timestamp);
  const endTime = new Date(points.at(-1).timestamp);
  const duration = (endTime - startTime) / 1000;

  let distance = 0;
  for (let i = 1; i < points.length; i++) {
    distance += haversineDistance(
      points[i - 1].latitude,
      points[i - 1].longitude,
      points[i].latitude,
      points[i].longitude
    );
  }

  return {
    type, // "moving" | "parking" | "anomaly"
    imei,
    startTime,
    endTime,
    duration,
    distance,
    coordinates: points.map(p => [p.latitude, p.longitude]),
    points,
  };
}
