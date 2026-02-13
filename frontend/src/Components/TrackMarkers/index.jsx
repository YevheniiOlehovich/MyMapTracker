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
import anomalyIco from "../../assets/ico/warning.png";

import { filterGpsDataByDate } from "../../helpres/trekHelpers";
import { splitGpsSegments } from "../../helpres/splitGpsSegments";

import MarkerClusterGroup from "react-leaflet-markercluster";
import "leaflet.markercluster/dist/MarkerCluster.css";
import "leaflet.markercluster/dist/MarkerCluster.Default.css";

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

  // reset при зміні дати
  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    map?.closePopup();
  }, [selectedDate, map]);

  // ---------------- HELPERS ----------------
  const getIconByType = (type) =>
    ({ tractor: tractorIco, combine: combineIco, truck: truckIco, car: carIco }[
      type
    ] || carIco);

  const getColorByType = (type) =>
    ({ car: "#007bff", tractor: "#28a745", combine: "#ffc107", truck: "#dc3545" }[
      type
    ] || "#007bff");

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });

  const formatDuration = (secs) => {
    if (!secs || secs <= 0) return "0 хв";
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h ? h + " год " : ""}${m ? m + " хв" : ""}`.trim();
  };

  // ---------------- DATA ----------------
  const filteredGpsData = useMemo(
    () => filterGpsDataByDate(gpsData, selectedDate),
    [gpsData, selectedDate]
  );

  const activeVehicleData = useMemo(() => {
    if (!activeImei) return null;

    if (imeiData?.length) {
      const doc = imeiData.find((d) => d.imei === activeImei);
      return doc?.data || null;
    }

    const fallback = filteredGpsData.find((d) => d.imei === activeImei);
    return fallback?.data || null;
  }, [imeiData, filteredGpsData, activeImei]);

  const vehicleSegments = useMemo(() => {
    if (!activeVehicleData) return [];

    const allSegments = splitGpsSegments(activeVehicleData);

    return allSegments.map((seg) => {
      const driver = personnel.find((p) => p.rfid === seg.driverCardId);
      const vehicle = vehicles.find((v) => v.imei === activeImei);

      return {
        ...seg,
        imei: activeImei,
        driverName: driver ? `${driver.firstName} ${driver.lastName}` : null,
        vehicleName: vehicle?.mark || "Невідома техніка",
        vehicleType: vehicle?.vehicleType || "car",
      };
    });
  }, [activeVehicleData, personnel, vehicles, activeImei]);

  const movingSegments = useMemo(
    () => vehicleSegments.filter((seg) => seg.type === "moving"),
    [vehicleSegments]
  );

  const totalSegmentsDistance = useMemo(
    () =>
      movingSegments
        .reduce((sum, seg) => sum + Number(seg.distance || 0), 0)
        .toFixed(2),
    [movingSegments]
  );

  const lastGpsPoints = useMemo(
    () => gpsData.filter((p) => p.latitude && p.longitude),
    [gpsData]
  );

  // ---------------- CLICK ----------------
  const handleMarkerClick = (imei) => {
    setActiveImei(imei);
    setShowAllMarkers(true);
    dispatch(setImei(imei));
  };

  // ---------------- AUTO POPUP ----------------
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

  return (
    <>
      {/* MARKERS */}
      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        zoomToBoundsOnClick={true}
      >
        {lastGpsPoints.map((p, i) => {
          const vehicle = vehicles.find((v) => v.imei === p.imei);
          const vehicleName = vehicle?.mark || "Невідома техніка";
          const vehicleType = vehicle?.vehicleType || "car";
          const vehicleRegNum = vehicle?.regNumber || "regNum";

          const isActive = activeImei === p.imei;
          const isDimmed = activeImei && !isActive;

          return (
            <Marker
              key={`last-${i}`}
              position={[p.latitude, p.longitude]}
              icon={new L.Icon({
                iconUrl: getIconByType(vehicleType),
                iconSize: isActive ? [65, 65] : [45, 45],
                className: isActive
                  ? "active-marker"
                  : isDimmed
                  ? "dim-marker"
                  : "",
              })}
              eventHandlers={{
                click: () => handleMarkerClick(p.imei),
              }}
              ref={(ref) => {
                if (ref) markersRef.current[p.imei] = ref;
              }}
            >
              <Popup autoPan={false} minWidth={260}>
                <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>
                  <b>🚜 {vehicleName}</b> {vehicleRegNum} <br />
                  IMEI: {p.imei}
                  <br />
                  🕒 {new Date(p.timestamp).toLocaleString()}
                  <br />

                  {(() => {
                    const driverObj = personnel.find(
                      (d) => d.rfid === p.io?.[157]
                    );
                    return driverObj ? (
                      <div>
                        Водій: {driverObj.firstName} {driverObj.lastName}
                      </div>
                    ) : (
                      <div>Водій не визначений</div>
                    );
                  })()}

                  <div>
                    📌 BLE-тег техніки:{" "}
                    {(() => {
                      const tech = techniques.find(
                        (t) => t.rfid === String(p.io?.[131])
                      );
                      return tech ? tech.name : "не визначено";
                    })()}
                  </div>

                  {isActive && movingSegments.length > 0 && (
                    <>
                      <hr style={{ margin: "6px 0" }} />
                      <b>📊 Сегменти руху</b>

                      <div style={{ maxHeight: 200, overflowY: "auto" }}>
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

                      <div style={{ fontWeight: 700, textAlign: "right" }}>
                        Всього: {totalSegmentsDistance} км
                      </div>
                    </>
                  )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* ROUTE */}
      {showAllMarkers &&
        movingSegments.map((seg, idx) => (
          <Polyline
            key={`seg-${idx}`}
            positions={seg.coordinates}
            pathOptions={{
              color: getColorByType(seg.vehicleType),
              weight: 5,
              opacity: 0.9,
            }}
          />
        ))}
      {/* PARKINGS */}
      {showAllMarkers &&
        vehicleSegments
          .filter((seg) => seg.type === "parking")
          .map((seg, idx) => (
            <Marker
              key={`parking-${idx}`}
              position={seg.coordinates.at(-1)}
              icon={new L.Icon({
                iconUrl: parkingIco,
                iconSize: [26, 26],
              })}
            >
              <Popup autoPan={false}>
                <b>Стоянка</b>
                <br />
                🚜 {seg.vehicleName}
                <br />
                ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
                <br />
                ⏳ {formatDuration(seg.duration)}
              </Popup>
            </Marker>
          ))}


      {/* ANOMALIES */}
        {showAllMarkers &&
          vehicleSegments
            .filter((seg) => seg.type === "anomaly")
            .map((seg, idx) => (
              <Marker
                key={`anom-${idx}`}
                position={seg.coordinates.at(-1)}
                icon={new L.Icon({
                  iconUrl: anomalyIco,
                  iconSize: [26, 26],
                })}
              >
                <Popup autoPan={false}>
                  <b>⚠️ Аномалія</b>
                  <br />
                  🚜 {seg.vehicleName}
                  <br />
                  ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
                  <br />
                  ⏳ {formatDuration(seg.duration)}
                </Popup>
              </Marker>
            ))}


    </>
  );
};

export default TrackMarkers;






// Наглядно показать дані з трекера

// import React, { useMemo, useState, useEffect } from 'react';
// import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
// import { useDispatch } from 'react-redux';
// import { setImei } from '../../store/vehicleSlice';
// import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { usePersonnelData } from '../../hooks/usePersonnelData';
// import { useTechniquesData } from '../../hooks/useTechniquesData';
// import { useGpsByImei } from '../../hooks/useGpsByImei';
// import L from 'leaflet';

// import carIco from '../../assets/ico/car-ico.png';
// import tractorIco from '../../assets/ico/tractor-ico.png';
// import combineIco from '../../assets/ico/combine-ico.png';
// import truckIco from '../../assets/ico/truck-ico.png';

// import { filterGpsDataByDate } from '../../helpres/trekHelpers';

// const TrackMarkers = ({ gpsData, selectedDate }) => {
//   const dispatch = useDispatch();
//   const map = useMap();

//   const [activeImei, setActiveImei] = useState(null);
//   const { data: vehicles = [] } = useVehiclesData();
//   const { data: personnel = [] } = usePersonnelData();
//   const { data: imeiData } = useGpsByImei(activeImei);
//   const { data: techniques = [] } = useTechniquesData();

//   useEffect(() => {
//     setActiveImei(null);
//     map?.closePopup();
//   }, [selectedDate, map]);

//   const getIconByType = type =>
//     ({ tractor: tractorIco, combine: combineIco, truck: truckIco, car: carIco }[type] || carIco);

//   const getColorByType = type =>
//     ({ car: '#007bff', tractor: '#28a745', combine: '#ffc107', truck: '#dc3545' }[type] || '#007bff');

//   const filteredGpsData = useMemo(
//     () => filterGpsDataByDate(gpsData, selectedDate),
//     [gpsData, selectedDate]
//   );

//   const activeVehicleData = useMemo(() => {
//     if (!activeImei) return null;

//     if (imeiData?.length) {
//       const doc = imeiData.find(d => d.imei === activeImei);
//       return doc?.data || null;
//     }

//     const fallback = filteredGpsData.find(d => d.imei === activeImei);
//     return fallback?.data || null;
//   }, [imeiData, filteredGpsData, activeImei]);

//   const handleMarkerClick = imei => {
//     setActiveImei(imei);
//     dispatch(setImei(imei));
//   };

//   // ---------------- POSITIONS FOR POLYLINE ----------------
//   const polylinePositions = useMemo(() => {
//     if (!activeVehicleData) return [];
//     return activeVehicleData
//       .filter(p => p.latitude && p.longitude)
//       .map(p => [p.latitude, p.longitude]);
//   }, [activeVehicleData]);

//   // ---------------- LAST POINT ----------------
//   const lastGpsPoints = useMemo(() => {
//     return gpsData.filter(p => p.latitude && p.longitude);
//   }, [gpsData]);

//   return (
//     <>
//       {/* LAST POINT MARKERS */}
//       {lastGpsPoints.map((p, i) => {
//         const vehicle = vehicles.find(v => v.imei === p.imei);
//         const vehicleName = vehicle?.mark || 'Невідома техніка';
//         const vehicleType = vehicle?.vehicleType || 'car';

//         return (
//           <Marker
//             key={`last-${i}`}
//             position={[p.latitude, p.longitude]}
//             icon={new L.Icon({ iconUrl: getIconByType(vehicleType), iconSize: [50, 50] })}
//             eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
//           >
//             <Popup>
//               <b>{vehicleName}</b><br />
//               IMEI: {p.imei}<br />
//               🕒 {new Date(p.timestamp).toLocaleString()}
//             </Popup>
//           </Marker>
//         );
//       })}

//       {/* POLYLINE FOR ACTIVE VEHICLE */}
//       {polylinePositions.length > 1 && (
//         <Polyline
//           positions={polylinePositions}
//           pathOptions={{
//             color: getColorByType(activeVehicleData?.[0]?.vehicleType || 'car'),
//             weight: 5,
//             opacity: 0.85,
//           }}
//         />
//       )}
//     </>
//   );
// };

// export default TrackMarkers;
