// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { Marker, Polyline, Popup, useMap } from "react-leaflet";
// import { useDispatch } from "react-redux";
// import { setImei } from "../../store/vehicleSlice";
// import { useVehiclesData } from "../../hooks/useVehiclesData";
// import { usePersonnelData } from "../../hooks/usePersonnelData";
// import { useTechniquesData } from "../../hooks/useTechniquesData";
// import { useGpsByImei } from "../../hooks/useGpsByImei";
// import L from "leaflet";

// import parkingIco from "../../assets/ico/parking-ico.png";
// import carIco from "../../assets/ico/car-ico.png";
// import tractorIco from "../../assets/ico/tractor-ico.png";
// import combineIco from "../../assets/ico/combine-ico.png";
// import truckIco from "../../assets/ico/truck-ico.png";
// import sprayerIco from "../../assets/ico/sprayer-ico.png"
// import anomalyIco from "../../assets/ico/warning.png";

// import { filterGpsDataByDate } from "../../helpres/trekHelpers";
// import { splitGpsSegments } from "../../helpres/splitGpsSegments";

// import MarkerClusterGroup from "react-leaflet-markercluster";
// import "leaflet.markercluster/dist/MarkerCluster.css";
// import "leaflet.markercluster/dist/MarkerCluster.Default.css";

// const TrackMarkers = ({ gpsData, selectedDate }) => {
//   const dispatch = useDispatch();
//   const map = useMap();

//   const [activeImei, setActiveImei] = useState(null);
//   const [showAllMarkers, setShowAllMarkers] = useState(false);

//   const { data: vehicles = [] } = useVehiclesData();
//   const { data: personnel = [] } = usePersonnelData();
//   const { data: imeiData } = useGpsByImei(activeImei);
//   const { data: techniques = [] } = useTechniquesData();

//   const markersRef = useRef({});

//   // reset при зміні дати
//   useEffect(() => {
//     setActiveImei(null);
//     setShowAllMarkers(false);
//     map?.closePopup();
//   }, [selectedDate, map]);

//   // ---------------- HELPERS ----------------
//   const getIconByType = (type) =>
//     ({
//       tractor: tractorIco,
//       combine: combineIco,
//       truck: truckIco,
//       car: carIco,
//       sprayer: sprayerIco, // 🔥 ДОДАТИ
//     }[type] || carIco);

//   const getColorByType = (type) =>
//     ({
//       car: "#007bff",
//       tractor: "#28a745",
//       combine: "#ffc107",
//       truck: "#dc3545",
//       sprayer: "#6f42c1", // 🔥 фіолетовий під твою іконку
//     }[type] || "#007bff");

//   const formatTime = (iso) =>
//     new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

//   const formatDuration = (secs) => {
//     if (!secs || secs <= 0) return "0 хв";
//     const h = Math.floor(secs / 3600);
//     const m = Math.floor((secs % 3600) / 60);
//     return `${h ? h + " год " : ""}${m ? m + " хв" : ""}`.trim();
//   };

//   // ---------------- DATA ----------------
//   const filteredGpsData = useMemo(
//     () => filterGpsDataByDate(gpsData, selectedDate),
//     [gpsData, selectedDate]
//   );

//   const activeVehicleData = useMemo(() => {
//     if (!activeImei) return null;

//     if (imeiData?.length) {
//       const doc = imeiData.find((d) => d.imei === activeImei);
//       return doc?.data || null;
//     }

//     const fallback = filteredGpsData.find((d) => d.imei === activeImei);
//     return fallback?.data || null;
//   }, [imeiData, filteredGpsData, activeImei]);

//   const vehicleSegments = useMemo(() => {
//     if (!activeVehicleData) return [];

//     const allSegments = splitGpsSegments(activeVehicleData);

//     return allSegments.map((seg) => {
//       const driver = personnel.find((p) => p.rfid === seg.driverCardId);
//       const vehicle = vehicles.find((v) => v.imei === activeImei);

