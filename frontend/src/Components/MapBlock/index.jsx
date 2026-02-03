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

const DEFAULT_COLOR = "#4caf50";

const MapBlock = ({
  field,
  fieldsList = [],
  gpsByDays = [],
  dayState = {},          // 👈 НОВЕ
  equipmentWidth = 0,
  height = "400px",
  zoom = 15,
}) => {
  // ===== Поле =====
  const resolvedField = useMemo(() => {
    if (!field?.value) return null;
    return fieldsList.find((f) => f._id === field.value) || null;
  }, [field, fieldsList]);

  const fieldCoords = useMemo(() => {
    if (
      resolvedField?.geometry?.type === "Polygon" &&
      resolvedField.geometry.coordinates?.[0]
    ) {
      return resolvedField.geometry.coordinates[0].map(
        ([lng, lat]) => [lat, lng]
      );
    }
    return null;
  }, [resolvedField]);

  const turfFieldPolygon = useMemo(() => {
    if (!fieldCoords?.length) return null;
    return turf.polygon([fieldCoords.map(([lat, lng]) => [lng, lat])]);
  }, [fieldCoords]);

  // ===== GPS POLYLINES =====
  const gpsPolylines = useMemo(() => {
    return gpsByDays.map((day) => {
      const coords =
        day.points?.flatMap((p) =>
          p.data
            .filter(
              (pt) =>
                pt.latitude &&
                pt.longitude &&
                pt.latitude !== 0 &&
                pt.longitude !== 0
            )
            .map((pt) => [pt.latitude, pt.longitude])
        ) || [];

      return {
        date: day.date,
        coords,
      };
    });
  }, [gpsByDays]);

  // ===== GPS BUFFERS =====
  const gpsFieldBuffers = useMemo(() => {
    if (!equipmentWidth || !turfFieldPolygon) return [];

    return gpsByDays
      .map((day) => {
        const inside =
          day.points?.flatMap((p) =>
            p.data
              .filter(
                (pt) =>
                  pt.latitude &&
                  pt.longitude &&
                  pt.latitude !== 0 &&
                  pt.longitude !== 0 &&
                  turf.booleanPointInPolygon(
                    [pt.longitude, pt.latitude],
                    turfFieldPolygon
                  )
              )
              .map((pt) => [pt.longitude, pt.latitude])
          ) || [];

        if (inside.length < 2) return null;

        const line = turf.lineString(inside);
        const buffer = turf.buffer(line, equipmentWidth / 2, {
          units: "meters",
        });

        return {
          date: day.date,
          polygon: buffer.geometry.coordinates[0].map(
            ([lng, lat]) => [lat, lng]
          ),
        };
      })
      .filter(Boolean);
  }, [gpsByDays, equipmentWidth, turfFieldPolygon]);

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

        {/* FIELD */}
        {fieldCoords && (
          <Polygon positions={fieldCoords} pathOptions={{ color: "blue" }}>
            <Tooltip permanent>
              {resolvedField?.properties?.name}
            </Tooltip>
          </Polygon>
        )}

        {/* POLYLINES */}
        {gpsPolylines.map((track) => {
          const state = dayState[track.date];
          if (!state?.visible || track.coords.length < 2) return null;

          return (
            <Polyline
              key={`line-${track.date}`}
              positions={track.coords}
              pathOptions={{
                color: state.color || DEFAULT_COLOR,
                opacity: 0.45,
                weight: 4,
              }}
            >
              <Tooltip>{track.date}</Tooltip>
            </Polyline>
          );
        })}

        {/* BUFFERS */}
        {gpsFieldBuffers.map((buf) => {
          const state = dayState[buf.date];
          if (!state?.visible) return null;

          return (
            <Polygon
              key={`buffer-${buf.date}`}
              positions={buf.polygon}
              pathOptions={{
                color: state.color || DEFAULT_COLOR,
                fillOpacity: 0.4,
                weight: 1,
              }}
            />
          );
        })}

        <CenterMap fieldCoords={fieldCoords} />
      </MapContainer>
    </div>
  );
};

export default MapBlock;
