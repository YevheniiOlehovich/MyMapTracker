export function splitGpsSegments(gpsData = []) {
  const segments = [];
  let currentSegment = [];
  let currentState = null;

  gpsData.forEach((point, index) => {
    const state = point.speed > 1 ? "moving" : "idle";

    if (currentState === null) currentState = state;

    if (state !== currentState) {
      segments.push({ state: currentState, points: currentSegment });
      currentSegment = [];
      currentState = state;
    }

    currentSegment.push(point);

    if (index === gpsData.length - 1) {
      segments.push({ state: currentState, points: currentSegment });
    }
  });

  // ✅ Тільки рух і більше 3 точок
  return segments.filter(
    seg => seg.state === "moving" && seg.points.length > 3
  );
}
