// import React, { useMemo, useEffect, useState } from 'react';
// import { Marker, Polyline, Popup } from 'react-leaflet';
// import { useDispatch, useSelector } from 'react-redux';
// import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
// // import { useGroupsData } from '../../hooks/useGroupsData';
// import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { usePersonnelData } from '../../hooks/usePersonnelData';    
// import { haversineDistance } from '../../helpres/distance';
// import L from 'leaflet';
// import parkingIco from '../../assets/ico/parking-ico.png';
// import carIco from '../../assets/ico/car-ico.png';
// import tractorIco from '../../assets/ico/tractor-ico.png';
// import combineIco from '../../assets/ico/combine-ico.png';  
// import truckIco from '../../assets/ico/truck-ico.png';

// const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
//     const dispatch = useDispatch();
//     const [showParkingMarkers, setShowParkingMarkers] = useState(false);

//     console.log(gpsData)

//     // Отримуємо дані груп з 
//     // const { data: groups = [], isLoading: isGroupsLoading, isError: isGroupsError, error: groupsError } = useGroupsData();
//     const { data: vehicles = [] } = useVehiclesData();
//     const { data: personnel = [] } = usePersonnelData();

//     console.log(vehicles)
//     console.log(personnel)
//     // if (isGroupsLoading) return <p>Завантаження груп...</p>;
//     // if (isGroupsError) return <p>Помилка завантаження груп: {groupsError.message}</p>;

//     // const getVehicleTypeByImei = (imei) => {
//     //     if (!Array.isArray(groups)) {
//     //         console.error('Groups is not an array:', groups);
//     //         return 'car'; // Тип за замовчуванням
//     //     }

//     //     for (const group of groups) {
//     //         const vehicle = group.vehicles.find((v) => v.imei === imei);
//     //         if (vehicle) {
//     //             return vehicle.vehicleType;
//     //         }
//     //     }
//     //     return 'car'; // Тип за замовчуванням
//     // };

//     const getVehicleTypeByImei = (imei) => {
//         const vehicle = vehicles.find((v) => v.imei === imei);
//         return vehicle?.vehicleType || 'car';
//     };

//     const filteredGpsData = useMemo(() => {
//         if (!gpsData || !selectedDate) return [];
//         const selectedDateFormatted = selectedDate.split('T')[0];
//         return gpsData.filter(item => item.date === selectedDateFormatted);
//     }, [gpsData, selectedDate]);

//     const routeCoordinates = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];
//         return selectedVehicleData.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0).map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude]);
//     }, [filteredGpsData, selectedImei]);

//     const totalDistance = useMemo(() => {
//         if (routeCoordinates.length < 2) return 0;

//         return routeCoordinates.reduce((sum, coord, index, array) => {
//             if (index === 0) return sum;
//             const [lat1, lon1] = array[index - 1];
//             const [lat2, lon2] = coord;
//             return sum + haversineDistance(lat1, lon1, lat2, lon2);
//         }, 0).toFixed(2);
//     }, [routeCoordinates]);

//     const lastGpsPoints = useMemo(() => {
//         return filteredGpsData.map(item => {
//             const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
//             return validData.length > 0 ? { ...validData[validData.length - 1], imei: item.imei } : null;
//         }).filter(point => point !== null);
//     }, [filteredGpsData]);

//     const stationarySegments = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];

//         const segments = [];
//         let currentSegment = [];

//         selectedVehicleData.data.forEach((gpsPoint, index, array) => {
//             if (index === 0) return;
//             const prevPoint = array[index - 1];
//             if (gpsPoint.latitude === prevPoint.latitude && gpsPoint.longitude === prevPoint.longitude) {
//                 currentSegment.push(gpsPoint);
//             } else {
//                 if (currentSegment.length > 0) {
//                     segments.push(currentSegment);
//                     currentSegment = [];
//                 }
//             }
//         });

//         if (currentSegment.length > 0) {
//             segments.push(currentSegment);
//         }

