import * as turf from "@turf/turf";

/*
=====================================
TIME UTILS
=====================================
*/

function getTrackTimeInfo(points) {
  if (!points || points.length < 2) {
    return {
      arrival: null,
      departure: null,
    };
  }

  const sorted = [...points].sort(
    (a, b) => new Date(a.timestamp) - new Date(b.timestamp)
  );

  return {
    arrival: new Date(sorted[0].timestamp),
    departure: new Date(sorted[sorted.length - 1].timestamp),
  };
}

function formatTime(date) {
  if (!date) return null;

  return date.toLocaleTimeString("uk-UA", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/*
=====================================
SAFE GEO
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
MAIN
=====================================
*/

export function calculateGridCoverageGrid({
  tracks,
  fieldPolygon,
  implementWidthByAssignment = {},
}) {


  if (!tracks?.length || !fieldPolygon) {
    const empty = {
      days: {},
      total: { fullHectares: 0, workedHours: 0 },
    };

    return empty;
  }

  let totalFull = 0;

  /*
  =====================================
  GROUP BY DAY
  =====================================
  */

  const daysMap = tracks.reduce((acc, track) => {
    if (!acc[track.date]) acc[track.date] = [];
    acc[track.date].push(track);
    return acc;
  }, {});

  const resultDays = {};

  /*
  =====================================
  LOOP DAYS
  =====================================
  */

  for (const date in daysMap) {
    const dayTracks = daysMap[date];

    let dayFull = 0;
    const machines = {};


    /*
    ========= TRACK LOOP =========
    */

    for (const track of dayTracks) {
      const { assignmentId, points } = track;

      if (!points || points.length < 2) continue;

      const timeInfo = getTrackTimeInfo(points);


      /*
      ========= AREA =========
      */

      // const width =
      //   implementWidthByAssignment[assignmentId] || 5.6;

      const rawWidth = implementWidthByAssignment[assignmentId];

      const width = rawWidth ?? 5.6;

      const line = turf.lineString(
        points.map((p) => [p.longitude, p.latitude])
      );

      let buffered = safeBuffer(line, width / 2);
      if (!buffered) continue;

      const clipped = safeIntersect(buffered, fieldPolygon);
      if (clipped) buffered = clipped;

      const areaHa = turf.area(buffered) / 10000;

      dayFull += areaHa;
      totalFull += areaHa;

      /*
      ========= MACHINE =========
      */

      if (!machines[assignmentId]) {
        machines[assignmentId] = {
          fullHectares: 0,
          arrivalTime: null,
          departureTime: null,
          workedHours: 0,
        };
      }

      const machine = machines[assignmentId];

      machine.fullHectares += areaHa;

      // earliest arrival
      if (!machine.arrivalTime || timeInfo.arrival < machine.arrivalTime) {
        machine.arrivalTime = timeInfo.arrival;
      }

      // latest departure
      if (!machine.departureTime || timeInfo.departure > machine.departureTime) {
        machine.departureTime = timeInfo.departure;
      }
    }

    /*
    ========= FINALIZE MACHINE TIME =========
    */

    Object.values(machines).forEach((m) => {
      if (m.arrivalTime && m.departureTime) {
        const hours =
          (m.departureTime - m.arrivalTime) / (1000 * 60 * 60);

        m.workedHours = hours > 0 ? hours : 0;
      } else {
        m.workedHours = 0;
      }

      // format
      m.arrivalTime = formatTime(m.arrivalTime);
      m.departureTime = formatTime(m.departureTime);
    });

    /*
    ========= DAY HOURS =========
    */

    const dayHours = Object.values(machines).reduce(
      (sum, m) => sum + m.workedHours,
      0
    );

    resultDays[date] = {
      fullHectares: dayFull,
      workedHours: dayHours,
      machines,
    };

  }

  /*
  =====================================
  FINAL
  =====================================
  */

  const totalHours = Object.values(resultDays).reduce(
    (sum, d) => sum + d.workedHours,
    0
  );

  const finalResult = {
    days: resultDays,
    total: {
      fullHectares: totalFull,
      workedHours: totalHours,
    },
  };

  return finalResult;
}