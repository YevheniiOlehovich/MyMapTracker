import * as turf from "@turf/turf";

export function calculateGridCoverageGrid({
  tracks,
  fieldPolygon,
  cellSize = 3,
  implementWidthByAssignment = {},
  coverageCorrection = 0.95
}) {

  if (!fieldPolygon || !tracks?.length) return null;

  /*
  =====================================
  FIELD → MERCATOR
  =====================================
  */

  const fieldMerc = turf.toMercator(fieldPolygon);
  const polygonCoords = fieldMerc.geometry.coordinates;

  const bbox = turf.bbox(fieldMerc);

  const minX = bbox[0];
  const minY = bbox[1];
  const maxX = bbox[2];
  const maxY = bbox[3];

  const gridWidth = Math.ceil((maxX - minX) / cellSize);
  const gridHeight = Math.ceil((maxY - minY) / cellSize);

  const totalCells = gridWidth * gridHeight;
  const cellArea = cellSize * cellSize;

  /*
  =====================================
  GRID ARRAYS
  =====================================
  */

  const processed = new Uint8Array(totalCells);
  const mask = new Uint8Array(totalCells);

  /*
  =====================================
  FIELD MASK
  =====================================
  */

  for (let y = 0; y < gridHeight; y++) {
    for (let x = 0; x < gridWidth; x++) {

      const cx = minX + x * cellSize + cellSize / 2;
      const cy = minY + y * cellSize + cellSize / 2;

      if (pointInPolygon(cx, cy, polygonCoords)) {
        mask[y * gridWidth + x] = 1;
      }
    }
  }

  /*
  =====================================
  RESULT STRUCTURE
  =====================================
  */

  const resultByMachine = {};

  const sortedTracks = [...tracks].sort((a, b) =>
    a.date.localeCompare(b.date)
  );

  /*
  =====================================
  PROCESS TRACKS
  =====================================
  */

  for (const track of sortedTracks) {

    const { assignmentId, date, points } = track;
    if (!points || points.length < 2) continue;

    const implementWidth =
      implementWidthByAssignment[assignmentId] || 5.6;

    const halfWidth = implementWidth / 2;
    const range = Math.ceil(halfWidth / cellSize);

    if (!resultByMachine[assignmentId]) {
      resultByMachine[assignmentId] = {
        fullCells: 0,
        overlapCells: 0,
        netCells: 0,
        days: {}
      };
    }

    if (!resultByMachine[assignmentId].days[date]) {
      resultByMachine[assignmentId].days[date] = {
        fullCells: 0,
        overlapCells: 0,
        netCells: 0
      };
    }

    const machine = resultByMachine[assignmentId];
    const day = machine.days[date];

    const dayVisited = new Uint8Array(totalCells);

    /*
    GPS → MERCATOR
    */

    const mercPoints = points.map(p =>
      turf.toMercator([p.longitude, p.latitude])
    );

    for (let i = 0; i < mercPoints.length - 1; i++) {

      const p1 = mercPoints[i];
      const p2 = mercPoints[i + 1];

      const dx = p2[0] - p1[0];
      const dy = p2[1] - p1[1];

      const length = Math.sqrt(dx * dx + dy * dy);
      if (length < 0.001) continue;

      const steps = Math.ceil(length / cellSize);

      for (let s = 0; s <= steps; s++) {

        const t = s / steps;

        const x = p1[0] + dx * t;
        const y = p1[1] + dy * t;

        const gridX = Math.floor((x - minX) / cellSize);
        const gridY = Math.floor((y - minY) / cellSize);

        for (let ox = -range; ox <= range; ox++) {
          for (let oy = -range; oy <= range; oy++) {

            const cx = gridX + ox;
            const cy = gridY + oy;

            if (
              cx < 0 ||
              cy < 0 ||
              cx >= gridWidth ||
              cy >= gridHeight
            ) continue;

            const index = cy * gridWidth + cx;

            if (!mask[index]) continue;

            const centerX =
              minX + cx * cellSize + cellSize / 2;

            const centerY =
              minY + cy * cellSize + cellSize / 2;

            const dist = distancePointToSegment(
              centerX,
              centerY,
              p1[0],
              p1[1],
              p2[0],
              p2[1]
            );

            if (dist > halfWidth) continue;
            if (dayVisited[index]) continue;

            dayVisited[index] = 1;

            machine.fullCells++;
            day.fullCells++;

            if (processed[index] === 0) {

              processed[index] = 1;

              machine.netCells++;
              day.netCells++;

            } else {

              machine.overlapCells++;
              day.overlapCells++;

            }
          }
        }
      }
    }
  }

  /*
  =====================================
  TOTAL PROCESSED
  =====================================
  */

  let processedCount = 0;

  for (let i = 0; i < processed.length; i++) {
    if (processed[i]) processedCount++;
  }

  /*
  =====================================
  HECTARES
  =====================================
  */

  for (const machine of Object.values(resultByMachine)) {

    machine.fullHectares =
      ((machine.fullCells * cellArea) / 10000) * coverageCorrection;

    machine.overlapHectares =
      ((machine.overlapCells * cellArea) / 10000) * coverageCorrection;

    machine.netHectares =
      ((machine.netCells * cellArea) / 10000) * coverageCorrection;

    for (const day of Object.values(machine.days)) {

      day.fullHectares =
        ((day.fullCells * cellArea) / 10000) * coverageCorrection;

      day.overlapHectares =
        ((day.overlapCells * cellArea) / 10000) * coverageCorrection;

      day.netHectares =
        ((day.netCells * cellArea) / 10000) * coverageCorrection;
    }
  }

  const totalHectares =
    ((processedCount * cellArea) / 10000) * coverageCorrection;

  return {
    totalHectares,
    machines: resultByMachine
  };
}

/*
=====================================
POINT IN POLYGON
=====================================
*/

function pointInPolygon(x, y, polygon) {

  let inside = false;
  const ring = polygon[0];

  for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {

    const xi = ring[i][0], yi = ring[i][1];
    const xj = ring[j][0], yj = ring[j][1];

    const intersect =
      ((yi > y) !== (yj > y)) &&
      (x < (xj - xi) * (y - yi) / (yj - yi) + xi);

    if (intersect) inside = !inside;
  }

  return inside;
}

/*
=====================================
DISTANCE
=====================================
*/

function distancePointToSegment(px, py, x1, y1, x2, y2) {

  const A = px - x1;
  const B = py - y1;
  const C = x2 - x1;
  const D = y2 - y1;

  const dot = A * C + B * D;
  const lenSq = C * C + D * D;

  let param = -1;

  if (lenSq !== 0) param = dot / lenSq;

  let xx, yy;

  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }

  const dx = px - xx;
  const dy = py - yy;

  return Math.sqrt(dx * dx + dy * dy);
}