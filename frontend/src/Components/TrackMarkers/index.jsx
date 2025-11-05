import React, { useMemo, useState, useEffect } from 'react';
import { Marker, Polyline, Popup, useMap } from 'react-leaflet';
import { useDispatch } from 'react-redux';
import { setImei } from '../../store/vehicleSlice';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import L from 'leaflet';

import parkingIco from '../../assets/ico/parking-ico.png';
import carIco from '../../assets/ico/car-ico.png';
import tractorIco from '../../assets/ico/tractor-ico.png';
import combineIco from '../../assets/ico/combine-ico.png';
import truckIco from '../../assets/ico/truck-ico.png';
import anomalyIco from '../../assets/ico/warning.png';

import { isPointInUkraine, filterGpsDataByDate } from '../../helpres/trekHelpers';
import { getStationarySegments, getAnomalyMarkers } from '../../helpres/trackCalculations';
import { haversineDistance } from '../../helpres/distance';
import { splitGpsSegments } from '../../helpres/splitGpsSegments';


const TrackMarkers = ({ gpsData, selectedDate }) => {
  const dispatch = useDispatch();
  const map = useMap();
  const [activeImei, setActiveImei] = useState(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const { data: vehicles = [] } = useVehiclesData();

  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    if (map) map.closePopup();
  }, [selectedDate, map]);

  const getIconByType = type => ({
    tractor: tractorIco,
    combine: combineIco,
    truck: truckIco,
    car: carIco,
  }[type] || carIco);

  const getTrackColorByType = type => ({
    car: 'aqua',
    tractor: 'green',
    combine: 'yellow',
    truck: 'red',
  }[type] || 'gray');

  const getVehicleName = imei => vehicles.find(v => v.imei === imei)?.mark || 'Невідома техніка';

  const formatTime = iso => new Date(iso).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  const formatDuration = secs => {
    if (!secs || secs <= 0) return '0 хв';
    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);
    return `${h ? h + ' год ' : ''}${m ? m + ' хв' : ''}`.trim();
  };

  const filteredGpsData = useMemo(
    () => filterGpsDataByDate(gpsData, selectedDate),
    [gpsData, selectedDate]
  );

  const activeVehicleData = filteredGpsData.find(item => item.imei === activeImei)?.data;

  /** ✅ Рухові сегменти */
  const vehicleSegments = useMemo(() => {
    if (!activeVehicleData) return [];
    return splitGpsSegments(activeVehicleData);
  }, [activeVehicleData]);

  /** ✅ Інфо про сегмент */
  const segmentInfo = useMemo(() => {
    return vehicleSegments.map(seg => {
      const pts = seg.points;
      let dist = 0;

      for (let i = 1; i < pts.length; i++) {
        dist += haversineDistance(
          pts[i - 1].latitude,
          pts[i - 1].longitude,
          pts[i].latitude,
          pts[i].longitude
        );
      }

      const start = pts[0].timestamp;
      const end = pts.at(-1).timestamp;
      const duration = (new Date(end) - new Date(start)) / 1000;
      return { start, end, duration, distance: dist };
    });
  }, [vehicleSegments]);

  /** ✅ Координати маршруту */
  const routeCoordinates = useMemo(() => {
    if (!filteredGpsData || !activeImei) return [];
    const vehicleData = filteredGpsData.find(i => i.imei === activeImei)?.data;
    if (!vehicleData) return [];

    return vehicleData
      .filter(p => p.latitude && p.longitude && isPointInUkraine(p.latitude, p.longitude))
      .map(p => [p.latitude, p.longitude]);
  }, [filteredGpsData, activeImei]);

  /** ✅ Останні точки всіх авто */
  const lastGpsPoints = useMemo(() =>
    filteredGpsData
      .map(item => {
        const valid = item.data.filter(p => p.latitude && p.longitude && isPointInUkraine(p.latitude, p.longitude));
        return valid.length ? { ...valid.at(-1), imei: item.imei } : null;
      })
      .filter(Boolean),
    [filteredGpsData]
  );

  const stationarySegments = useMemo(() =>
    getStationarySegments(activeVehicleData, activeImei),
    [activeVehicleData, activeImei]
  );

  const anomalyMarkers = useMemo(() =>
    getAnomalyMarkers(activeVehicleData, activeImei),
    [activeVehicleData, activeImei]
  );

  const handleMarkerClick = imei => {
    if (activeImei === imei) setShowAllMarkers(v => !v);
    else {
      setActiveImei(imei);
      setShowAllMarkers(true);
    }
    dispatch(setImei(imei));
  };

  /** ✅ Повна дистанція маршруту (по всіх точках) */
  const totalDistance = useMemo(() => {
    if (!activeVehicleData || activeVehicleData.length < 2) return 0;

    let dist = 0;
    for (let i = 1; i < activeVehicleData.length; i++) {
      const prev = activeVehicleData[i - 1];
      const curr = activeVehicleData[i];
      if (!prev.latitude || !prev.longitude || !curr.latitude || !curr.longitude) continue;

      dist += haversineDistance(
        prev.latitude,
        prev.longitude,
        curr.latitude,
        curr.longitude
      );
    }
    return dist; // у км
  }, [activeVehicleData]);

  return (
    <>
      {showAllMarkers && routeCoordinates.length > 0 && (() => {
        const vehicle = vehicles.find(v => v.imei === activeImei);
        return (
          <Polyline
            positions={routeCoordinates}
            pathOptions={{ color: getTrackColorByType(vehicle?.vehicleType), weight: 5, opacity: 0.8 }}
          />
        );
      })()}

      {lastGpsPoints.map((p, i) => {
        const vehicleName = getVehicleName(p.imei);
        const vehicleType = vehicles.find(v => v.imei === p.imei)?.vehicleType || 'car';

        return (
          <Marker
            key={i}
            position={[p.latitude, p.longitude]}
            icon={new L.Icon({ iconUrl: getIconByType(vehicleType), iconSize: [50, 50] })}
            eventHandlers={{ click: () => handleMarkerClick(p.imei) }}
          >
        
            <Popup autoPan={false} minWidth={280}>
              <div style={{ fontSize: 13, lineHeight: 1.4 }}>
                <div><b>Транспорт:</b> {vehicleName}</div>
                <div><b>IMEI:</b> {p.imei}</div>
                <div><b>Останній час:</b> {new Date(p.timestamp).toLocaleString()}</div>
                <hr />

                <b>Рухові сегменти:</b>
                {segmentInfo.length ? segmentInfo.map((s, idx) => (
                  <div key={idx} style={{ marginTop: 4 }}>
                    🕒 {formatTime(s.start)} → {formatTime(s.end)} &nbsp;|&nbsp;
                    ⏳ {formatDuration(s.duration)} &nbsp;|&nbsp;
                    📍 {s.distance.toFixed(2)} км
                  </div>
                )) : <div>Немає руху</div>}

                {totalDistance > 0 && (
                  <div style={{ marginTop: 6, fontWeight: 'bold' }}>
                    Загальна дистанція: {totalDistance.toFixed(2)} км
                  </div>
                )}
              </div>
            </Popup>
            

          </Marker>
        );
      })}

      {showAllMarkers && stationarySegments.flatMap((seg, s) =>
        seg.slice(0, -1).map((p, i) => (
          <Marker
            key={`park-${s}-${i}`}
            position={[p.latitude, p.longitude]}
            icon={new L.Icon({ iconUrl: parkingIco, iconSize: [25, 25] })}
          >
            <Popup autoPan={false}>
              <b>Стоянка</b><br />
              {Math.floor(p.duration / 60)} хв
            </Popup>
          </Marker>
        ))
      )}

      {showAllMarkers && anomalyMarkers.map((p, i) => (
        <Marker
          key={`anom-${i}`}
          position={[p.latitude, p.longitude]}
          icon={new L.Icon({ iconUrl: anomalyIco, iconSize: [25, 25] })}
        >
          <Popup autoPan={false}>
            <b>Втрачено сигнал</b><br />
            З: {new Date(p.anomalyStart).toLocaleString()}<br />
            До: {new Date(p.anomalyEnd).toLocaleString()}
          </Popup>
        </Marker>
      ))}
    </>
  );
};

export default TrackMarkers;








