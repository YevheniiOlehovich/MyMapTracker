import { haversineDistance } from "./distance";

// 🚗 Розбиває GPS дані на сегменти руху/стоянки + визначає домінуючого водія
export function splitGpsSegments(gpsData = []) {
  if (!gpsData.length) return [];

  const segments = [];
  let currentSegment = [];
  let currentState = null;

  gpsData.forEach((point, index) => {
    const state = point.speed > 1 ? "moving" : "idle";

    if (currentState === null) currentState = state;

    if (state !== currentState) {
      if (currentSegment.length > 0) {
        segments.push(addSegmentInfo(currentSegment, currentState));
      }
      currentSegment = [];
      currentState = state;
    }

    currentSegment.push(point);

    if (index === gpsData.length - 1 && currentSegment.length > 0) {
      segments.push(addSegmentInfo(currentSegment, currentState));
    }
  });

  // 📊 Логування сегментів
  let totalGpsDistance = 0;
  let totalMovingDistance = 0;

  segments.forEach((seg, i) => {
    const { state, points, startTime, endTime, distance, driverCardId } = seg;

    totalGpsDistance += distance;
    if (state === "moving") totalMovingDistance += distance;
  });

  console.groupEnd();

  // ✅ Повертаємо тільки рухові сегменти з >3 точок
  return segments.filter(seg => seg.state === "moving" && seg.points.length > 3);
}

// 🔸 Обробка окремого сегмента
function addSegmentInfo(segmentPoints, state) {
  if (!segmentPoints.length) return null;

  let totalDistance = 0;
  for (let i = 1; i < segmentPoints.length; i++) {
    const p1 = segmentPoints[i - 1];
    const p2 = segmentPoints[i];
    const dist = haversineDistance(p1.latitude, p1.longitude, p2.latitude, p2.longitude);

    const t1 = new Date(p1.timestamp).getTime();
    const t2 = new Date(p2.timestamp).getTime();
    const dtSec = Math.max((t2 - t1) / 1000, 1);
    const speedKmh = dist / (dtSec / 3600);

    if (speedKmh < 150) {
      totalDistance += dist;
    }
  }

  // 🕓 Часові межі
  const startTime = new Date(segmentPoints[0].timestamp);
  const endTime = new Date(segmentPoints[segmentPoints.length - 1].timestamp);

  // 👨‍🔧 Визначення домінуючого водія
  const driverCounts = {};
  for (const point of segmentPoints) {
    if (!point.card_id) continue;
    driverCounts[point.card_id] = (driverCounts[point.card_id] || 0) + 1;
  }
  const dominantCardId =
    Object.keys(driverCounts).length > 0
      ? Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0][0]
      : null;

  return {
    state,
    startTime,
    endTime,
    distance: totalDistance,
    driverCardId: dominantCardId,
    points: segmentPoints,
    coordinates: segmentPoints.map(p => [p.latitude, p.longitude]),
  };
}
