import * as turf from "@turf/turf";

const CELL_SIZE = 3; // 🔥 можна 3 якщо треба точніше

/*
=====================================
SAFE
=====================================
*/

function safeBuffer(line, width) {
  try {
    return turf.buffer(line, width, { units: "meters" });
  } catch {
    return null;
  }
}

function safeIntersect(a, b) {
  try {
    return turf.intersect(a, b);
  } catch {
    return null;
  }
}

/*
=====================================
CELL POLYGON
=====================================
*/

function createCellPolygon(x, y, size) {
  return turf.polygon([[
    [x, y],
    [x + size, y],
    [x + size, y + size],
    [x, y + size],
    [x, y],
  ]]);
}

function getCellKey(x, y) {
  return `${x}_${y}`;
}

/*
=====================================
MAIN
=====================================
*/

export function calculateGridCoverageGrid({
  tracks,
  fieldPolygon,
  implementWidthByAssignment = {},
}) {
  if (!tracks?.length || !fieldPolygon) {
    return {
      days: {},
      total: { fullHectares: 0, netHectares: 0 },
    };
  }

  const coveredCells = new Set();
  let totalFull = 0;

  const daysMap = {};

  tracks.forEach((track) => {
    if (!daysMap[track.date]) {
      daysMap[track.date] = [];
    }
    daysMap[track.date].push(track);
  });

  const resultDays = {};

  /*
  =====================================
  LOOP DAYS
  =====================================
  */

  for (const date of Object.keys(daysMap)) {
    const dayTracks = daysMap[date];

    let dayFull = 0;
    const newCells = new Set();
    const machines = {};

    for (const track of dayTracks) {
      const { assignmentId, points } = track;

      if (!points || points.length < 2) continue;

      const width =
        implementWidthByAssignment[assignmentId] || 5.6;

      const line = turf.lineString(
        points.map((p) => [p.longitude, p.latitude])
      );

      let buffered = safeBuffer(line, width / 2);
      if (!buffered) continue;

      const clipped = safeIntersect(buffered, fieldPolygon);
      if (clipped) buffered = clipped;

      const area = turf.area(buffered) / 10000;
      dayFull += area;
      totalFull += area;

      if (!machines[assignmentId]) {
        machines[assignmentId] = {
          fullHectares: 0,
          netHectares: 0,
        };
      }

      machines[assignmentId].fullHectares += area;

      /*
      ========= GRID =========
      */

      const bbox = turf.bbox(buffered);

      const minX = Math.floor(bbox[0] / CELL_SIZE) * CELL_SIZE;
      const minY = Math.floor(bbox[1] / CELL_SIZE) * CELL_SIZE;
      const maxX = Math.ceil(bbox[2] / CELL_SIZE) * CELL_SIZE;
      const maxY = Math.ceil(bbox[3] / CELL_SIZE) * CELL_SIZE;

      for (let x = minX; x <= maxX; x += CELL_SIZE) {
        for (let y = minY; y <= maxY; y += CELL_SIZE) {
          const key = getCellKey(x, y);

          if (coveredCells.has(key)) continue;

          const cell = createCellPolygon(x, y, CELL_SIZE);

          try {
            if (turf.booleanIntersects(cell, buffered)) {
              newCells.add(key);

              machines[assignmentId].netHectares +=
                (CELL_SIZE * CELL_SIZE) / 10000;
            }
          } catch {}
        }
      }
    }

    newCells.forEach((c) => coveredCells.add(c));

    const cellArea = (CELL_SIZE * CELL_SIZE) / 10000;

    resultDays[date] = {
      fullHectares: dayFull,
      netHectares: newCells.size * cellArea,
      machines,
    };
  }

  /*
  =====================================
  TOTAL
  =====================================
  */

  const cellArea = (CELL_SIZE * CELL_SIZE) / 10000;

  const totalNet = coveredCells.size * cellArea;

  return {
    days: resultDays,
    total: {
      fullHectares: totalFull,
      netHectares: totalNet,
    },
  };
}