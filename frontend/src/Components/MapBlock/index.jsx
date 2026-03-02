import React, { useMemo, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  Polygon,
  Polyline,
  Tooltip,
  useMap,
} from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import * as turf from "@turf/turf";
import { center as defaultCenter } from "../../helpres";

const TRACK_COLOR = "#4caf50";

const CenterMap = ({ fieldCoords }) => {
  const map = useMap();

  useEffect(() => {
    if (fieldCoords?.length) {
      const bounds = L.latLngBounds(fieldCoords);
      map.fitBounds(bounds, { padding: [30, 30] });
    }
  }, [fieldCoords, map]);

  return null;
};

const MapBlock = ({
  field,
  fieldsList = [],
  gpsTracks = [],
  height = "400px",
  zoom = 15,
}) => {

  /*
  ======================================================
  1️⃣ ЗНАХОДИМО ПОЛЕ
  ======================================================
  */

  const resolvedField = useMemo(() => {
    if (!field?.value) return null;
    return fieldsList.find((f) => f._id === field.value) || null;
  }, [field, fieldsList]);

  /*
  ======================================================
  2️⃣ КООРДИНАТИ ПОЛЯ
  ======================================================
  */

  const fieldCoords = useMemo(() => {
    if (
      resolvedField?.geometry?.type === "Polygon" &&
      resolvedField.geometry.coordinates?.length
    ) {
      return resolvedField.geometry.coordinates[0].map(
        ([lng, lat]) => [lat, lng]
      );
    }
    return null;
  }, [resolvedField]);

  /*
  ======================================================
  3️⃣ TURF POLYGON
  ======================================================
  */

  const turfPolygon = useMemo(() => {
    if (!resolvedField?.geometry?.coordinates?.length) return null;
    return turf.polygon(resolvedField.geometry.coordinates);
  }, [resolvedField]);

  /*
  ======================================================
  4️⃣ РОЗБИВАЄМО ТРЕК НА СЕГМЕНТИ В ПОЛІ
  ======================================================
  */

  const trackSegments = useMemo(() => {
    if (!turfPolygon) return [];

    const segments = [];

    gpsTracks.forEach((track) => {
      let currentSegment = [];

      track.points.forEach((pt) => {
        if (!pt.latitude || !pt.longitude) return;

        const isInside = turf.booleanPointInPolygon(
          [pt.longitude, pt.latitude],
          turfPolygon
        );

        if (isInside) {
          currentSegment.push([pt.latitude, pt.longitude]);
        } else {
          if (currentSegment.length >= 2) {
            segments.push({
              key: `${track.imei}-${track.date}-${segments.length}`,
              coords: currentSegment,
            });
          }
          currentSegment = [];
        }
      });

      if (currentSegment.length >= 2) {
        segments.push({
          key: `${track.imei}-${track.date}-${segments.length}`,
          coords: currentSegment,
        });
      }
    });

    return segments;
  }, [gpsTracks, turfPolygon]);

  /*
  ======================================================
  RENDER
  ======================================================
  */

  return (
    <div style={{ height }}>
      <MapContainer
        center={defaultCenter}
        zoom={zoom}
        style={{ height: "100%", width: "100%", borderRadius: 8 }}
        scrollWheelZoom
        attributionControl={false}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* ПОЛЕ */}
        {fieldCoords && (
          <Polygon positions={fieldCoords} pathOptions={{ color: "blue" }}>
            <Tooltip permanent>
              {resolvedField?.properties?.name}
            </Tooltip>
          </Polygon>
        )}

        {/* СЕГМЕНТИ В ПОЛІ */}
        {trackSegments.map((segment) => (
          <Polyline
            key={segment.key}
            positions={segment.coords}
            pathOptions={{
              color: TRACK_COLOR,
              weight: 4,
              opacity: 0.8,
            }}
          />
        ))}

        <CenterMap fieldCoords={fieldCoords} />
      </MapContainer>
    </div>
  );
};

export default MapBlock; 