//       return {
//         ...seg,
//         imei: activeImei,
//         driverName: driver ? `${driver.firstName} ${driver.lastName}` : null,
//         vehicleName: vehicle?.mark || "Невідома техніка",
//         vehicleType: vehicle?.vehicleType || "car",
//       };
//     });
//   }, [activeVehicleData, personnel, vehicles, activeImei]);

//   const movingSegments = useMemo(
//     () => vehicleSegments.filter((seg) => seg.type === "moving"),
//     [vehicleSegments]
//   );

//   const totalSegmentsDistance = useMemo(
//     () =>
//       movingSegments
//         .reduce((sum, seg) => sum + Number(seg.distance || 0), 0)
//         .toFixed(2),
//     [movingSegments]
//   );

//   const lastGpsPoints = useMemo(
//     () => gpsData.filter((p) => p.latitude && p.longitude),
//     [gpsData]
//   );

//   // ---------------- CLICK ----------------
//   const handleMarkerClick = (imei) => {
//     setActiveImei(imei);
//     setShowAllMarkers(true);
//     dispatch(setImei(imei));
//   };

//   // ---------------- AUTO POPUP ----------------
//   useEffect(() => {
//     if (!activeImei) return;

//     const tryOpen = () => {
//       const marker = markersRef.current[activeImei];

//       if (marker && marker._map) {
//         marker.openPopup();
//         map.panTo(marker.getLatLng());
//       } else {
//         setTimeout(tryOpen, 100);
//       }
//     };

//     setTimeout(tryOpen, 0);
//   }, [activeImei, showAllMarkers, map]);

//   const getEmojiByType = (type) =>
//     ({
//       car: "🚗",
//       tractor: "🚜",
//       combine: "🌾",
//       truck: "🚚",
//       sprayer: "💧", // або 🌿
//     }[type] || "🚗");

//   return (
//     <>
//       {/* MARKERS */}
//       <MarkerClusterGroup
//         showCoverageOnHover={false}
//         spiderfyOnMaxZoom={true}
//         zoomToBoundsOnClick={true}
//       >
//         {lastGpsPoints.map((p, i) => {
//           const vehicle = vehicles.find((v) => v.imei === p.imei);
//           const vehicleName = vehicle?.mark || "Невідома техніка";
//           const vehicleType = vehicle?.vehicleType || "car";
//           const vehicleRegNum = vehicle?.regNumber || "regNum";

//           const isActive = activeImei === p.imei;
//           const isDimmed = activeImei && !isActive;

//           return (
//             <Marker
//               key={`last-${i}`}
//               position={[p.latitude, p.longitude]}
//               icon={new L.Icon({
//                 iconUrl: getIconByType(vehicleType),
//                 iconSize: isActive ? [65, 65] : [45, 45],
//                 className: isActive
//                   ? "active-marker"
//                   : isDimmed
//                   ? "dim-marker"
//                   : "",
//               })}
//               eventHandlers={{
//                 click: () => handleMarkerClick(p.imei),
//               }}
//               ref={(ref) => {
//                 if (ref) markersRef.current[p.imei] = ref;
//               }}
//             >
//               <Popup autoPan={false} minWidth={260}>
//                 <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>
//                   <b>{getEmojiByType(vehicleType)} {vehicleName}</b> {vehicleRegNum} <br />
//                   IMEI: {p.imei}
//                   <br />
//                   🕒 {new Date(p.timestamp).toLocaleString()}
//                   <br />

//                   {(() => {
//                     const driverObj = personnel.find(
//                       (d) => d.rfid === p.io?.[157]
//                     );
//                     return driverObj ? (
//                       <div>
//                         Водій: {driverObj.firstName} {driverObj.lastName}
//                       </div>
//                     ) : (
//                       <div>Водій не визначений</div>
//                     );
//                   })()}

//                   <div>
//                     📌 BLE-тег техніки:{" "}
//                     {(() => {
//                       const tech = techniques.find(
//                         (t) => t.rfid === String(p.io?.[131])
//                       );
//                       return tech ? tech.name : "не визначено";
//                     })()}
//                   </div>

//                   {isActive && movingSegments.length > 0 && (
//                     <>
//                       <hr style={{ margin: "6px 0" }} />
//                       <b>📊 Сегменти руху</b>

