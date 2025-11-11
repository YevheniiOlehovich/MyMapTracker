// import { haversineDistance } from "./distance";

// // 🚗 Розбиває GPS дані на сегменти руху/стоянки + визначає домінуючого водія
// export function splitGpsSegments(gpsData = []) {
//   if (!gpsData.length) return [];

//   const segments = [];
//   let currentSegment = [];
//   let currentState = null;

//   gpsData.forEach((point, index) => {
//     const state = point.speed > 1 ? "moving" : "idle";

//     if (currentState === null) currentState = state;

//     if (state !== currentState) {
//       if (currentSegment.length > 0) {
//         segments.push(addSegmentInfo(currentSegment, currentState));
//       }
//       currentSegment = [];
//       currentState = state;
//     }

//     currentSegment.push(point);

//     if (index === gpsData.length - 1 && currentSegment.length > 0) {
//       segments.push(addSegmentInfo(currentSegment, currentState));
//     }
//   });

//   // 📊 Логування сегментів
//   let totalGpsDistance = 0;
//   let totalMovingDistance = 0;

//   segments.forEach((seg, i) => {
//     const { state, points, startTime, endTime, distance, driverCardId } = seg;

//     totalGpsDistance += distance;
//     if (state === "moving") totalMovingDistance += distance;
//   });

//   console.groupEnd();

//   // ✅ Повертаємо тільки рухові сегменти з >3 точок
//   return segments.filter(seg => seg.state === "moving" && seg.points.length > 3);
// }

// // 🔸 Обробка окремого сегмента
// function addSegmentInfo(segmentPoints, state) {
//   if (!segmentPoints.length) return null;

//   let totalDistance = 0;
//   for (let i = 1; i < segmentPoints.length; i++) {
//     const p1 = segmentPoints[i - 1];
//     const p2 = segmentPoints[i];
//     const dist = haversineDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);

//     const t1 = new Date(p1.timestamp).getTime();
//     const t2 = new Date(p2.timestamp).getTime();
//     const dtSec = Math.max((t2 - t1) / 1000, 1);
//     const speedKmh = dist / (dtSec / 3600);

//     if (speedKmh < 150) {
//       totalDistance += dist;
//     }
//   }

//   // 🕓 Часові межі
//   const startTime = new Date(segmentPoints[0].timestamp);
//   const endTime = new Date(segmentPoints[segmentPoints.length - 1].timestamp);

//   // 👨‍🔧 Визначення домінуючого водія
//   const driverCounts = {};
//   for (const point of segmentPoints) {
//     if (!point.card_id) continue;
//     driverCounts[point.card_id] = (driverCounts[point.card_id] || 0) + 1;
//   }
//   const dominantCardId =
//     Object.keys(driverCounts).length > 0
//       ? Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0][0]
//       : null;

//   return {
//     state,
//     startTime,
//     endTime,
//     distance: totalDistance,
//     driverCardId: dominantCardId,
//     points: segmentPoints,
//     coordinates: segmentPoints.map(p => [p.latitude, p.longitude]),
//   };
// }







import { haversineDistance } from './distance';
import { isPointInUkraine } from './trekHelpers';

/**
 * Розбиває GPS-дані на сегменти типу: рух / стоянка / аномалія
 * @param {Array} gpsData - масив GPS точок
 * @param {string} imei - ідентифікатор транспортного засобу
 * @returns {Array} масив сегментів
 */
export function splitGpsSegments(gpsData = [], imei = null) {
  if (!gpsData.length) return [];

  const segments = [];
  let currentSegment = [];
  let currentType = null;

  for (let i = 0; i < gpsData.length; i++) {
    const p = gpsData[i];
    const prev = gpsData[i - 1];

    // визначаємо тип точки
    const pointType = getPointType(p, prev);

    // перша точка — починаємо новий сегмент
    if (currentType === null) currentType = pointType;

    // якщо тип змінився → закриваємо попередній сегмент
    if (pointType !== currentType && currentSegment.length > 0) {
      segments.push(addSegmentInfo(currentSegment, currentType, imei));
      currentSegment = [];
      currentType = pointType;
    }

    currentSegment.push(p);
  }

  // додаємо останній сегмент
  if (currentSegment.length > 0) {
    segments.push(addSegmentInfo(currentSegment, currentType, imei));
  }

  // 🧹 фільтрація коротких або шумових сегментів
  return mergeShortSegments(segments);
}

/**
 * Визначає тип точки: рух / стоянка / аномалія
 */
function getPointType(point, prev) {
  // відсутні координати → аномалія
  if (!point?.latitude || !point?.longitude) return 'anomaly';

  // поза Україною → теж аномалія
  if (!isPointInUkraine(point.latitude, point.longitude)) return 'anomaly';

  if (!prev) return point.speed > 1 ? 'moving' : 'idle';

  const distance = haversineDistance(
    point.latitude,
    point.longitude,
    prev.latitude,
    prev.longitude
  );
  const dt = (new Date(point.timestamp) - new Date(prev.timestamp)) / 1000;
  const speedKmh = dt > 0 ? distance / (dt / 3600) : 0;

  // 1️⃣ Аномалія — різкий стрибок або нереальна швидкість
  if (speedKmh > 200 || distance > 0.5) return 'anomaly'; // 0.5 км між точками — малоймовірно

  // 2️⃣ Стоянка — стабільні координати + низька швидкість
  if (distance < 0.00005 && point.speed < 1) return 'idle';

  // 3️⃣ Рух
  if (point.speed >= 1) return 'moving';

  return 'unknown';
}

/**
 * Формує об'єкт сегмента з додатковою інформацією
 */
function addSegmentInfo(points, type, imei) {
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

  // визначення домінуючого водія (якщо є card_id)
  const driverCounts = {};
  for (const p of points) {
    if (!p.card_id) continue;
    driverCounts[p.card_id] = (driverCounts[p.card_id] || 0) + 1;
  }
  const dominantDriver = Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0]?.[0] || null;

  return {
    type, // "moving" | "idle" | "anomaly"
    imei,
    startTime,
    endTime,
    duration,
    distance,
    driverCardId: dominantDriver,
    coordinates: points.map(p => [p.latitude, p.longitude]),
    points,
  };
}

/**
 * Об'єднує надто короткі сегменти або аномалії з сусідніми стабільними
 */
function mergeShortSegments(segments) {
  const merged = [];

  for (let i = 0; i < segments.length; i++) {
    const seg = segments[i];
    const prev = merged.at(-1);

    // 🧩 Якщо сегмент дуже короткий або з 1-2 точок
    if (seg.points.length <= 2 || seg.duration < 10) {
      // об'єднуємо з попереднім того ж типу
      if (prev && prev.type === seg.type) {
        prev.points.push(...seg.points);
        prev.endTime = seg.endTime;
        prev.duration += seg.duration;
        prev.distance += seg.distance;
      }
      // або приєднуємо аномалію до наступного руху / стоянки
      else if (seg.type === 'anomaly' && segments[i + 1]) {
        continue; // просто пропускаємо аномалію — вважатимемо шумом
      } else {
        merged.push(seg);
      }
    } else {
      merged.push(seg);
    }
  }

  return merged;
}