//         // Обчислюємо тривалість стоянки для кожного сегмента
//         return segments.map(segment => {
//             const startTime = new Date(segment[0].timestamp);
//             const endTime = new Date(segment[segment.length - 1].timestamp);
//             const duration = (endTime - startTime) / 1000; // Тривалість у секундах
//             return segment.map(point => ({ ...point, duration }));
//         });
//     }, [filteredGpsData, selectedImei]);

//     const handleMarkerClick = (imei) => {
//         dispatch(setImei(imei));
//         dispatch(toggleShowTrack());
//         setShowParkingMarkers(!showParkingMarkers);
//     };

//     const getIconByType = (type) => {
//         switch (type) {
//             case 'car':
//                 return carIco;
//             case 'tractor':
//                 return tractorIco;
//             case 'combine':
//                 return combineIco;
//             case 'truck':
//                 return truckIco;
//             default:
//                 return carIco;
//         }
//     };

//     return (
//         <>
//             {showTrack && routeCoordinates.length > 0 && (
//                 <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
//             )}

//             {lastGpsPoints.map((point, index) => {
//                 const vehicleType = getVehicleTypeByImei(point.imei);
//                 return (
//                     <Marker key={index} position={[point.latitude, point.longitude]} icon={new L.Icon({
//                         iconUrl: getIconByType(vehicleType),
//                         iconSize: [50, 50], // Розмір іконки
//                         iconAnchor: [12, 25], // Точка прив'язки іконки
//                         popupAnchor: [0, -25] // Точка прив'язки попапу
//                     })} zIndexOffset={1000} eventHandlers={{ click: () => handleMarkerClick(point.imei) }}>
//                         <Popup>
//                             <strong>Остання точка</strong> <br />
//                             Час: {new Date(point.timestamp).toLocaleString()} <br />
//                             IMEI: {point.imei} <br />
//                             Пройдено: {totalDistance} км
//                         </Popup>
//                     </Marker>
//                 );
//             })}

//             {showParkingMarkers && stationarySegments.map((segment, segmentIndex) => (
//                 segment.slice(0, -1).map((point, pointIndex) => (
//                     <Marker key={`stationary-${segmentIndex}-${pointIndex}`} position={[point.latitude, point.longitude]} icon={new L.Icon({
//                         iconUrl: parkingIco,
//                         iconSize: [25, 25], // Розмір іконки
//                         iconAnchor: [12, 25], // Точка прив'язки іконки
//                         popupAnchor: [0, -25] // Точка прив'язки попапу
//                     })} zIndexOffset={500}>
//                         <Popup>
//                             <strong>Техніка стоїть</strong> <br />
//                             Час: {new Date(point.timestamp).toLocaleString()} <br />
//                             IMEI: {point.imei} <br />
//                             Стоїть: {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
//                         </Popup>
//                     </Marker>
//                 ))
//             ))}
//         </>
//     );
// };

// export default TrackMarkers;















// import React, { useMemo, useEffect, useState } from 'react';
// import { Marker, Polyline, Popup } from 'react-leaflet';
// import { useDispatch } from 'react-redux';
// import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
// import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { usePersonnelData } from '../../hooks/usePersonnelData';    
// import { haversineDistance } from '../../helpres/distance';
// import L from 'leaflet';
// import parkingIco from '../../assets/ico/parking-ico.png';
// import carIco from '../../assets/ico/car-ico.png';
// import tractorIco from '../../assets/ico/tractor-ico.png';
// import combineIco from '../../assets/ico/combine-ico.png';  
// import truckIco from '../../assets/ico/truck-ico.png';

// const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
//     const dispatch = useDispatch();
//     const [showParkingMarkers, setShowParkingMarkers] = useState(false);

//     const { data: vehicles = [] } = useVehiclesData();
//     const { data: personnel = [] } = usePersonnelData();

//     console.log(vehicles)

//     // --- Отримуємо тип техніки по IMEI ---
//     const getVehicleTypeByImei = (imei) => {
//         const vehicle = vehicles.find((v) => v.imei === imei);
//         return vehicle?.vehicleType || 'car';
//     };

//     // --- Отримуємо назву техніки по IMEI ---
//     const getVehicleNameByImei = (imei) => {
//         const vehicle = vehicles.find((v) => v.imei === imei);
//         return vehicle?.name || 'Невідома техніка';
//     };