//                       <div style={{ maxHeight: 200, overflowY: "auto" }}>
//                         {movingSegments.map((seg, idx) => (
//                           <div key={idx} style={{ marginBottom: 6 }}>
//                             #{idx + 1} {formatTime(seg.startTime)} →{" "}
//                             {formatTime(seg.endTime)}
//                             <br />
//                             📏 {Number(seg.distance).toFixed(2)} км · ⏳{" "}
//                             {formatDuration(seg.duration)}
//                           </div>
//                         ))}
//                       </div>

//                       <div style={{ fontWeight: 700, textAlign: "right" }}>
//                         Всього: {totalSegmentsDistance} км
//                       </div>
//                     </>
//                   )}
//                 </div>
//               </Popup>
//             </Marker>
//           );
//         })}
//       </MarkerClusterGroup>

//       {/* ROUTE */}
//       {/* {showAllMarkers &&
//         movingSegments.map((seg, idx) => (
//           <Polyline
//             key={`seg-${idx}`}
//             positions={seg.coordinates}
//             pathOptions={{
//               color: getColorByType(seg.vehicleType),
//               weight: 5,
//               opacity: 0.9,
//             }}
//           />
//         ))} */}

//       {/* ROUTE */}
      
//       {showAllMarkers &&
//         movingSegments.map((seg, idx) => (
//           <Polyline
//             key={`seg-${idx}`}
//             positions={seg.coordinates}
//             pathOptions={{
//               color: getColorByType(seg.vehicleType),
//               weight: 5,
//               opacity: 0.9,
//             }}
//           />
//         ))}

//         {/* SPEED CONTROL POINTS */}
//       {/* SPEED CONTROL POINTS */}
//         {showAllMarkers &&
//           movingSegments.map((seg, segIdx) =>
//             seg.points
//               ?.filter((_, i) => i % 30 === 0) // кожна 30-та точка
//               .map((point, idx) => {
//                 if (!point.speed || point.speed <= 0) return null;

//                 return (
//                   <Marker
//                     key={`speed-${segIdx}-${idx}`}
//                     position={[point.latitude, point.longitude]}
//                     icon={new L.Icon({
//                       iconUrl:
//                         point.speed > 90
//                           ? anomalyIco // червоний якщо перевищення
//                           : carIco,   // звичайний
//                       iconSize: [16, 16],
//                     })}
//                   >
//                     <Popup autoPan={false}>
//                       <div style={{ fontSize: 12 }}>
//                         <b>🚜 {seg.vehicleName}</b>
//                         <br />
//                         🕒 {new Date(point.timestamp).toLocaleString()}
//                         <br />
//                         🚀 Швидкість: <b>{point.speed} км/год</b>
//                       </div>
//                     </Popup>
//                   </Marker>
//                 );
//               })
//           )}


//       {/* PARKINGS */}
//       {showAllMarkers &&
//         vehicleSegments
//           .filter((seg) => seg.type === "parking")
//           .map((seg, idx) => (
//             <Marker
//               key={`parking-${idx}`}
//               position={seg.coordinates.at(-1)}
//               icon={new L.Icon({
//                 iconUrl: parkingIco,
//                 iconSize: [26, 26],
//               })}
//             >
//               <Popup autoPan={false}>
//                 <b>Стоянка</b>
//                 <br />
//                 🚜 {seg.vehicleName}
//                 <br />
//                 ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
//                 <br />
//                 ⏳ {formatDuration(seg.duration)}
//               </Popup>
//             </Marker>
//           ))}


//       {/* ANOMALIES */}
//         {showAllMarkers &&
//           vehicleSegments
//             .filter((seg) => seg.type === "anomaly")
//             .map((seg, idx) => (
//               <Marker
//                 key={`anom-${idx}`}
//                 position={seg.coordinates.at(-1)}
//                 icon={new L.Icon({
//                   iconUrl: anomalyIco,
//                   iconSize: [26, 26],
//                 })}
//               >
//                 <Popup autoPan={false}>
//                   <b>⚠️ Аномалія</b>
//                   <br />
//                   🚜 {seg.vehicleName}
//                   <br />
//                   ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
//                   <br />
//                   ⏳ {formatDuration(seg.duration)}
//                 </Popup>
//               </Marker>
//             ))}


