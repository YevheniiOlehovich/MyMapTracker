import React, { useMemo, useState, useEffect, useRef } from "react";
import { Marker, Polyline, Popup, useMap } from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-markercluster";
import { useDispatch } from "react-redux";
import L from "leaflet";

import { setImei } from "../../store/vehicleSlice";

import { useVehiclesData } from "../../hooks/useVehiclesData";
import { usePersonnelData } from "../../hooks/usePersonnelData";
import { useTechniquesData } from "../../hooks/useTechniquesData";
import { useGpsByImei } from "../../hooks/useGpsByImei";

import { filterGpsDataByDate } from "../../helpres/trekHelpers";
import { splitGpsSegments } from "../../helpres/splitGpsSegments";

import parkingIco from "../../assets/ico/parking-ico.png";
import carIco from "../../assets/ico/car-ico.png";
import tractorIco from "../../assets/ico/tractor-ico.png";
import combineIco from "../../assets/ico/combine-ico.png";
import truckIco from "../../assets/ico/truck-ico.png";
import sprayerIco from "../../assets/ico/sprayer-ico.png";
import anomalyIco from "../../assets/ico/warning.png";

const TrackMarkers = ({ gpsData, selectedDate }) => {
  const dispatch = useDispatch();
  const map = useMap();

  const [activeImei, setActiveImei] = useState(null);
  const [showAllMarkers, setShowAllMarkers] = useState(false);

  const markersRef = useRef({});

  const { data: vehicles = [] } = useVehiclesData();
  const { data: personnel = [] } = usePersonnelData();
  const { data: techniques = [] } = useTechniquesData();
  const { data: imeiData } = useGpsByImei(activeImei);

  /* ------------------------------------------------ */
  /* RESET */
  /* ------------------------------------------------ */

  useEffect(() => {
    setActiveImei(null);
    setShowAllMarkers(false);
    map?.closePopup();
  }, [selectedDate, map]);

  /* ------------------------------------------------ */
  /* MAPS */
  /* ------------------------------------------------ */

  const vehiclesMap = useMemo(() => {
    const map = {};

    vehicles.forEach((v) => {
      map[v.imei] = v;
    });

    return map;
  }, [vehicles]);

  const personnelMap = useMemo(() => {
    const map = {};

    personnel.forEach((p) => {
      map[p.rfid] = p;
    });

    return map;
  }, [personnel]);

  const techniquesMap = useMemo(() => {
    const map = {};

    techniques.forEach((t) => {
      map[String(t.rfid)] = t;
    });

    return map;
  }, [techniques]);

  /* ------------------------------------------------ */
  /* HELPERS */
  /* ------------------------------------------------ */

  const normalizeType = (type) =>
    (type || "car").toLowerCase();

  const getIconByType = (type) =>
    ({
      car: carIco,
      tractor: tractorIco,
      combine: combineIco,
      truck: truckIco,
      sprayer: sprayerIco,
    }[type] || carIco);

  const getColorByType = (type) =>
    ({
      car: "#007bff",
      tractor: "#28a745",
      combine: "#ffc107",
      truck: "#dc3545",
      sprayer: "#6f42c1",
    }[type] || "#007bff");

  const getEmojiByType = (type) =>
    ({
      car: "🚗",
      tractor: "🚜",
      combine: "🌾",
      truck: "🚚",
      sprayer: "💧",
    }[type] || "🚗");

  const formatTime = (iso) =>
    new Date(iso).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
    });

  const formatDuration = (secs) => {
    if (!secs || secs <= 0) return "0 хв";

    const h = Math.floor(secs / 3600);
    const m = Math.floor((secs % 3600) / 60);

    return `${h ? `${h} год ` : ""}${m ? `${m} хв` : ""}`.trim();
  };

  /* ------------------------------------------------ */
  /* FILTERED GPS */
  /* ------------------------------------------------ */

  const filteredGpsData = useMemo(
    () => filterGpsDataByDate(gpsData, selectedDate),
    [gpsData, selectedDate]
  );

  /* ------------------------------------------------ */
  /* ACTIVE VEHICLE DATA */
  /* ------------------------------------------------ */

  const activeVehicleData = useMemo(() => {
    if (!activeImei) return null;

    if (imeiData?.length) {
      const found = imeiData.find(
        (d) => d.imei === activeImei
      );

      return found?.data || null;
    }

    const fallback = filteredGpsData.find(
      (d) => d.imei === activeImei
    );

    return fallback?.data || null;
  }, [activeImei, imeiData, filteredGpsData]);

  /* ------------------------------------------------ */
  /* SEGMENTS */
  /* ------------------------------------------------ */

  const vehicleSegments = useMemo(() => {
    if (!activeVehicleData) return [];

    const vehicle = vehiclesMap[activeImei];

    const vehicleType = normalizeType(
      vehicle?.vehicleType
    );

    return splitGpsSegments(activeVehicleData).map(
      (seg) => {
        const driver =
          personnelMap[seg.driverCardId];

        return {
          ...seg,
          imei: activeImei,
          vehicleType,
          vehicleName:
            vehicle?.mark || "Невідома техніка",
          driverName: driver
            ? `${driver.firstName} ${driver.lastName}`
            : null,
        };
      }
    );
  }, [
    activeVehicleData,
    activeImei,
    vehiclesMap,
    personnelMap,
  ]);

  const movingSegments = useMemo(
    () =>
      vehicleSegments.filter(
        (seg) => seg.type === "moving"
      ),
    [vehicleSegments]
  );

  const parkingSegments = useMemo(
    () =>
      vehicleSegments.filter(
        (seg) => seg.type === "parking"
      ),
    [vehicleSegments]
  );

  const anomalySegments = useMemo(
    () =>
      vehicleSegments.filter(
        (seg) => seg.type === "anomaly"
      ),
    [vehicleSegments]
  );

  /* ------------------------------------------------ */
  /* TOTAL DISTANCE */
  /* ------------------------------------------------ */

  const totalDistance = useMemo(() => {
    return movingSegments
      .reduce(
        (sum, seg) =>
          sum + Number(seg.distance || 0),
        0
      )
      .toFixed(2);
  }, [movingSegments]);

  /* ------------------------------------------------ */
  /* LAST GPS */
  /* ------------------------------------------------ */

  const lastGpsPoints = useMemo(() => {
    const map = {};

    gpsData.forEach((p) => {
      if (!p.latitude || !p.longitude) return;

      map[p.imei] = p;
    });

    return Object.values(map);
  }, [gpsData]);

  /* ------------------------------------------------ */
  /* ACTIONS */
  /* ------------------------------------------------ */

  const handleMarkerClick = (imei) => {
    setActiveImei(imei);
    setShowAllMarkers(true);

    dispatch(setImei(imei));
  };

  /* ------------------------------------------------ */
  /* AUTO OPEN POPUP */
  /* ------------------------------------------------ */

  useEffect(() => {
    if (!activeImei) return;

    const tryOpen = () => {
      const marker =
        markersRef.current[activeImei];

      if (marker && marker._map) {
        marker.openPopup();

        map.panTo(marker.getLatLng());
      } else {
        setTimeout(tryOpen, 100);
      }
    };

    setTimeout(tryOpen, 0);
  }, [activeImei, showAllMarkers, map]);

  /* ------------------------------------------------ */
  /* RENDER */
  /* ------------------------------------------------ */

  return (
    <>
      {/* MAIN MARKERS */}

      <MarkerClusterGroup
        showCoverageOnHover={false}
        spiderfyOnMaxZoom={true}
        zoomToBoundsOnClick={true}
      >
        {lastGpsPoints.map((p, i) => {
          const vehicle = vehiclesMap[p.imei];

          const vehicleType = normalizeType(
            vehicle?.vehicleType
          );

          const isActive =
            activeImei === p.imei;

          const isDimmed =
            activeImei && !isActive;

          return (
            <Marker
              key={`main-${i}`}
              position={[
                p.latitude,
                p.longitude,
              ]}
              icon={
                new L.Icon({
                  iconUrl:
                    getIconByType(vehicleType),

                  iconSize: isActive
                    ? [65, 65]
                    : [45, 45],

                  className: isActive
                    ? "active-marker"
                    : isDimmed
                    ? "dim-marker"
                    : "",
                })
              }
              eventHandlers={{
                click: () =>
                  handleMarkerClick(p.imei),
              }}
              ref={(ref) => {
                if (ref) {
                  markersRef.current[p.imei] =
                    ref;
                }
              }}
            >
              <Popup
                autoPan={false}
                minWidth={260}
              >
                <div
                  style={{
                    fontSize: 12,
                    lineHeight: 1.4,
                  }}
                >
                  <b>
                    {getEmojiByType(
                      vehicleType
                    )}{" "}
                    {vehicle?.mark ||
                      "Невідома техніка"}
                  </b>{" "}
                  {vehicle?.regNumber || "—"}

                  <br />

                  IMEI: {p.imei}

                  <br />

                  🕒{" "}
                  {new Date(
                    p.timestamp
                  ).toLocaleString()}

                  <br />

                  {(() => {
                    const driver =
                      personnelMap[p.io?.[157]];

                    return driver ? (
                      <div>
                        Водій:{" "}
                        {driver.firstName}{" "}
                        {driver.lastName}
                      </div>
                    ) : (
                      <div>
                        Водій не визначений
                      </div>
                    );
                  })()}

                  <div>
                    📌 BLE:{" "}
                    {techniquesMap[
                      String(p.io?.[131])
                    ]?.name ||
                      "не визначено"}
                  </div>

                  {isActive &&
                    movingSegments.length >
                      0 && (
                      <>
                        <hr />

                        <b>
                          📊 Сегменти руху
                        </b>

                        <div
                          style={{
                            maxHeight: 180,
                            overflowY: "auto",
                            marginTop: 6,
                          }}
                        >
                          {movingSegments.map(
                            (seg, idx) => (
                              <div
                                key={idx}
                                style={{
                                  marginBottom: 8,
                                }}
                              >
                                #{idx + 1}{" "}
                                {formatTime(
                                  seg.startTime
                                )}{" "}
                                →{" "}
                                {formatTime(
                                  seg.endTime
                                )}

                                <br />

                                📏{" "}
                                {Number(
                                  seg.distance
                                ).toFixed(2)}{" "}
                                км

                                {" · "}

                                ⏳{" "}
                                {formatDuration(
                                  seg.duration
                                )}
                              </div>
                            )
                          )}
                        </div>

                        <div
                          style={{
                            fontWeight: 700,
                            textAlign: "right",
                            marginTop: 6,
                          }}
                        >
                          Всього:{" "}
                          {totalDistance} км
                        </div>
                      </>
                    )}
                </div>
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* ROUTES */}

      {showAllMarkers &&
        movingSegments.map((seg, idx) => (
          <Polyline
            key={`route-${idx}`}
            positions={seg.coordinates}
            pathOptions={{
              color: getColorByType(
                seg.vehicleType
              ),
              weight: 5,
              opacity: 0.9,
            }}
          />
        ))}

      {/* SPEED CONTROL POINTS */}

      {showAllMarkers &&
        movingSegments.map((seg, segIdx) =>
          seg.points
            ?.filter(
              (point, idx) =>
                idx % 30 === 0 &&
                point.latitude &&
                point.longitude &&
                point.speed > 0
            )
            .map((point, idx) => {
              const isDangerSpeed =
                point.speed > 90;

              const isMediumSpeed =
                point.speed > 60;

              return (
                <Marker
                  key={`speed-${segIdx}-${idx}`}
                  position={[
                    point.latitude,
                    point.longitude,
                  ]}
                  icon={
                    new L.Icon({
                      iconUrl:
                        isDangerSpeed
                          ? anomalyIco
                          : getIconByType(
                              seg.vehicleType
                            ),

                      iconSize: isDangerSpeed
                        ? [20, 20]
                        : [16, 16],
                    })
                  }
                >
                  <Popup autoPan={false}>
                    <div
                      style={{
                        fontSize: 12,
                        minWidth: 170,
                        lineHeight: 1.4,
                      }}
                    >
                      <div
                        style={{
                          fontWeight: 700,
                          marginBottom: 6,
                        }}
                      >
                        {getEmojiByType(seg.vehicleType)}{" "}
                        {seg.vehicleName}
                      </div>

                      <div>
                        🕒{" "}
                        {new Date(
                          point.timestamp
                        ).toLocaleString()}
                      </div>

                      <div>
                        🚀 Швидкість:{" "}
                        <span
                          style={{
                            color:
                              isDangerSpeed
                                ? "#dc3545"
                                : isMediumSpeed
                                ? "#fd7e14"
                                : "#198754",

                            fontWeight: 700,
                          }}
                        >
                          {point.speed} км/год
                        </span>
                      </div>

                      {isDangerSpeed && (
                        <div
                          style={{
                            marginTop: 6,
                            color: "#dc3545",
                            fontWeight: 700,
                          }}
                        >
                          ⚠️ Перевищення швидкості
                        </div>
                      )}
                    </div>
                  </Popup>
                </Marker>
              );
            })
        )}

      {/* PARKINGS */}

      {showAllMarkers &&
        parkingSegments.map((seg, idx) => (
          <Marker
            key={`parking-${idx}`}
            position={
              seg.coordinates.at(-1)
            }
            icon={
              new L.Icon({
                iconUrl: parkingIco,
                iconSize: [26, 26],
              })
            }
          >
            <Popup autoPan={false}>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                <b>🅿️ Стоянка</b>

                <br />

                🚜 {seg.vehicleName}

                <br />

                ⏱{" "}
                {formatTime(
                  seg.startTime
                )}{" "}
                →{" "}
                {formatTime(seg.endTime)}

                <br />

                ⏳{" "}
                {formatDuration(
                  seg.duration
                )}
              </div>
            </Popup>
          </Marker>
        ))}

      {/* ANOMALIES */}

      {showAllMarkers &&
        anomalySegments.map((seg, idx) => (
          <Marker
            key={`anomaly-${idx}`}
            position={
              seg.coordinates.at(-1)
            }
            icon={
              new L.Icon({
                iconUrl: anomalyIco,
                iconSize: [28, 28],
              })
            }
          >
            <Popup autoPan={false}>
              <div
                style={{
                  fontSize: 12,
                  lineHeight: 1.4,
                }}
              >
                <b>⚠️ Аномалія</b>

                <br />

                🚜 {seg.vehicleName}

                <br />

                ⏱{" "}
                {formatTime(
                  seg.startTime
                )}{" "}
                →{" "}
                {formatTime(seg.endTime)}

                <br />

                ⏳{" "}
                {formatDuration(
                  seg.duration
                )}
              </div>
            </Popup>
          </Marker>
        ))}
    </>
  );
};

export default TrackMarkers;