//     // --- Знаходимо водія по RFID карті ---
//     const getDriverByCardId = (cardId) => {
//         if (!cardId) return null;
//         return personnel.find((p) => p.rfid === cardId) || null;
//     };

//     const filteredGpsData = useMemo(() => {
//         if (!gpsData || !selectedDate) return [];
//         const selectedDateFormatted = selectedDate.split('T')[0];
//         return gpsData.filter(item => item.date === selectedDateFormatted);
//     }, [gpsData, selectedDate]);

//     const routeCoordinates = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];
//         return selectedVehicleData.data
//             .filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0)
//             .map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude]);
//     }, [filteredGpsData, selectedImei]);

//     const totalDistance = useMemo(() => {
//         if (routeCoordinates.length < 2) return 0;
//         return routeCoordinates.reduce((sum, coord, index, array) => {
//             if (index === 0) return sum;
//             const [lat1, lon1] = array[index - 1];
//             const [lat2, lon2] = coord;
//             return sum + haversineDistance(lat1, lon1, lat2, lon2);
//         }, 0).toFixed(2);
//     }, [routeCoordinates]);

//     const lastGpsPoints = useMemo(() => {
//         return filteredGpsData.map(item => {
//             const validData = item.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0);
//             return validData.length > 0
//                 ? { ...validData[validData.length - 1], imei: item.imei }
//                 : null;
//         }).filter(point => point !== null);
//     }, [filteredGpsData]);

//     const stationarySegments = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];

//         const segments = [];
//         let currentSegment = [];

//         selectedVehicleData.data.forEach((gpsPoint, index, array) => {
//             if (index === 0) return;
//             const prevPoint = array[index - 1];
//             if (gpsPoint.latitude === prevPoint.latitude && gpsPoint.longitude === prevPoint.longitude) {
//                 currentSegment.push(gpsPoint);
//             } else {
//                 if (currentSegment.length > 0) {
//                     segments.push(currentSegment);
//                     currentSegment = [];
//                 }
//             }
//         });

//         if (currentSegment.length > 0) {
//             segments.push(currentSegment);
//         }

//         return segments.map(segment => {
//             const startTime = new Date(segment[0].timestamp);
//             const endTime = new Date(segment[segment.length - 1].timestamp);
//             const duration = (endTime - startTime) / 1000;
//             return segment.map(point => ({ ...point, duration }));
//         });
//     }, [filteredGpsData, selectedImei]);

//     const handleMarkerClick = (imei) => {
//         dispatch(setImei(imei));
//         dispatch(toggleShowTrack());
//         setShowParkingMarkers(!showParkingMarkers);
//     };

//     const getIconByType = (type) => {
//         switch (type) {
//             case 'car': return carIco;
//             case 'tractor': return tractorIco;
//             case 'combine': return combineIco;
//             case 'truck': return truckIco;
//             default: return carIco;
//         }
//     };

//     return (
//         <>
//             {showTrack && routeCoordinates.length > 0 && (
//                 <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
//             )}

//             {lastGpsPoints.map((point, index) => {
//                 console.log(point)
//                 const vehicleType = getVehicleTypeByImei(point.imei);
//                 const vehicleName = getVehicleNameByImei(point.imei);
//                 const driver = getDriverByCardId(point.card_id);

//                 return (
//                     <Marker
//                         key={index}
//                         position={[point.latitude, point.longitude]}
//                         icon={new L.Icon({
//                             iconUrl: getIconByType(vehicleType),
//                             iconSize: [50, 50],
//                             iconAnchor: [12, 25],
//                             popupAnchor: [0, -25]
//                         })}
//                         zIndexOffset={1000}
//                         eventHandlers={{ click: () => handleMarkerClick(point.imei) }}
//                     >
//                         <Popup>
//                             <strong>{vehicleName}</strong> <br />
//                             IMEI: {point.imei} <br />
//                             Час: {new Date(point.timestamp).toLocaleString()} <br />
//                             Пройдено: {totalDistance} км <br />
//                             Водій:{' '}
//                             {driver
//                                 ? `${driver.firstName} ${driver.lastName}`
//                                 : 'не визначений'} <br />
//                         </Popup>
//                     </Marker>
//                 );
//             })}

