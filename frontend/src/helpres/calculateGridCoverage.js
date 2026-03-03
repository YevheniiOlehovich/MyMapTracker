import * as turf from "@turf/turf";

export function calculateGridCoverage({
  tracks,
  cellSize = 3,
  implementWidth = 5.6,
}) {
  const halfWidth = implementWidth / 2;
  const cellArea = cellSize * cellSize;

  // 🔹 ВАЖЛИВО: сортуємо по даті
  const sortedTracks = [...tracks].sort(
    (a, b) => new Date(a.date) - new Date(b.date)
  );

  const globalProcessedCells = new Set();
  const machineGlobalSet = {};
  const resultByMachine = {};

  sortedTracks.forEach((track) => {
    const { assignmentId, date, points } = track;

    if (!machineGlobalSet[assignmentId]) {
      machineGlobalSet[assignmentId] = new Set();
    }

    if (!resultByMachine[assignmentId]) {
      resultByMachine[assignmentId] = {
        fullCells: 0,
        overlapCells: 0,
        netCells: 0,
        days: {},
      };
    }

    if (!resultByMachine[assignmentId].days[date]) {
      resultByMachine[assignmentId].days[date] = {
        fullCells: 0,
        overlapCells: 0,
        netCells: 0,
      };
    }

    const dayUniqueCells = new Set(); // щоб в межах дня не дублювати

    for (let i = 0; i < points.length - 1; i++) {
      const p1 = turf.toMercator(
        turf.point([points[i].longitude, points[i].latitude])
      ).geometry.coordinates;

      const p2 = turf.toMercator(
        turf.point([points[i + 1].longitude, points[i + 1].latitude])
      ).geometry.coordinates;

      const minX = Math.min(p1[0], p2[0]) - halfWidth;
      const maxX = Math.max(p1[0], p2[0]) + halfWidth;
      const minY = Math.min(p1[1], p2[1]) - halfWidth;
      const maxY = Math.max(p1[1], p2[1]) + halfWidth;

      const startX = Math.floor(minX / cellSize);
      const endX = Math.floor(maxX / cellSize);
      const startY = Math.floor(minY / cellSize);
      const endY = Math.floor(maxY / cellSize);

      for (let x = startX; x <= endX; x++) {
        for (let y = startY; y <= endY; y++) {
          const cellCenterX = x * cellSize + cellSize / 2;
          const cellCenterY = y * cellSize + cellSize / 2;

          const dist = distancePointToSegment(
            cellCenterX,
            cellCenterY,
            p1[0],
            p1[1],
            p2[0],
            p2[1]
          );

          if (dist <= halfWidth) {
            const cellId = `${x}_${y}`;

            if (!dayUniqueCells.has(cellId)) {
              dayUniqueCells.add(cellId);

              resultByMachine[assignmentId].fullCells++;

              resultByMachine[assignmentId].days[date].fullCells++;

              if (globalProcessedCells.has(cellId)) {
                resultByMachine[assignmentId].overlapCells++;
                resultByMachine[assignmentId].days[date].overlapCells++;
              } else {
                resultByMachine[assignmentId].netCells++;
                resultByMachine[assignmentId].days[date].netCells++;
                globalProcessedCells.add(cellId);
              }

              machineGlobalSet[assignmentId].add(cellId);
            }
          }
        }
      }
    }
  });

  // Переводимо в гектари
  Object.values(resultByMachine).forEach((machine) => {
    machine.fullHectares = (machine.fullCells * cellArea) / 10000;
    machine.overlapHectares = (machine.overlapCells * cellArea) / 10000;
    machine.netHectares = (machine.netCells * cellArea) / 10000;

    Object.values(machine.days).forEach((day) => {
      day.fullHectares = (day.fullCells * cellArea) / 10000;
      day.overlapHectares = (day.overlapCells * cellArea) / 10000;
      day.netHectares = (day.netCells * cellArea) / 10000;
    });
  });

  const totalHectares =
    [...globalProcessedCells].length * cellArea / 10000;

  return {
    totalHectares,
    machines: resultByMachine,
  };
}

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