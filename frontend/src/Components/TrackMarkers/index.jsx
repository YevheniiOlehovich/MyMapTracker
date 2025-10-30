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

  // ===== Reset when date changes =====
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

  const isPointInUkraine = (lat, lon) =>
    lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;

  // ===== Route points (valid only) =====
  const routeCoordinates = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(item => item.imei === activeImei);
    if (!vehicleData) return [];
    return vehicleData.data
      .filter(p => p.latitude && p.longitude)
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

  // ===== Last valid points for each IMEI =====
  const lastGpsPoints = useMemo(() => {
    return filteredGpsData
      .map(item => {
        const valid = item.data
          .filter(p => p.latitude && p.longitude)
          .filter(p => isPointInUkraine(p.latitude, p.longitude));
        return valid.length
          ? { ...valid.at(-1), imei: item.imei }
          : null;
      })
      .filter(Boolean);
  }, [filteredGpsData]);

  // ===== Parking detection =====
  const stationarySegments = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(item => item.imei === activeImei);
    if (!vehicleData) return [];

    const segments = [];
    let current = [];

    vehicleData.data.forEach((p, i, arr) => {
      if (i === 0) return;
      const prev = arr[i - 1];
      if (p.latitude === prev.latitude && p.longitude === prev.longitude) {
        current.push(p);
      } else {
        if (current.length) segments.push(current);
        current = [];
      }
    });
    if (current.length) segments.push(current);

    return segments.map(seg => {
      const start = new Date(seg[0].timestamp);
      const end = new Date(seg.at(-1).timestamp);
      const duration = (end - start) / 1000;
      return seg.map(p => ({ ...p, duration, imei: activeImei }));
    });
  }, [filteredGpsData, activeImei]);

  // ===== Anomalies: lost signal =====
  const anomalyMarkers = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(i => i.imei === activeImei);
    if (!vehicleData) return [];

    let lastValid = null;
    let anomalyStart = null;
    const result = [];

    vehicleData.data.forEach(p => {
      const valid = p.latitude && p.longitude && isPointInUkraine(p.latitude, p.longitude);
      if (valid) {
        if (anomalyStart && lastValid) {
          result.push({ ...lastValid, anomalyStart, anomalyEnd: p.timestamp, imei: vehicleData.imei });
          anomalyStart = null;
        }
        lastValid = p;
      } else {
        if (!anomalyStart && lastValid) anomalyStart = p.timestamp;
      }
    });

    return result;
  }, [filteredGpsData, activeImei]);

  const handleMarkerClick = imei => {
    if (activeImei === imei) {
      setShowAllMarkers(v => !v);
    } else {
      setActiveImei(imei);
      setShowAllMarkers(true);
    }
    dispatch(setImei(imei));
  };

  const getIconByType = type =>
    ({
      tractor: tractorIco,
      combine: combineIco,
      truck: truckIco,
      car: carIco,
    }[type] || carIco);

  const getTrackColorByType = type =>
    ({
      car: 'aqua',
      tractor: 'green',
      combine: 'yellow',
      truck: 'red',
    }[type] || 'gray');

  const getDriversForVehicle = imei => {
    const vehicleData = filteredGpsData.find(i => i.imei === imei);
    if (!vehicleData?.data) return [];
    const set = new Map();
    for (const p of vehicleData.data) {
      const card = p.card_id?.toLowerCase();
      if (card && card !== 'null' && card !== '') {
        if (!set.has(card)) {
          const driver = personnel.find(x => x.rfid?.toLowerCase() === card) || null;
          set.set(card, { driver, cardId: card, firstSeen: p.timestamp });
        }
      }
    }
    return [...set.values()];
  };

  const getVehicleName = imei => {
    const vehicle = vehicles.find(v => v.imei === imei);
    return vehicle?.mark || 'Невідома техніка';
  };

  return (
    <>
      {/* ROUTE LINE */}
      {showAllMarkers && routeCoordinates.length > 0 && (() => {
        const vehicle = vehicles.find(v => v.imei === activeImei);
        const color = getTrackColorByType(vehicle?.vehicleType);
        return (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color, weight: 5, opacity: 0.8 }}
          />
        );
      })()}

      {/* LAST POINT MARKERS */}
      {lastGpsPoints.map((p, i) => {
        const vehicleName = getVehicleName(p.imei);
        const drivers = getDriversForVehicle(p.imei);
        const driverText = drivers.length
          ? drivers
              .map(d =>
                d.driver
                  ? `${d.driver.firstName} ${d.driver.lastName} (з ${new Date(d.firstSeen).toLocaleString()})`
                  : `Картка ${d.cardId} — не знайдено`
              )
              .join('\n')
          : 'Водій не визначений';

        const vehicleType = vehicles.find(v => v.imei === p.imei)?.vehicleType || 'car';

        return (
          <Marker
            key={i}
            position={[p.latitude, p.longitude]}
            icon={new L.Icon({
              iconUrl: getIconByType(vehicleType),
              iconSize: [50, 50],
            })}
            eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
          >
            <Popup autoPan={false}>
              <b>Транспорт:</b> {vehicleName}<br/>
              <b>Водій:</b> <div style={{ whiteSpace: 'pre-wrap' }}>{driverText}</div>
              <b>IMEI:</b> {p.imei}<br/>
              <b>Час:</b> {new Date(p.timestamp).toLocaleString()}<br/>
              <b>Пройдено:</b> {totalDistance} км
            </Popup>
          </Marker>
        );
      })}

      {/* PARKING MARKERS */}
      {showAllMarkers && stationarySegments.flatMap((seg, s) =>
        seg.slice(0, -1).map((p, i) => {
          const vehicleName = getVehicleName(p.imei);
          return (
            <Marker
              key={`park-${s}-${i}`}
              position={[p.latitude, p.longitude]}
              icon={new L.Icon({ iconUrl: parkingIco, iconSize: [25, 25] })}
            >
              <Popup autoPan={false}>
                <b>Стоянка</b><br/>
                <b>Транспорт:</b> {vehicleName}<br/>
                <b>IMEI:</b> {p.imei}<br/>
                <b>Тривалість:</b> {Math.floor(p.duration/60)} хв
              </Popup>
            </Marker>
          );
        })
      )}

      {/* ANOMALY MARKERS */}
      {showAllMarkers && anomalyMarkers.map((p, i) => {
        const vehicleName = getVehicleName(p.imei);
        return (
          <Marker
            key={`anom-${i}`}
            position={[p.latitude, p.longitude]}
            icon={new L.Icon({ iconUrl: anomalyIco, iconSize: [25, 25] })}
          >
            <Popup autoPan={false}>
              <b>Втрачено сигнал</b><br/>
              <b>Транспорт:</b> {vehicleName}<br/>
              <b>IMEI:</b> {p.imei}<br/>
              З: {new Date(p.anomalyStart).toLocaleString()}<br/>
              До: {new Date(p.anomalyEnd).toLocaleString()}
            </Popup>
          </Marker>
        );
      })}
    </>
  );
};

export default TrackMarkers;