//             {showParkingMarkers && stationarySegments.map((segment, segmentIndex) =>
//                 segment.slice(0, -1).map((point, pointIndex) => (
//                     <Marker
//                         key={`stationary-${segmentIndex}-${pointIndex}`}
//                         position={[point.latitude, point.longitude]}
//                         icon={new L.Icon({
//                             iconUrl: parkingIco,
//                             iconSize: [25, 25],
//                             iconAnchor: [12, 25],
//                             popupAnchor: [0, -25]
//                         })}
//                         zIndexOffset={500}
//                     >
//                         <Popup>
//                             <strong>Техніка стоїть</strong> <br />
//                             Час: {new Date(point.timestamp).toLocaleString()} <br />
//                             IMEI: {point.imei} <br />
//                             Стоїть: {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
//                         </Popup>
//                     </Marker>
//                 ))
//             )}
//         </>
//     );
// };

// export default TrackMarkers;










// import React, { useMemo, useState } from 'react';
// import { Marker, Polyline, Popup } from 'react-leaflet';
// import { useDispatch } from 'react-redux';
// import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
// import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { usePersonnelData } from '../../hooks/usePersonnelData';
// import { haversineDistance } from '../../helpres/distance';
// import L from 'leaflet';

// import parkingIco from '../../assets/ico/parking-ico.png';
// import carIco from '../../assets/ico/car-ico.png';
// import tractorIco from '../../assets/ico/tractor-ico.png';
// import combineIco from '../../assets/ico/combine-ico.png';
// import truckIco from '../../assets/ico/truck-ico.png';

// const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
//     const dispatch = useDispatch();
//     const [showParkingMarkers, setShowParkingMarkers] = useState(false);

//     const { data: vehicles = [] } = useVehiclesData();
//     const { data: personnel = [] } = usePersonnelData();

//     // ===== Фільтруємо GPS дані по вибраній даті =====
//     const filteredGpsData = useMemo(() => {
//         if (!gpsData || !selectedDate) return [];
//         const selectedDateFormatted = selectedDate.split('T')[0];
//         return gpsData.filter(item => item.date === selectedDateFormatted);
//     }, [gpsData, selectedDate]);

//     // ===== Фільтрація точок по території України =====
//     const isPointInUkraine = (lat, lon) => {
//         // Приблизні межі України
//         return lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;
//     };

//     // ===== Отримуємо маршрут для вибраного пристрою =====
//     const routeCoordinates = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];
//         return selectedVehicleData.data
//             .filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0)
//             .filter(gpsPoint => isPointInUkraine(gpsPoint.latitude, gpsPoint.longitude))
//             .map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude]);
//     }, [filteredGpsData, selectedImei]);

//     // ===== Обчислюємо пройдену відстань =====
//     const totalDistance = useMemo(() => {
//         if (routeCoordinates.length < 2) return 0;
//         return routeCoordinates.reduce((sum, coord, index, array) => {
//             if (index === 0) return sum;
//             const [lat1, lon1] = array[index - 1];
//             const [lat2, lon2] = coord;
//             return sum + haversineDistance(lat1, lon1, lat2, lon2);
//         }, 0).toFixed(2);
//     }, [routeCoordinates]);

//     // ===== Останні точки трекера =====
//     const lastGpsPoints = useMemo(() => {
//         return filteredGpsData.map(item => {
//             const validData = item.data
//                 .filter(p => p.latitude !== 0 && p.longitude !== 0)
//                 .filter(p => isPointInUkraine(p.latitude, p.longitude));
//             return validData.length > 0
//                 ? { ...validData[validData.length - 1], imei: item.imei }
//                 : null;
//         }).filter(point => point !== null);
//     }, [filteredGpsData]);

//     // ===== Стоянки =====
//     const stationarySegments = useMemo(() => {
//         if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
//         const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
//         if (!selectedVehicleData) return [];

//         const segments = [];
//         let currentSegment = [];

