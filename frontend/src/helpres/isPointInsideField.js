/**
 * Перевірка чи точка всередині полігону (ray casting)
 *
 * coordsPoint = [lon, lat]
 * coordsPolygon = [[lon, lat], [lon, lat], ...]
 */
export function isPointInsideField(coordsPoint, coordsPolygon) {


  const x = coordsPoint[0];
  const y = coordsPoint[1];

  let inside = false;

  for (
    let i = 0, j = coordsPolygon.length - 1;
    i < coordsPolygon.length;
    j = i++
  ) {
    const xi = coordsPolygon[i][0];
    const yi = coordsPolygon[i][1];
    const xj = coordsPolygon[j][0];
    const yj = coordsPolygon[j][1];

    const intersect =
      yi > y !== yj > y &&
      x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;

    if (intersect) inside = !inside;
  }

  return inside;
}