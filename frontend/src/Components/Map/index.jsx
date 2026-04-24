import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  MapContainer,
  TileLayer,
  useMapEvents,
} from "react-leaflet";

import Styles from "./styled";
import { getTileLayerConfig } from "../../helpres/tileLayerHelper";

import { useCadastreData } from "../../hooks/useCadastreData";
import { useFieldsData } from "../../hooks/useFieldsData";
import { useGeozoneData } from "../../hooks/useGeozonesData";
import { useGpsData } from "../../hooks/useGpsData";
import { useUnitsData } from "../../hooks/useUnitsData";
import { useRentsData } from "../../hooks/useRentData";
import { usePropertiesData } from "../../hooks/usePropertiesData";
import { useLastGpsByDate } from "../../hooks/useLastGpsByDate";

import {
  selectShowFields,
  selectShowCadastre,
  selectShowGeozones,
  selectShowUnits,
  selectShowRent,
  selectShowProperty,
} from "../../store/layersList";

import {
  selectMapCenter,
  selectZoomLevel,
  setZoomLevel,
} from "../../store/mapCenterSlice";

import { selectCurrentLocation } from "../../store/currentLocationSlice";
import { setSelectedField, openAddFieldsModal } from "../../store/modalSlice";

import MapCenterUpdater from "../MapCenterUpdater";
import TrackMarkers from "../TrackMarkers";
import MeasureLayer from "../MeasureLayer";
import CurrentLocationMarker from "../CurrentLocationMarker";

import PropertyLayer from "../PropertyLayer";
import RentLayer from "../RentLayer";
import UnitsLayer from "../UnitsLayer";
import GeozoneLayer from "../GeozoneLayer";
import CadastreLayer from "../CadastreLayer";
import SelectedCadastreLayer from "../SelectedCadastreLayer";
import FieldsLayer from "../FieldsLayer";

import "leaflet/dist/leaflet.css";
import "@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css";
import "@geoman-io/leaflet-geoman-free";

function ZoomTracker({ setZoomLevel }) {
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });

  return null;
}

export default function Map() {
  const dispatch = useDispatch();

  const { data: gpsData = [], isLoading: isGpsLoading } =
    useGpsData();

  const {
    data: fieldsData = [],
    isLoading: isFieldsLoading,
  } = useFieldsData();

  const {
    data: cadastreData = [],
    isLoading: isCadastreLoading,
  } = useCadastreData();

  const {
    data: geozoneData = [],
    isLoading: isGeozoneLoading,
  } = useGeozoneData();

  const {
    data: unitsData = [],
    isLoading: isUnitsLoading,
  } = useUnitsData();

  const {
    data: rentData = [],
    isLoading: isRentsLoading,
  } = useRentsData();

  const {
    data: propertyData = [],
    isLoading: isPropertyLoading,
  } = usePropertiesData();

  const { data: lastGpsData = [] } =
    useLastGpsByDate();

  const showFields = useSelector(selectShowFields);
  const showCadastre = useSelector(selectShowCadastre);
  const showGeozones = useSelector(selectShowGeozones);
  const showUnits = useSelector(selectShowUnits);
  const showRent = useSelector(selectShowRent);
  const showProperty = useSelector(selectShowProperty);

  const selectedCadastre = useSelector(
    (state) => state.selectedCadastre.selectedCadastre
  );

  const mapType = useSelector(
    (state) => state.map.type
  );

  const mapCenter = useSelector(selectMapCenter);
  const zoomLevel = useSelector(selectZoomLevel);
  const currentLocation = useSelector(
    selectCurrentLocation
  );

  const selectedDate = useSelector(
    (state) => state.calendar.selectedDate
  );

  const selectedImei = useSelector(
    (state) => state.vehicle.imei
  );

  const showTrack = useSelector(
    (state) => state.vehicle.showTrack
  );

  const activeFieldId = useSelector(
    (state) => state.activeField.activeFieldId
  );

  const [key, setKey] = useState(0);

  useEffect(() => {
    setKey((prev) => prev + 1);
  }, [mapType]);

  const tileLayerConfig =
    getTileLayerConfig(mapType);

  const handleEditField = (field) => {
    dispatch(setSelectedField(field._id));
    dispatch(openAddFieldsModal());
  };

  if (
    isGpsLoading ||
    isCadastreLoading ||
    isFieldsLoading ||
    isGeozoneLoading ||
    isUnitsLoading ||
    isRentsLoading ||
    isPropertyLoading
  ) {
    return <p>Loading map data...</p>;
  }

  return (
    <Styles.wrapper>
      <MapContainer
        key={key}
        center={mapCenter}
        zoom={zoomLevel}
        attributionControl
        doubleClickZoom
        scrollWheelZoom
        easeLinearity={0.8}
        zoomControl={false}
        style={{
          height: "100vh",
          width: "100%",
        }}
      >
        {tileLayerConfig && (
          <TileLayer
            url={tileLayerConfig.url}
            subdomains={
              tileLayerConfig.subdomains
            }
            attribution={
              tileLayerConfig.attribution
            }
          />
        )}

        <TrackMarkers
          gpsData={lastGpsData}
          selectedDate={selectedDate}
          selectedImei={selectedImei}
          showTrack={showTrack}
        />

        {showFields && (
          <FieldsLayer
            fieldsData={fieldsData}
            zoomLevel={zoomLevel}
            activeFieldId={activeFieldId}
            onEditField={handleEditField}
          />
        )}

        {/* КАДАСТР */}
        {showCadastre && (
            <CadastreLayer
                cadastreData={cadastreData}
                zoomLevel={zoomLevel}
            />
        )}

        {selectedCadastre && (
            <SelectedCadastreLayer
                zoomLevel={zoomLevel}
            />
        )}

        {showGeozones && (
          <GeozoneLayer
            geozoneData={geozoneData}
            zoomLevel={zoomLevel}
          />
        )}

        {showUnits && (
          <UnitsLayer unitsData={unitsData} />
        )}

        {showRent && (
          <RentLayer rentData={rentData} />
        )}

        {showProperty && (
          <PropertyLayer
            propertyData={propertyData}
            zoomLevel={zoomLevel}
          />
        )}

        {currentLocation && (
          <CurrentLocationMarker
            position={currentLocation}
          />
        )}

        <ZoomTracker
          setZoomLevel={(zoom) =>
            dispatch(setZoomLevel(zoom))
          }
        />

        <MapCenterUpdater />
        <MeasureLayer />
      </MapContainer>
    </Styles.wrapper>
  );
}