//         selectedVehicleData.data.forEach((gpsPoint, index, array) => {
//             if (index === 0) return;
//             const prevPoint = array[index - 1];
//             if (
//                 gpsPoint.latitude === prevPoint.latitude &&
//                 gpsPoint.longitude === prevPoint.longitude
//             ) {
//                 currentSegment.push(gpsPoint);
//             } else {
//                 if (currentSegment.length > 0) {
//                     segments.push(currentSegment);
//                     currentSegment = [];
//                 }
//             }
//         });

//         if (currentSegment.length > 0) segments.push(currentSegment);

//         return segments.map(segment => {
//             const startTime = new Date(segment[0].timestamp);
//             const endTime = new Date(segment[segment.length - 1].timestamp);
//             const duration = (endTime - startTime) / 1000;
//             return segment.map(point => ({ ...point, duration }));
//         });
//     }, [filteredGpsData, selectedImei]);

//     // ===== Клік по маркеру =====
//     const handleMarkerClick = (imei) => {
//         dispatch(setImei(imei));
//         dispatch(toggleShowTrack());
//         setShowParkingMarkers(!showParkingMarkers);
//     };

//     const getIconByType = (type) => {
//         switch (type) {
//             case 'tractor': return tractorIco;
//             case 'combine': return combineIco;
//             case 'truck': return truckIco;
//             case 'car':
//             default: return carIco;
//         }
//     };

//     // ===== Пошук водія по карті без createdAt =====
//     const getDriverInfoForVehicle = (imei) => {
//         const vehicleData = filteredGpsData.find(item => item.imei === imei);
//         if (!vehicleData || !Array.isArray(vehicleData.data)) return null;

//         for (const point of vehicleData.data) {
//             const card = point.card_id ? String(point.card_id).toLowerCase() : null;
//             if (card && card !== 'null' && card !== '') {
//                 const driver = personnel.find(p => p.rfid?.toLowerCase() === card) || null;
//                 return { driver, cardId: card, timestamp: point.timestamp };
//             }
//         }
//         return null;
//     };

//     return (
//         <>
//             {showTrack && routeCoordinates.length > 0 && (
//                 <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
//             )}

//             {lastGpsPoints.map((point, index) => {
//                 const vehicle = vehicles.find(v => v.imei === point.imei);
//                 const vehicleType = vehicle?.vehicleType || 'car';
//                 const vehicleName = vehicle?.mark || 'Невідомий транспорт';

//                 const driverInfo = getDriverInfoForVehicle(point.imei);
//                 let driverLabel = 'Водій не визначений';
//                 if (driverInfo) {
//                     if (driverInfo.driver) {
//                         driverLabel = `${driverInfo.driver.firstName} ${driverInfo.driver.lastName}`;
//                     } else {
//                         driverLabel = `Картка: ${driverInfo.cardId} (не знайдена в базі)`;
//                     }
//                 }

//                 return (
//                     <Marker
//                         key={index}
//                         position={[point.latitude, point.longitude]}
//                         icon={new L.Icon({
//                             iconUrl: getIconByType(vehicleType),
//                             iconSize: [50, 50],
//                             iconAnchor: [12, 25],
//                             popupAnchor: [0, -25],
//                         })}
//                         zIndexOffset={1000}
//                         eventHandlers={{ click: () => handleMarkerClick(point.imei) }}
//                     >
//                         <Popup>
//                             <strong>Остання точка</strong><br />
//                             <b>Транспорт:</b> {vehicleName}<br />
//                             <b>Водій:</b> {driverLabel}<br />
//                             <b>IMEI:</b> {point.imei}<br />
//                             <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
//                             <b>Пройдено:</b> {totalDistance} км
//                         </Popup>
//                     </Marker>
//                 );
//             })}

//             {showParkingMarkers && stationarySegments.map((segment, segmentIndex) =>
//                 segment.slice(0, -1).map((point, pointIndex) => (
//                     <Marker
//                         key={`stationary-${segmentIndex}-${pointIndex}`}
//                         position={[point.latitude, point.longitude]}
//                         icon={new L.Icon({
//                             iconUrl: parkingIco,
//                             iconSize: [25, 25],
//                             iconAnchor: [12, 25],
//                             popupAnchor: [0, -25],
//                         })}
//                         zIndexOffset={500}
//                     >
//                         <Popup>
//                             <strong>Техніка стоїть</strong><br />
//                             <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
//                             <b>IMEI:</b> {point.imei}<br />
//                             <b>Стоїть:</b> {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
//                         </Popup>
//                     </Marker>
//                 ))
//             )}
//         </>
//     );
// };

