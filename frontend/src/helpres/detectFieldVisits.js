import * as turf from "@turf/turf";

const MIN_VISIT_DURATION_SEC = 120;   // мінімальний заїзд (2 хв)
const MIN_EXIT_DURATION_SEC = 300;    // мінімальний виїзд (5 хв)

export function detectFieldVisits(points = [], bufferedField) {
  if (!points.length || !bufferedField) return [];

  const visits = [];

  let inside = false;
  let entryTime = null;

  let outsideStart = null;

  for (let i = 0; i < points.length; i++) {
    const p = points[i];

    if (!p.latitude || !p.longitude) continue;

    const point = turf.point([p.longitude, p.latitude]);

    const isInside = turf.booleanPointInPolygon(
      point,
      bufferedField
    );

    const timestamp = new Date(p.timestamp);

    /*
    =====================================================
    🚜 В'ЇЗД
    =====================================================
    */
    if (isInside && !inside) {
      inside = true;
      entryTime = timestamp;
      outsideStart = null;
    }

    /*
    =====================================================
    🚜 РУХ ВСЕРЕДИНІ
    =====================================================
    */
    else if (isInside && inside) {
      outsideStart = null;
    }

    /*
    =====================================================
    🚜 ПОЗА ПОЛЕМ
    =====================================================
    */
    else if (!isInside && inside) {

      // почали виїзд
      if (!outsideStart) {
        outsideStart = timestamp;
      }

      const outsideDurationSec =
        (timestamp - outsideStart) / 1000;

      // якщо техніка реально поза полем >= 5 хв
      if (outsideDurationSec >= MIN_EXIT_DURATION_SEC) {

        const visitDurationSec =
          (outsideStart - entryTime) / 1000;

        // додаємо тільки якщо заїзд був довший за 2 хв
        if (visitDurationSec >= MIN_VISIT_DURATION_SEC) {
          visits.push({
            in: entryTime,
            out: outsideStart
          });
        }

        inside = false;
        entryTime = null;
        outsideStart = null;
      }
    }
  }

  /*
  =====================================================
  🚜 Якщо день закінчився, а техніка ще в полі
  =====================================================
  */
  if (inside && entryTime) {
    visits.push({
      in: entryTime,
      out: null
    });
  }

  return visits;
}