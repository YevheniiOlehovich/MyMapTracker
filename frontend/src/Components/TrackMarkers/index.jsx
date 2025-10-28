import React, { useMemo, useState, useEffect } from 'react';
import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setImei } from '../../store/vehicleSlice';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import { haversineDistance } from '../../helpres/distance';
import L from 'leaflet';

import parkingIco from '../../assets/ico/parking-ico.png';
import carIco from '../../assets/ico/car-ico.png';
import tractorIco from '../../assets/ico/tractor-ico.png';
import combineIco from '../../assets/ico/combine-ico.png';
import truckIco from '../../assets/ico/truck-ico.png';
import anomalyIco from '../../assets/ico/warning.png';

const TrackMarkers = ({ gpsData, selectedDate }) => {
  const dispatch = useDispatch();
  const map = useMap();
  
  const [activeImei, setActiveImei] = useState(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const { data: vehicles = [] } = useVehiclesData();
  const { data: personnel = [] } = usePersonnelData();

  // ===== Скидання всього при зміні дати =====
  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    if (map) map.closePopup();
  }, [selectedDate, map]);

  const filteredGpsData = useMemo(() => {
    if (!gpsData || !selectedDate) return [];
    const dateStr = selectedDate.split('T')[0];
    return gpsData.filter(item => item.date === dateStr);
  }, [gpsData, selectedDate]);

  const isPointInUkraine = (lat, lon) => lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;

  const routeCoordinates = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(item => item.imei === activeImei);
    if (!vehicleData) return [];
    return vehicleData.data
      .filter(p => p.latitude !== 0 && p.longitude !== 0)
      .filter(p => isPointInUkraine(p.latitude, p.longitude))
      .map(p => [p.latitude, p.longitude]);
  }, [filteredGpsData, activeImei]);

  const totalDistance = useMemo(() => {
    if (routeCoordinates.length < 2) return 0;
    return routeCoordinates.reduce((sum, coord, i, arr) => {
      if (i === 0) return sum;
      const [lat1, lon1] = arr[i - 1];
      const [lat2, lon2] = coord;
      return sum + haversineDistance(lat1, lon1, lat2, lon2);
    }, 0).toFixed(2);
  }, [routeCoordinates]);

  const lastGpsPoints = useMemo(() => {
    return filteredGpsData
      .map(item => {
        const validData = item.data
          .filter(p => p.latitude !== 0 && p.longitude !== 0)
          .filter(p => isPointInUkraine(p.latitude, p.longitude));
        return validData.length > 0 ? { ...validData[validData.length - 1], imei: item.imei } : null;
      })
      .filter(p => p !== null);
  }, [filteredGpsData]);

  const stationarySegments = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(item => item.imei === activeImei);
    if (!vehicleData) return [];

    const segments = [];
    let currentSegment = [];

    vehicleData.data.forEach((p, i, arr) => {
      if (i === 0) return;
      const prev = arr[i - 1];
      if (p.latitude === prev.latitude && p.longitude === prev.longitude) {
        currentSegment.push(p);
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
      return segment.map(p => ({ ...p, duration }));
    });
  }, [filteredGpsData, activeImei]);

  const anomalyMarkers = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(item => item.imei === activeImei);
    if (!vehicleData) return [];

    const markers = [];
    let lastValid = null;
    let anomalyStart = null;

    vehicleData.data.forEach(p => {
      const valid = p.latitude !== 0 && p.longitude !== 0 && isPointInUkraine(p.latitude, p.longitude);
      if (valid) {
        if (anomalyStart && lastValid) {
          markers.push({
            ...lastValid,
            anomalyStartTime: anomalyStart,
            anomalyEndTime: p.timestamp,
          });
          anomalyStart = null;
        }
        lastValid = p;
      } else {
        if (!anomalyStart && lastValid) anomalyStart = p.timestamp;
      }
    });

    return markers;
  }, [filteredGpsData, activeImei]);

  const handleMarkerClick = (imei) => {
    if (activeImei === imei) {
      setShowAllMarkers(prev => !prev); // toggle
    } else {
      setActiveImei(imei);
      setShowAllMarkers(true);
    }
    dispatch(setImei(imei));
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

  const getDriversForVehicle = (imei) => {
    const vehicleData = filteredGpsData.find(item => item.imei === imei);
    if (!vehicleData?.data) return [];
    const driversMap = new Map();
    for (const point of vehicleData.data) {
      const card = point.card_id ? String(point.card_id).toLowerCase() : null;
      if (card && card !== 'null' && card !== '') {
        if (!driversMap.has(card)) {
          const driver = personnel.find(p => p.rfid?.toLowerCase() === card) || null;
          driversMap.set(card, { driver, cardId: card, firstSeen: point.timestamp });
        }
      }
    }
    return Array.from(driversMap.values());
  };

  return (
    <>
      {/* Маршрут */}
      {showAllMarkers && routeCoordinates.length > 0 && (
        <Polyline positions={routeCoordinates} color="blue" weight={5} opacity={0.7} />
      )}

      {/* Останні точки */}
      {lastGpsPoints.map((point, index) => {
        const vehicle = vehicles.find(v => v.imei === point.imei);
        const vehicleType = vehicle?.vehicleType || 'car';
        const vehicleName = vehicle?.mark || 'Невідомий транспорт';
        const driversInfo = getDriversForVehicle(point.imei);
        const driverLabel = driversInfo.length > 0
          ? driversInfo.map(d => d.driver
              ? `${d.driver.firstName} ${d.driver.lastName} (з ${new Date(d.firstSeen).toLocaleString()})`
              : `Картка: ${d.cardId} (не знайдена) — вперше: ${new Date(d.firstSeen).toLocaleString()}`
            ).join('\n')
          : 'Водій не визначений';

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
              <b>Водій:</b> <div style={{ whiteSpace: 'pre-wrap' }}>{driverLabel}</div><br />
              <b>IMEI:</b> {point.imei}<br />
              <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
              <b>Пройдено:</b> {totalDistance} км
            </Popup>
          </Marker>
        );
      })}

      {/* Стоянки */}
      {showAllMarkers && stationarySegments.map((segment, sIndex) =>
        segment.slice(0, -1).map((point, pIndex) => {
          const vehicle = vehicles.find(v => v.imei === point.imei);
          const vehicleName = vehicle?.mark || 'Невідомий транспорт';
          return (
            <Marker
              key={`stationary-${sIndex}-${pIndex}`}
              position={[point.latitude, point.longitude]}
              icon={new L.Icon({
                iconUrl: parkingIco,
                iconSize: [25, 25],
                iconAnchor: [12, 25],
                popupAnchor: [0, -25],
              })}
            >
              <Popup>
                <strong>Техніка стоїть</strong><br />
                <b>Транспорт:</b> {vehicleName}<br />
                <b>IMEI:</b> {point.imei}<br />
                <b>Час:</b> {new Date(point.timestamp).toLocaleString()}<br />
                <b>Стоїть:</b> {Math.floor(point.duration / 60)} хв {Math.floor(point.duration % 60)} сек
              </Popup>
            </Marker>
          );
        })
      )}

      {/* Аномалії */}
      {showAllMarkers && anomalyMarkers.map((point, idx) => {
        const vehicle = vehicles.find(v => v.imei === point.imei);
        const vehicleName = vehicle?.mark || 'Невідомий транспорт';
        return (
          <Marker
            key={`anomaly-${idx}`}
            position={[point.latitude, point.longitude]}
            icon={new L.Icon({
              iconUrl: anomalyIco,
              iconSize: [25, 25],
              iconAnchor: [12, 25],
              popupAnchor: [0, -25],
            })}
          >
            <Popup>
              <strong>Пропав сигнал</strong><br />
              <b>Транспорт:</b> {vehicleName}<br />
              <b>IMEI:</b> {point.imei}<br />
              З: {new Date(point.anomalyStartTime).toLocaleString()}<br />
              По: {new Date(point.anomalyEndTime).toLocaleString()}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default TrackMarkers;
