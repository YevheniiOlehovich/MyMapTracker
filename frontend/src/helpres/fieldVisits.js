import * as turf from "@turf/turf";

/**
 * Перевірка, чи точка всередині полігону
 * coordsPoint = [lon, lat]
 * coordsPolygon = [[lon, lat], [lon, lat], ...]
 */
export function isPointInsideField(coordsPoint, coordsPolygon) {
  let x = coordsPoint[0],
    y = coordsPoint[1];
  let inside = false;

  for (let i = 0, j = coordsPolygon.length - 1; i < coordsPolygon.length; j = i++) {
    const xi = coordsPolygon[i][0],
      yi = coordsPolygon[i][1];
    const xj = coordsPolygon[j][0],
      yj = coordsPolygon[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}

/**
 * Safe union — не падає якщо одна з геометрій null
 */
function safeUnion(a, b) {
  if (!a && b) return b;
  if (a && !b) return a;
  if (!a && !b) return null;

  try {
    return turf.union(a, b);
  } catch (e) {
    console.warn("Union error:", e);
    return a; // fallback — не ламаємо процес
  }
}

/**
 * Розрахунок площі обробки:
 * - по кожному дню окремо (dayArea)
 * - загальна площа без перекриттів (totalArea)
 *
 * gpsByDays = [{ date, points: [{ data: [{ latitude, longitude, timestamp }] }] }]
 * fieldPolygon = [[lon, lat], ...]
 * equipmentWidth = meters
 */
export function calculateFieldVisitsWithUnion(
  gpsByDays,
  fieldPolygon,
  equipmentWidth
) {
  const visitsByDay = [];
  let globalUnion = null; // 🔵 загальний union для total

  gpsByDays.forEach((day) => {
    const points = day.points?.[0]?.data || [];

    // якщо нема GPS
    if (!points.length) {
      visitsByDay.push({
        date: day.date,
        visits: [],
        dayArea: 0,
      });
      return;
    }

    let insideField = false;
    let entryStart = null;
    let pointsInField = [];

    let dayUnion = null; // 🟢 union тільки для цього дня
    const visits = [];

    points.forEach((p) => {
      const timestamp = new Date(p.timestamp);
      const coords = [p.longitude, p.latitude];
      const isInside = isPointInsideField(coords, fieldPolygon);

      // ➜ в'їзд у поле
      if (isInside && !insideField) {
        insideField = true;
        entryStart = timestamp;
        pointsInField = [coords];
      }

      // ➜ рух всередині поля
      else if (isInside && insideField) {
        pointsInField.push(coords);
      }

      // ➜ виїзд з поля
      else if (!isInside && insideField) {
        insideField = false;

        if (pointsInField.length > 1) {
          const line = turf.lineString(pointsInField);
          const buffered = turf.buffer(line, equipmentWidth / 2, {
            units: "meters",
          });

          dayUnion = safeUnion(dayUnion, buffered);
          globalUnion = safeUnion(globalUnion, buffered);
        }

        visits.push({
          in: entryStart,
          out: timestamp,
        });

        pointsInField = [];
        entryStart = null;
      }
    });

    // ➜ якщо день закінчився, а техніка ще в полі
    if (insideField && pointsInField.length > 1) {
      const line = turf.lineString(pointsInField);
      const buffered = turf.buffer(line, equipmentWidth / 2, {
        units: "meters",
      });

      dayUnion = safeUnion(dayUnion, buffered);
      globalUnion = safeUnion(globalUnion, buffered);

      visits.push({
        in: entryStart,
        out: new Date(points.at(-1).timestamp),
      });
    }

    // 🧮 площа тільки за день
    const dayArea = dayUnion ? turf.area(dayUnion) / 10000 : 0; // га

    visitsByDay.push({
      date: day.date,
      visits,
      dayArea,
    });
  });

  // 🧮 загальна площа без перекриттів між днями
  const totalArea = globalUnion ? turf.area(globalUnion) / 10000 : 0;

  return {
    visitsByDay, // [{ date, visits, dayArea }]
    totalArea,   // одна загальна площа
  };
}