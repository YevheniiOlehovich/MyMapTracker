// import React, { useMemo, useState, useEffect } from 'react';
// import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
// import { useDispatch } from 'react-redux';
// import { setImei } from '../../store/vehicleSlice';
// import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { usePersonnelData } from '../../hooks/usePersonnelData';
// import L from 'leaflet';

// import parkingIco from '../../assets/ico/parking-ico.png';
// import carIco from '../../assets/ico/car-ico.png';
// import tractorIco from '../../assets/ico/tractor-ico.png';
// import combineIco from '../../assets/ico/combine-ico.png';
// import truckIco from '../../assets/ico/truck-ico.png';
// import anomalyIco from '../../assets/ico/warning.png';

// import {
//   isPointInUkraine,
//   filterGpsDataByDate,
// } from '../../helpres/trekHelpers';
// import {
//   getStationarySegments,
//   getAnomalyMarkers,
// } from '../../helpres/trackCalculations';
// import { splitGpsSegments } from '../../helpres/splitGpsSegments';

// const TrackMarkers = ({ gpsData, selectedDate }) => {
//   const dispatch = useDispatch();
//   const map = useMap();
//   const [activeImei, setActiveImei] = useState(null);
//   const [showAllMarkers, setShowAllMarkers] = useState(false);
//   const { data: vehicles = [] } = useVehiclesData();
//   const { data: personnel = [] } = usePersonnelData();

//   /** ♻️ Скидання при зміні дати */
//   useEffect(() => {
//     setActiveImei(null);
//     setShowAllMarkers(false);
//     if (map) map.closePopup();
//   }, [selectedDate, map]);

//   /** 🚗 Іконки за типом техніки */
//   const getIconByType = type =>
//     ({
//       tractor: tractorIco,
//       combine: combineIco,
//       truck: truckIco,
//       car: carIco,
//     }[type] || carIco);

//   /** 🎨 Кольори ліній за типом техніки */
//   const getColorByType = type =>
//     ({
//       car: '#007bff',      // голубий
//       tractor: '#28a745',  // зелений
//       combine: '#ffc107',  // жовтий
//       truck: '#dc3545',    // червоний
//     }[type] || '#007bff');

//   /** 🏷️ Назва техніки */
//   const getVehicleName = imei =>
//     vehicles.find(v => v.imei === imei)?.mark || 'Невідома техніка';

//   /** 🕒 Формат часу */
//   const formatTime = iso =>
//     new Date(iso).toLocaleTimeString([], {
//       hour: '2-digit',
//       minute: '2-digit',
//     });

//   /** 🕓 Формат тривалості */
//   const formatDuration = secs => {
//     if (!secs || secs <= 0) return '0 хв';
//     const h = Math.floor(secs / 3600);
//     const m = Math.floor((secs % 3600) / 60);
//     return `${h ? h + ' год ' : ''}${m ? m + ' хв' : ''}`.trim();
//   };

//   /** 🔎 Фільтр по даті */
//   const filteredGpsData = useMemo(
//     () => filterGpsDataByDate(gpsData, selectedDate),
//     [gpsData, selectedDate]
//   );

//   /** 🚘 Поточне авто */
//   const activeVehicleData = filteredGpsData.find(
//     item => item.imei === activeImei
//   )?.data;

//   /** 🧭 Сегменти руху з домінуючим водієм */
//   const vehicleSegments = useMemo(() => {
//     if (!activeVehicleData) return [];

//     const segments = splitGpsSegments(activeVehicleData);

//     return segments.map(seg => {
//       const driver = personnel.find(p => p.rfid === seg.driverCardId);
//       const driverName = driver ? `${driver.firstName} ${driver.lastName}` : null;
//       return { ...seg, driverName };
//     });
//   }, [activeVehicleData, personnel]);

//   /** 📏 Загальна дистанція */
//   const totalSegmentsDistance = useMemo(() => {
//     return vehicleSegments
//       .reduce((sum, seg) => sum + Number(seg.distance || 0), 0)
//       .toFixed(2);
//   }, [vehicleSegments]);

//   /** 🧩 Останні точки всіх авто */
//   const lastGpsPoints = useMemo(
//     () =>
//       filteredGpsData
//         .map(item => {
//           const valid = item.data.filter(
//             p =>
//               p.latitude &&
//               p.longitude &&
//               isPointInUkraine(p.latitude, p.longitude)
//           );
//           return valid.length ? { ...valid.at(-1), imei: item.imei } : null;
//         })
//         .filter(Boolean),
//     [filteredGpsData]
//   );