//     </>
//   );
// };

// export default TrackMarkers;
















import React, { useMemo, useState, useEffect, useRef } from "react";
import { Marker, Polyline, Popup, useMap } from "react-leaflet";
import { useDispatch } from "react-redux";
import { setImei } from "../../store/vehicleSlice";
import { useVehiclesData } from "../../hooks/useVehiclesData";
import { usePersonnelData } from "../../hooks/usePersonnelData";
import { useTechniquesData } from "../../hooks/useTechniquesData";
import { useGpsByImei } from "../../hooks/useGpsByImei";
import L from "leaflet";

import parkingIco from "../../assets/ico/parking-ico.png";
import carIco from "../../assets/ico/car-ico.png";
import tractorIco from "../../assets/ico/tractor-ico.png";
import combineIco from "../../assets/ico/combine-ico.png";
import truckIco from "../../assets/ico/truck-ico.png";
import sprayerIco from "../../assets/ico/sprayer-ico.png";
import anomalyIco from "../../assets/ico/warning.png";

import { filterGpsDataByDate } from "../../helpres/trekHelpers";
import { splitGpsSegments } from "../../helpres/splitGpsSegments";

import MarkerClusterGroup from "react-leaflet-markercluster";

const TrackMarkers = ({ gpsData, selectedDate }) => {
  const dispatch = useDispatch();
  const map = useMap();

  const [activeImei, setActiveImei] = useState(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const { data: vehicles = [] } = useVehiclesData();
  const { data: personnel = [] } = usePersonnelData();
  const { data: imeiData } = useGpsByImei(activeImei);
  const { data: techniques = [] } = useTechniquesData();

  const markersRef = useRef({});

  /* ---------------- RESET ---------------- */
  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    map?.closePopup();
  }, [selectedDate, map]);

  /* ---------------- MAPS (PERFORMANCE) ---------------- */

  const vehiclesMap = useMemo(() => {
    const map = {};
    vehicles.forEach((v) => (map[v.imei] = v));
    return map;
  }, [vehicles]);

  const personnelMap = useMemo(() => {
    const map = {};
    personnel.forEach((p) => (map[p.rfid] = p));
    return map;
  }, [personnel]);

  const techniquesMap = useMemo(() => {
    const map = {};
    techniques.forEach((t) => (map[t.rfid] = t));
    return map;
  }, [techniques]);

  /* ---------------- HELPERS ---------------- */

  const normalizeType = (type) =>
    (type || "car").toLowerCase();

  const getIconByType = (type) =>
    ({
      tractor: tractorIco,
      combine: combineIco,
      truck: truckIco,
      car: carIco,
      sprayer: sprayerIco,
    }[type] || carIco);

  const getColorByType = (type) =>
    ({
      car: "#007bff",
      tractor: "#28a745",
      combine: "#ffc107",
      truck: "#dc3545",
      sprayer: "#6f42c1",
    }[type] || "#007bff");

  const getEmojiByType = (type) =>
    ({
      car: "🚗",
      tractor: "🚜",
      combine: "🌾",
      truck: "🚚",
      sprayer: "💧",
    }[type] || "🚗");

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (secs) => {
    if (!secs || secs <= 0) return "0 хв";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h ? h + " год " : ""}${m ? m + " хв" : ""}`.trim();
  };

  /* ---------------- DATA ---------------- */

  const filteredGpsData = useMemo(
    () => filterGpsDataByDate(gpsData, selectedDate),
    [gpsData, selectedDate]
  );

  const activeVehicleData = useMemo(() => {
    if (!activeImei) return null;

    if (imeiData?.length) {
      return imeiData.find((d) => d.imei === activeImei)?.data || null;
    }

    return (
      filteredGpsData.find((d) => d.imei === activeImei)?.data || null
    );
  }, [imeiData, filteredGpsData, activeImei]);

  const vehicleSegments = useMemo(() => {
    if (!activeVehicleData) return [];

    const vehicle = vehiclesMap[activeImei];
    const type = normalizeType(vehicle?.vehicleType);

    return splitGpsSegments(activeVehicleData).map((seg) => {
      const driver = personnelMap[seg.driverCardId];

      return {
        ...seg,
        imei: activeImei,
        vehicleName: vehicle?.mark || "Невідома техніка",
        vehicleType: type,
        driverName: driver
          ? `${driver.firstName} ${driver.lastName}`
          : null,
      };
    });
  }, [activeVehicleData, vehiclesMap, personnelMap, activeImei]);

  const movingSegments = useMemo(
    () => vehicleSegments.filter((s) => s.type === "moving"),
    [vehicleSegments]
  );

  const totalDistance = useMemo(
    () =>
      movingSegments
        .reduce((sum, s) => sum + Number(s.distance || 0), 0)
        .toFixed(2),
    [movingSegments]
  );

  const lastGpsPoints = useMemo(
    () => gpsData.filter((p) => p.latitude && p.longitude),
    [gpsData]
  );

  /* ---------------- ACTIONS ---------------- */

  const handleMarkerClick = (imei) => {
    setActiveImei(imei);
    setShowAllMarkers(true);
    dispatch(setImei(imei));
  };

  /* ---------------- AUTO POPUP ---------------- */

  useEffect(() => {
    if (!activeImei) return;

    const tryOpen = () => {
      const marker = markersRef.current[activeImei];
      if (marker && marker._map) {
        marker.openPopup();
        map.panTo(marker.getLatLng());
      } else {
        setTimeout(tryOpen, 100);
      }
    };

    setTimeout(tryOpen, 0);
  }, [activeImei, showAllMarkers, map]);

  /* ---------------- RENDER ---------------- */

  return (
    <>
      <MarkerClusterGroup>
        {lastGpsPoints.map((p, i) => {
          const vehicle = vehiclesMap[p.imei];
          const type = normalizeType(vehicle?.vehicleType);

          const isActive = activeImei === p.imei;
          const isDimmed = activeImei && !isActive;

          return (
            <Marker
              key={i}
              position={[p.latitude, p.longitude]}
              icon={new L.Icon({
                iconUrl: getIconByType(type),
                iconSize: isActive ? [65, 65] : [45, 45],
                className: isActive
                  ? "active-marker"
                  : isDimmed
                  ? "dim-marker"
                  : "",
              })}
              eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
              ref={(ref) => {
                if (ref) markersRef.current[p.imei] = ref;
              }}
            >
              <Popup minWidth={260} maxWidth={300}>
                <div style={{ fontSize: 12 }}>
                  <b>
                    {getEmojiByType(type)}{" "}
                    {vehicle?.mark || "Невідомо"}
                  </b>{" "}
                  {vehicle?.regNumber || "—"}
                  <br />
                  IMEI: {p.imei}
                  <br />
                  🕒 {new Date(p.timestamp).toLocaleString()}
                  <br />

                  {(() => {
                    const driver = personnelMap[p.io?.[157]];
                    return driver ? (
                      <div>
                        Водій: {driver.firstName} {driver.lastName}
                      </div>
                    ) : (
                      <div>Водій не визначений</div>
                    );
                  })()}

                  <div>
                    📌 BLE:{" "}
                    {techniquesMap[String(p.io?.[131])]?.name ||
                      "не визначено"}
                  </div>

                  {isActive && movingSegments.length > 0 && (
                    <>
                      <hr />
                      <b>📊 Сегменти</b>

                      <div
                        style={{
                          maxHeight: 180,
                          overflowY: "auto",
                          marginTop: 6,
                          paddingRight: 4,
                        }}
                      >
                        {movingSegments.map((seg, idx) => (
                          <div key={idx} style={{ marginBottom: 6 }}>
                            #{idx + 1} {formatTime(seg.startTime)} →{" "}
                            {formatTime(seg.endTime)}
                            <br />
                            📏 {Number(seg.distance).toFixed(2)} км · ⏳{" "}
                            {formatDuration(seg.duration)}
                          </div>
                        ))}
                      </div>

                      <div
                        style={{
                          fontWeight: 700,
                          marginTop: 6,
                          textAlign: "right",
                        }}
                      >
                        Всього: {totalDistance} км
                      </div>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* ROUTES */}
      {showAllMarkers &&
        movingSegments.map((seg, i) => (
          <Polyline
            key={i}
            positions={seg.coordinates}
            pathOptions={{
              color: getColorByType(seg.vehicleType),
              weight: 5,
            }}
          />
        ))}

      {/* SPEED */}
      {showAllMarkers &&
        movingSegments.map((seg, i) =>
          seg.points
            ?.filter((_, idx) => idx % 30 === 0)
            .map((p, j) => (
              <Marker
                key={`${i}-${j}`}
                position={[p.latitude, p.longitude]}
                icon={new L.Icon({
                  iconUrl:
                    p.speed > 90
                      ? anomalyIco
                      : getIconByType(seg.vehicleType),
                  iconSize: [16, 16],
                })}
              />
            ))
        )}
    </>
  );
};

export default TrackMarkers;




// import React, { useMemo, useState, useEffect, useRef } from "react";
// import { Marker, Polyline, Popup, useMap } from "react-leaflet";
// import { useDispatch } from "react-redux";
// import { setImei } from "../../store/vehicleSlice";
// import { useVehiclesData } from "../../hooks/useVehiclesData";
// import { useGpsByImei } from "../../hooks/useGpsByImei";
// import L from "leaflet";

// import carIco from "../../assets/ico/car-ico.png";

// const TrackMarkersRaw = ({ gpsData = [] }) => {
//   const dispatch = useDispatch();
//   const map = useMap();

//   const [activeImei, setActiveImei] = useState(null);

//   const { data: vehicles = [] } = useVehiclesData();

//   // 🔥 тягнемо ПОВНИЙ трек
//   const { data: imeiData = [] } = useGpsByImei(activeImei);

//   const markersRef = useRef({});

//   // ---------------- LAST POINTS ----------------
//   const lastGpsPoints = useMemo(() => {
//     return gpsData.filter((p) => p.latitude && p.longitude);
//   }, [gpsData]);

//   // ---------------- FULL TRACK ----------------
//   const activeTrack = useMemo(() => {
//     if (!activeImei) return [];

//     const device = imeiData.find((d) => d.imei === activeImei);
//     if (!device?.data) return [];

//     return device.data
//       .filter((p) => p.latitude && p.longitude)
//       .map((p) => [p.latitude, p.longitude]);
//   }, [imeiData, activeImei]);

//   // ---------------- CLICK ----------------
//   const handleMarkerClick = (imei) => {
//     setActiveImei(imei);
//     dispatch(setImei(imei));
//   };

//   // ---------------- AUTO CENTER ----------------
//   useEffect(() => {
//     if (!activeImei || !activeTrack.length) return;

//     map.fitBounds(activeTrack);
//   }, [activeTrack, activeImei, map]);

//   return (
//     <>
//       {/* 🔹 MARKERS */}
//       {lastGpsPoints.map((p, i) => {
//         const vehicle = vehicles.find((v) => v.imei === p.imei);
//         const vehicleName = vehicle?.mark || "Невідома техніка";

//         return (
//           <Marker
//             key={i}
//             position={[p.latitude, p.longitude]}
//             icon={new L.Icon({
//               iconUrl: carIco,
//               iconSize: [30, 30],
//             })}
//             eventHandlers={{
//               click: () => handleMarkerClick(p.imei),
//             }}
//             ref={(ref) => {
//               if (ref) markersRef.current[p.imei] = ref;
//             }}
//           >
//             <Popup>
//               <div>
//                 <b>🚜 {vehicleName}</b>
//                 <br />
//                 IMEI: {p.imei}
//                 <br />
//                 🕒 {new Date(p.timestamp).toLocaleString()}
//               </div>
//             </Popup>
//           </Marker>
//         );
//       })}

//       {/* 🔥 RAW TRACK */}
//       {activeTrack.length > 1 && (
//         <Polyline
//           positions={activeTrack}
//           pathOptions={{
//             color: "red",
//             weight: 4,
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default TrackMarkersRaw;