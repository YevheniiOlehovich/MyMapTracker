import * as turf from "@turf/turf";

export function filterPointsInsideField(points = [], fieldPolygon) {
  if (!points.length || !fieldPolygon) return [];

  return points.filter((pt) => {
    if (!pt.latitude || !pt.longitude) return false;

    const point = turf.point([pt.longitude, pt.latitude]);

    return turf.booleanPointInPolygon(point, fieldPolygon);
  });
}