//   /** 🅿️ Стоянки */
//   const stationarySegments = useMemo(
//     () => getStationarySegments(activeVehicleData, activeImei),
//     [activeVehicleData, activeImei]
//   );

//   /** ⚠️ Аномалії */
//   const anomalyMarkers = useMemo(
//     () => getAnomalyMarkers(activeVehicleData, activeImei),
//     [activeVehicleData, activeImei]
//   );

//   /** 🎯 Обробка кліку */
//   const handleMarkerClick = imei => {
//     if (activeImei === imei) setShowAllMarkers(v => !v);
//     else {
//       setActiveImei(imei);
//       setShowAllMarkers(true);
//     }
//     dispatch(setImei(imei));
//   };

//   return (
//     <>
//       {/* 🚗 Маркери останніх точок */}
//       {lastGpsPoints.map((p, i) => {
//         const vehicle = vehicles.find(v => v.imei === p.imei);
//         const vehicleName = vehicle?.mark || 'Невідома техніка';
//         const vehicleType = vehicle?.vehicleType || 'car';
//         const lineColor = getColorByType(vehicleType);

//         return (
//           <Marker
//             key={i}
//             position={[p.latitude, p.longitude]}
//             icon={
//               new L.Icon({ iconUrl: getIconByType(vehicleType), iconSize: [50, 50] })
//             }
//             eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
//           >
//             <Popup autoPan={false} minWidth={260}>
//               <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>
//                 <div><b>🚜 Транспорт:</b> {vehicleName}</div>
//                 <div><b>IMEI:</b> {p.imei}</div>
//                 <div><b>🕒 Остання точка:</b> {new Date(p.timestamp).toLocaleString()}</div>

//                 {vehicleSegments.length > 0 && (
//                   <>
//                     <hr style={{ margin: '6px 0' }} />
//                     <b>📊 Сегменти руху:</b>

//                     <div style={{ marginTop: 6 }}>
//                       {vehicleSegments.map((seg, idx) => (
//                         <div
//                           key={idx}
//                           style={{
//                             marginBottom: 8,
//                             paddingBottom: 6,
//                             borderBottom: '1px solid #ececec',
//                           }}
//                         >
//                           <div style={{ fontWeight: 600 }}>
//                             Сегмент {idx + 1} — {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
//                           </div>

//                           <div style={{ color: '#222' }}>
//                             🪪 Водій: <b>{seg.driverName || seg.driverCardId || '—'}</b> &nbsp; | &nbsp;
//                             📏 <b>{Number(seg.distance).toFixed(2)} км</b>
//                           </div>
//                         </div>
//                       ))}
//                     </div>

//                     <div
//                       style={{
//                         marginTop: 4,
//                         fontWeight: 700,
//                         textAlign: 'right',
//                       }}
//                     >
//                       🔹 Всього: {totalSegmentsDistance} км
//                     </div>
//                   </>
//                 )}
//               </div>
//             </Popup>

//             {/* 🚦 Полілінії сегментів */}
//             {showAllMarkers &&
//               vehicleSegments.map((seg, idx) => (
//                 <Polyline
//                   key={`seg-${idx}`}
//                   positions={seg.points.map(p => [p.latitude, p.longitude])}
//                   pathOptions={{
//                     color: lineColor,
//                     weight: 5,
//                     opacity: 0.8,
//                   }}
//                 >
//                   <Popup autoPan={false}>
//                     <b>Сегмент #{idx + 1}</b> <br />
//                     🪪 Водій: <b>{seg.driverName || seg.driverCardId || '—'}</b> <br />
//                     ⏱ {formatTime(seg.points[0]?.timestamp)} →{' '}
//                     {formatTime(seg.points.at(-1)?.timestamp)} <br />
//                     📏 {Number(seg.distance).toFixed(2)} км
//                   </Popup>
//                 </Polyline>
//               ))}
//           </Marker>
//         );
//       })}

//       {/* 🅿️ Стоянки */}
//       {showAllMarkers &&
//         stationarySegments.flatMap((seg, s) =>
//           seg.slice(0, -1).map((p, i) => (
//             <Marker
//               key={`park-${s}-${i}`}
//               position={[p.latitude, p.longitude]}
//               icon={new L.Icon({ iconUrl: parkingIco, iconSize: [25, 25] })}
//             >
//               <Popup autoPan={false}>
//                 <b>Стоянка</b><br />
//                 {Math.floor(p.duration / 60)} хв
//               </Popup>
//             </Marker>
//           ))
//         )}

