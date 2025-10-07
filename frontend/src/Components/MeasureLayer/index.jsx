import { useMap } from "react-leaflet";
import { useEffect, useState } from "react";
import L from "leaflet";
import "@geoman-io/leaflet-geoman-free";
import * as turf from "@turf/turf";
import { Paper, Typography } from "@mui/material";

export default function MeasureLayer() {
  const map = useMap();
  const [measurement, setMeasurement] = useState(null);

  useEffect(() => {
    if (measurement) {
      console.log("Поточне вимірювання:", measurement);
    }
  }, [measurement]);

  useEffect(() => {
    if (!map) return;

    map.pm.addControls({
      position: "bottomright",
      drawPolygon: true,
      drawPolyline: true,
      editMode: true,
      dragMode: true,
      removalMode: true,
    });

    function updateMeasurement(layer) {
      if (layer instanceof L.Polygon) {
        let latlngs = layer.getLatLngs()[0].map(({ lat, lng }) => [lng, lat]);

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

    map.on("pm:create", (e) => updateMeasurement(e.layer));
    map.on("pm:edit", (e) => {
      e.layers.eachLayer((layer) => updateMeasurement(layer));
    });

    return () => {
      map.pm.removeControls();
      map.off("pm:create");
      map.off("pm:edit");
    };
  }, [map]);

  return (
    <Paper
      elevation={3}
      sx={{
        position: "absolute",
        bottom: 20,
        right: 60,
        p: 1.5,
        borderRadius: 2,
        zIndex: 1000,
        userSelect: "none",
        minWidth: 160,
        textAlign: "center",
      }}
    >
      <Typography variant="body2" color="text.primary">
        {measurement ?? "Намалюйте лінію або полігон"}
      </Typography>
    </Paper>
  );
}