// export default TrackMarkers;






import React, { useMemo, useState } from 'react';
import { Marker, Polyline, Popup } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setImei, toggleShowTrack } from '../../store/vehicleSlice';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import { haversineDistance } from '../../helpres/distance';
import L from 'leaflet';

import parkingIco from '../../assets/ico/parking-ico.png';
import carIco from '../../assets/ico/car-ico.png';
import tractorIco from '../../assets/ico/tractor-ico.png';
import combineIco from '../../assets/ico/combine-ico.png';
import truckIco from '../../assets/ico/truck-ico.png';

const TrackMarkers = ({ gpsData, selectedDate, selectedImei, showTrack }) => {
    const dispatch = useDispatch();
    const [showParkingMarkers, setShowParkingMarkers] = useState(false);

    const { data: vehicles = [] } = useVehiclesData();
    const { data: personnel = [] } = usePersonnelData();

    // ===== Фільтруємо GPS дані по вибраній даті =====
    const filteredGpsData = useMemo(() => {
        if (!gpsData || !selectedDate) return [];
        const selectedDateFormatted = selectedDate.split('T')[0];
        return gpsData.filter(item => item.date === selectedDateFormatted);
    }, [gpsData, selectedDate]);

    // ===== Фільтрація точок по території України =====
    const isPointInUkraine = (lat, lon) => {
        return lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;
    };

    // ===== Отримуємо маршрут для вибраного пристрою =====
    const routeCoordinates = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
        const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
        if (!selectedVehicleData) return [];
        return selectedVehicleData.data
            .filter(p => p.latitude !== 0 && p.longitude !== 0)
            .filter(p => isPointInUkraine(p.latitude, p.longitude))
            .map(p => [p.latitude, p.longitude]);
    }, [filteredGpsData, selectedImei]);

    // ===== Обчислюємо пройдену відстань =====
    const totalDistance = useMemo(() => {
        if (routeCoordinates.length < 2) return 0;
        return routeCoordinates.reduce((sum, coord, index, array) => {
            if (index === 0) return sum;
            const [lat1, lon1] = array[index - 1];
            const [lat2, lon2] = coord;
            return sum + haversineDistance(lat1, lon1, lat2, lon2);
        }, 0).toFixed(2);
    }, [routeCoordinates]);

    // ===== Останні точки трекера =====
    const lastGpsPoints = useMemo(() => {
        return filteredGpsData.map(item => {
            const validData = item.data
                .filter(p => p.latitude !== 0 && p.longitude !== 0)
                .filter(p => isPointInUkraine(p.latitude, p.longitude));
            return validData.length > 0
                ? { ...validData[validData.length - 1], imei: item.imei }
                : null;
        }).filter(point => point !== null);
    }, [filteredGpsData]);

    // ===== Стоянки =====
    const stationarySegments = useMemo(() => {
        if (!filteredGpsData || filteredGpsData.length === 0 || !selectedImei) return [];
        const selectedVehicleData = filteredGpsData.find(item => item.imei === selectedImei);
        if (!selectedVehicleData) return [];

        const segments = [];
        let currentSegment = [];

        selectedVehicleData.data.forEach((gpsPoint, index, array) => {
            if (index === 0) return;
            const prevPoint = array[index - 1];
            if (
                gpsPoint.latitude === prevPoint.latitude &&
                gpsPoint.longitude === prevPoint.longitude
            ) {
                currentSegment.push(gpsPoint);
            } else {
                if (currentSegment.length > 0) {
                    segments.push(currentSegment);
                    currentSegment = [];
                }
            }
        });

        if (currentSegment.length > 0) segments.push(currentSegment);

        return segments.map(segment => {
            const startTime = new Date(segment[0].timestamp);
            const endTime = new Date(segment[segment.length - 1].timestamp);
            const duration = (endTime - startTime) / 1000;
            return segment.map(point => ({ ...point, duration }));
        });
    }, [filteredGpsData, selectedImei]);

    // ===== Клік по маркеру =====
    const handleMarkerClick = (imei) => {
        dispatch(setImei(imei));
        dispatch(toggleShowTrack());
        setShowParkingMarkers(!showParkingMarkers);
    };

    const getIconByType = (type) => {
        switch (type) {
            case 'tractor': return tractorIco;
            case 'combine': return combineIco;
            case 'truck': return truckIco;
            case 'car':
            default: return carIco;
        }
    };

    // ===== Отримати всіх водіїв за день для конкретного IMEI =====
    const getDriversForVehicle = (imei) => {
        const vehicleData = filteredGpsData.find(item => item.imei === imei);
        if (!vehicleData || !Array.isArray(vehicleData.data)) return [];

        const driversMap = new Map(); // cardId -> { driver, cardId, firstSeen }

        for (const point of vehicleData.data) {
            
            const card = point.card_id ? String(point.card_id).toLowerCase() : null;

            

            if (card && card !== 'null' && card !== '') {
                if (!driversMap.has(card)) {
                    const driver = personnel.find(p => p.rfid?.toLowerCase() === card) || null;
                    driversMap.set(card, {
                        driver,
                        cardId: card,
                        firstSeen: point.timestamp
                    });
                }
            }
        }

        return Array.from(driversMap.values());
    };


    return (
        <>
            {/* Маршрут */}
            {showTrack && routeCoordinates.length > 0 && (
                <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
            )}

            {/* Останні точки */}
            {lastGpsPoints.map((point, index) => {
                const vehicle = vehicles.find(v => v.imei === point.imei);
                const vehicleType = vehicle?.vehicleType || 'car';
                const vehicleName = vehicle?.mark || 'Невідомий транспорт';

                const driversInfo = getDriversForVehicle(point.imei);
                let driverLabel = 'Водій не визначений';
                if (driversInfo.length > 0) {
                    driverLabel = driversInfo.map(d => {
                        if (d.driver) {
                            return `${d.driver.firstName} ${d.driver.lastName} (з ${new Date(d.firstSeen).toLocaleString()})`;
                        } else {
                            return `Картка: ${d.cardId} (не знайдена в базі) — вперше виявлена: ${new Date(d.firstSeen).toLocaleString()}`;
                        }
                    }).join('\n');
                }

                return (
                    <Marker
                        key={index}
                        position={[point.latitude, point.longitude]}
                        icon={new L.Icon({
                            iconUrl: getIconByType(vehicleType),
                            iconSize: [50, 50],
                            iconAnchor: [12, 25],
                            popupAnchor: [0, -25],
                        })}
                        zIndexOffset={1000}
                        eventHandlers={{ click: () => handleMarkerClick(point.imei) }}
                    >
                        <Popup>
                            <strong>Остання точка</strong><br />
                            <b>Транспорт:</b> {vehicleName}<br />
                            <b>Водій:</b> <pre>{driverLabel}</pre><br />
                            <b>IMEI:</b> {point.imei}<br />
                            <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
                            <b>Пройдено:</b> {totalDistance} км
                        </Popup>
                    </Marker>
                );
            })}

            {/* Стоянки */}
            {showParkingMarkers && stationarySegments.map((segment, segmentIndex) =>
                segment.slice(0, -1).map((point, pointIndex) => (
                    <Marker
                        key={`stationary-${segmentIndex}-${pointIndex}`}
                        position={[point.latitude, point.longitude]}
                        icon={new L.Icon({
                            iconUrl: parkingIco,
                            iconSize: [25, 25],
                            iconAnchor: [12, 25],
                            popupAnchor: [0, -25],
                        })}
                        zIndexOffset={500}
                    >
                        <Popup>
                            <strong>Техніка стоїть</strong><br />
                            <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
                            <b>IMEI:</b> {point.imei}<br />
                            <b>Стоїть:</b> {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
                        </Popup>
                    </Marker>
                ))
            )}
        </>
    );
};

export default TrackMarkers;