//       {/* ⚠️ Аномалії */}
//       {showAllMarkers &&
//         anomalyMarkers.map((p, i) => (
//           <Marker
//             key={`anom-${i}`}
//             position={[p.latitude, p.longitude]}
//             icon={new L.Icon({ iconUrl: anomalyIco, iconSize: [25, 25] })}
//           >
//             <Popup autoPan={false}>
//               <b>Втрачено сигнал</b><br />
//               З: {new Date(p.anomalyStart).toLocaleString()}<br />
//               До: {new Date(p.anomalyEnd).toLocaleString()}
//             </Popup>
//           </Marker>
//         ))}
//     </>
//   );
// };

// export default TrackMarkers;


import React, { useMemo, useState, useEffect } from 'react';
import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setImei } from '../../store/vehicleSlice';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import L from 'leaflet';

import parkingIco from '../../assets/ico/parking-ico.png';
import carIco from '../../assets/ico/car-ico.png';
import tractorIco from '../../assets/ico/tractor-ico.png';
import combineIco from '../../assets/ico/combine-ico.png';
import truckIco from '../../assets/ico/truck-ico.png';
import anomalyIco from '../../assets/ico/warning.png';

import { isPointInUkraine, filterGpsDataByDate } from '../../helpres/trekHelpers';
import { splitGpsSegments } from '../../helpres/splitGpsSegments';

