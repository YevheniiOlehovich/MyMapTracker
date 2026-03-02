import * as turf from "@turf/turf";

const MAX_DISTANCE_METERS = 1200;
const MAX_SPEED_KMH = 80;
const MIN_TIME_DIFF_SEC = 5;

export function cleanGpsTrack(points = []) {
  if (!points.length) return [];

  const sorted = [...points].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  const cleaned = [];
  let prev = null;

  for (const point of sorted) {
    const { latitude, longitude, timestamp } = point;

    if (
      !latitude ||
      !longitude ||
      latitude === 0 ||
      longitude === 0 ||
      Math.abs(latitude) > 90 ||
      Math.abs(longitude) > 180
    ) {
      continue;
    }

    if (!prev) {
      cleaned.push(point);
      prev = point;
      continue;
    }

    const prevTime = new Date(prev.timestamp);
    const currentTime = new Date(timestamp);

    const timeDiffSec = (currentTime - prevTime) / 1000;

    if (timeDiffSec < MIN_TIME_DIFF_SEC) {
      continue;
    }

    const from = turf.point([prev.longitude, prev.latitude]);
    const to = turf.point([longitude, latitude]);

    const distanceMeters =
      turf.distance(from, to, { units: "kilometers" }) * 1000;

    const speedKmh = (distanceMeters / 1000) / (timeDiffSec / 3600);

    const isTeleport =
      distanceMeters > MAX_DISTANCE_METERS ||
      speedKmh > MAX_SPEED_KMH;

    if (isTeleport) {
      // 🔥 КЛЮЧОВЕ:
      // дозволяємо перезапустити ланцюг
      prev = point;
      continue;
    }

    cleaned.push(point);
    prev = point;
  }

  return cleaned;
}