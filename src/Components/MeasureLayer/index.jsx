import { useMap } from 'react-leaflet';
import { useEffect, useState } from 'react';
import L from 'leaflet';
import '@geoman-io/leaflet-geoman-free';
import * as turf from '@turf/turf';

export default function MeasureLayer() {
  const map = useMap();
  const [measurement, setMeasurement] = useState(null);

  // Вивід measurement у консоль щоразу, коли він змінюється
  useEffect(() => {
    if (measurement) {
      console.log('Поточне вимірювання:', measurement);
    }
  }, [measurement]);

  useEffect(() => {
    if (!map) return;

    map.pm.addControls({
      position: 'bottomleft',
      drawPolygon: true,
      drawPolyline: true,
      editMode: true,
      dragMode: true,
      removalMode: true,
    });

    function updateMeasurement(layer) {
      if (layer instanceof L.Polygon) {
        let latlngs = layer.getLatLngs()[0].map(({ lat, lng }) => [lng, lat]);

        // Перевірка, чи полігон замкнутий — якщо ні, додаємо першу точку в кінець
        const first = latlngs[0];
        const last = latlngs[latlngs.length - 1];
        if (first[0] !== last[0] || first[1] !== last[1]) {
          latlngs = [...latlngs, first];
        }

        const polygon = turf.polygon([latlngs]);
        const area = turf.area(polygon);
        const areaHectares = area / 10000;
        setMeasurement(`Площа: ${areaHectares.toFixed(2)} га`);
      } else if (layer instanceof L.Polyline && !(layer instanceof L.Polygon)) {
        let length = 0;
        const latlngs = layer.getLatLngs();
        for (let i = 0; i < latlngs.length - 1; i++) {
          length += latlngs[i].distanceTo(latlngs[i + 1]);
        }
        setMeasurement(`Довжина: ${(length / 1000).toFixed(2)} км`);
      }
    }

    map.on('pm:create', e => updateMeasurement(e.layer));
    map.on('pm:edit', e => {
      e.layers.eachLayer(layer => updateMeasurement(layer));
    });

    return () => {
      map.pm.removeControls();
      map.off('pm:create');
      map.off('pm:edit');
    };
  }, [map]);

  return (
    <div style={{
      position: 'absolute',
      bottom: 20,
      left: 20,
      background: 'white',
      padding: '10px 15px',
      borderRadius: 6,
      boxShadow: '0 0 8px rgba(0,0,0,0.2)',
      zIndex: 1000,
      userSelect: 'none',
    }}>
      {measurement ?? 'Намалюйте лінію або полігон'}
    </div>
  );
}