const TrackMarkers = ({ gpsData, selectedDate }) => {
  const dispatch = useDispatch();
  const map = useMap();
  const [activeImei, setActiveImei] = useState(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);
  const { data: vehicles = [] } = useVehiclesData();
  const { data: personnel = [] } = usePersonnelData();

  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    map?.closePopup();
  }, [selectedDate, map]);

  const getIconByType = type =>
    ({ tractor: tractorIco, combine: combineIco, truck: truckIco, car: carIco }[type] || carIco);

  const getColorByType = type =>
    ({ car: '#007bff', tractor: '#28a745', combine: '#ffc107', truck: '#dc3545' }[type] || '#007bff');

  const formatTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDuration = secs => {
    if (!secs || secs <= 0) return '0 хв';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h ? h + ' год ' : ''}${m ? m + ' хв' : ''}`.trim();
  };

  const filteredGpsData = useMemo(() => filterGpsDataByDate(gpsData, selectedDate), [gpsData, selectedDate]);

  const activeVehicleData = filteredGpsData.find(item => item.imei === activeImei)?.data;
  
  console.log(activeVehicleData)

  const vehicleSegments = useMemo(() => {
    if (!activeVehicleData) return [];

    const allSegments = splitGpsSegments(activeVehicleData); // об’єднаний хелпер

    return allSegments.map(seg => {
      const driver = personnel.find(p => p.rfid === seg.driverCardId);
      const driverName = driver ? `${driver.firstName} ${driver.lastName}` : null;

      const vehicle = vehicles.find(v => v.imei === activeImei);
      const vehicleName = vehicle?.mark || 'Невідома техніка';

      return {
        ...seg,
        driverName,
        vehicleName,
        imei: activeImei,
      };
    });
  }, [activeVehicleData, personnel, vehicles, activeImei]);

  const movingSegments = useMemo(() => vehicleSegments.filter(seg => seg.type === 'moving'), [vehicleSegments]);

  const totalSegmentsDistance = useMemo(() => {
    return movingSegments.reduce((sum, seg) => sum + Number(seg.distance || 0), 0).toFixed(2);
  }, [movingSegments]);

  const lastGpsPoints = useMemo(() => {
    return filteredGpsData
      .map(item => {
        const valid = item.data.filter(
          p => p.latitude && p.longitude && isPointInUkraine(p.latitude, p.longitude)
        );
        return valid.length ? { ...valid.at(-1), imei: item.imei } : null;
      })
      .filter(Boolean);
  }, [filteredGpsData]);

  const handleMarkerClick = imei => {
    if (activeImei === imei) setShowAllMarkers(v => !v);
    else {
      setActiveImei(imei);
      setShowAllMarkers(true);
    }
    dispatch(setImei(imei));
  };

  return (
    <>
      {/* Маркери останніх точок */}
      {lastGpsPoints.map((p, i) => {
        const vehicle = vehicles.find(v => v.imei === p.imei);
        const vehicleName = vehicle?.mark || 'Невідома техніка';
        const vehicleType = vehicle?.vehicleType || 'car';
        const lineColor = getColorByType(vehicleType);

        return (
          <Marker
            key={`last-${i}`}
            position={[p.latitude, p.longitude]}
            icon={new L.Icon({ iconUrl: getIconByType(vehicleType), iconSize: [50, 50] })}
            eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
          >
            <Popup autoPan={false} minWidth={260}>
              <div style={{ fontSize: 12.5, lineHeight: 1.3 }}>
                <div><b>🚜 Транспорт:</b> {vehicleName}</div>
                <div><b>IMEI:</b> {p.imei}</div>
                <div><b>🕒 Остання точка:</b> {new Date(p.timestamp).toLocaleString()}</div>

                {movingSegments.length > 0 && (
                  <>
                    <hr style={{ margin: '6px 0' }} />
                    <b>📊 Сегменти руху:</b>

                    {/* Контейнер зі скролом */}
                    <div
                      style={{
                        marginTop: 6,
                        maxHeight: 200,      // висота Popup (регулюєш під себе)
                        overflowY: 'auto',   // вертикальний скрол
                        paddingRight: 4,     // щоб скрол не заходив на текст
                      }}
                    >
                      {movingSegments.map((seg, idx) => (
                        <div
                          key={idx}
                          style={{
                            marginBottom: 8,
                            paddingBottom: 6,
                            borderBottom: '1px solid #ececec',
                          }}
                        >
                          <div style={{ fontWeight: 600 }}>
                            #{idx + 1} — {seg.type.toUpperCase()} <br />
                            ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}
                          </div>
                          <div style={{ color: '#222' }}>
                            🪪 Водій: <b>{seg.driverName || seg.driverCardId || '—'}</b> &nbsp;|&nbsp;
                            📏 <b>{Number(seg.distance).toFixed(2)} км</b> &nbsp;|&nbsp;
                            ⏳ {formatDuration(seg.duration)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div style={{ marginTop: 4, fontWeight: 700, textAlign: 'right' }}>
                      🔹 Всього в русі: {totalSegmentsDistance} км
                    </div>
                  </>
                )}
              </div>
            </Popup>

          </Marker>
        );
      })}

      {/* Полілінії руху */}
      {showAllMarkers &&
        movingSegments.map((seg, idx) => (
          <Polyline
            key={`seg-${idx}`}
            positions={seg.coordinates}
            pathOptions={{ color: getColorByType(seg.vehicleType || 'car'), weight: 5, opacity: 0.8 }}
          >
            <Popup autoPan={false}>
              <b>Рух #{idx + 1}</b><br />
              ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}<br />
              📏 {Number(seg.distance).toFixed(2)} км<br />
              🪪 {seg.driverName || seg.driverCardId || '—'}
            </Popup>
          </Polyline>
        ))}

      
      {/* Стоянки */}
        {showAllMarkers &&
          vehicleSegments
            .filter(seg => seg.type === 'idle')
            .map((seg, idx) => (
              <Marker
                key={`idle-${idx}`}
                position={seg.coordinates.at(-1)}
                icon={new L.Icon({ iconUrl: parkingIco, iconSize: [25, 25] })}
              >
                <Popup autoPan={false}>
                  <b>Стоянка</b><br />
                  🚜 {seg.vehicleName}<br />
                  IMEI: {seg.imei}<br />
                  🪪 Водій: {seg.driverName || seg.driverCardId || '—'}<br />
                  ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}<br />
                  ⏳ {formatDuration(seg.duration)}
                </Popup>
              </Marker>
            ))}

        {/* Аномалії */}
        {showAllMarkers &&
          vehicleSegments
            .filter(seg => seg.type === 'anomaly')
            .map((seg, idx) => (
              <Marker
                key={`anom-${idx}`}
                position={seg.coordinates.at(-1)}
                icon={new L.Icon({ iconUrl: anomalyIco, iconSize: [25, 25] })}
              >
                <Popup autoPan={false}>
                  <b>⚠️ Аномалія</b><br />
                  🚜 {seg.vehicleName}<br />
                  IMEI: {seg.imei}<br />
                  🪪 Водій: {seg.driverName || seg.driverCardId || '—'}<br />
                  ⏱ {formatTime(seg.startTime)} → {formatTime(seg.endTime)}<br />
                  ⏳ {formatDuration(seg.duration)}
                </Popup>
              </Marker>
            ))}

    </>
  );
};

export default TrackMarkers;
