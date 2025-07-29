import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
    MapContainer,
    TileLayer,
    useMapEvents,
    Polygon,
    Marker,
    Popup,
} from 'react-leaflet';
import Styles from './styled';
import { getTileLayerConfig } from '../../helpres/tileLayerHelper';
import { useCadastreData } from '../../hooks/useCadastreData';
import { useFieldsData } from '../../hooks/useFieldsData';
import { useGeozoneData } from '../../hooks/useGeozonesData';
import { useGpsData } from '../../hooks/useGpsData';
import { useUnitsData } from '../../hooks/useUnitsData';
import { useRentsData } from '../../hooks/useRentData';
import { usePropertiesData } from '../../hooks/usePropertiesData'; 


import {
    selectShowFields,
    selectShowCadastre,
    selectShowGeozones,
    selectShowUnits,
    selectShowRent, // 🆕 Додано селектор
    selectShowProperty 
} from '../../store/layersList';
import {
    selectMapCenter,
    selectZoomLevel,
    setZoomLevel,
} from '../../store/mapCenterSlice';
import { selectCurrentLocation } from '../../store/currentLocationSlice';
import MapCenterUpdater from '../MapCenterUpdater';
import TrackMarkers from '../TrackMarkers';
import FieldLabel from '../FieldLabel';
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice';
import L from 'leaflet';
import RedMarker from '../../assets/ico/redmarker.png';

import 'leaflet/dist/leaflet.css';
import '@geoman-io/leaflet-geoman-free/dist/leaflet-geoman.css';
import '@geoman-io/leaflet-geoman-free';
import MeasureLayer from '../MeasureLayer'; // Імпортуємо компонент GeomanControl


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

    const { data: gpsData = [], isLoading: isGpsLoading, isError: isGpsError, error: gpsError } = useGpsData();
    const { data: cadastreData, isLoading: isCadastreLoading, error: cadastreError } = useCadastreData();
    const { data: fieldsData, isLoading: isFieldsLoading, error: fieldsError } = useFieldsData();
    const { data: geozoneData, isLoading: isGeozoneLoading, error: geozoneError } = useGeozoneData();
    const { data: unitsData = [], isLoading: isUnitsLoading, error: unitsError } = useUnitsData();
    const { data: rentData = [], isLoading: isRentsLoading, error: rentsError } = useRentsData(); // 🆕
    const { data: propertyData = [], isLoading: isPropertyLoading, error: propertyError } = usePropertiesData();
    

    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);
    const showUnits = useSelector(selectShowUnits);
    const showRent = useSelector(selectShowRent); // 🆕
    const showProperty = useSelector(selectShowProperty);

    const mapType = useSelector((state) => state.map.type);
    const mapCenter = useSelector(selectMapCenter);
    const zoomLevel = useSelector(selectZoomLevel);
    const currentLocation = useSelector(selectCurrentLocation);
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const selectedImei = useSelector((state) => state.vehicle.imei);
    const showTrack = useSelector((state) => state.vehicle.showTrack);

    const [key, setKey] = useState(0);

    useEffect(() => {
        setKey((prevKey) => prevKey + 1);
    }, [mapType]);

    const tileLayerConfig = getTileLayerConfig(mapType);

    const handleEditField = (field) => {
        dispatch(setSelectedField(field._id));
        dispatch(openAddFieldsModal());
    };

    const currentLocationIcon = L.icon({
        iconUrl: RedMarker,
        iconSize: [25, 25],
        iconAnchor: [12, 12],
    });

    if (isGpsLoading || isCadastreLoading || isFieldsLoading || isGeozoneLoading || isUnitsLoading || isRentsLoading) {
        return <p>Loading map data...</p>;
    }

    if (isGpsError || cadastreError || fieldsError || geozoneError || unitsError || rentsError) {
        return (
            <p>
                Error loading map data:{' '}
                {gpsError?.message ||
                    cadastreError?.message ||
                    fieldsError?.message ||
                    geozoneError?.message ||
                    unitsError?.message ||
                    rentsError?.message}
            </p>
        );
    }

    return (
        <Styles.wrapper>
            <MapContainer
                key={key}
                center={mapCenter}
                zoom={zoomLevel}
                attributionControl={true}
                doubleClickZoom={true}
                scrollWheelZoom={true}
                easeLinearity={0.8}
                style={{ height: '100vh', width: '100%' }}
                zoomControl={false}
            >
                {tileLayerConfig && (
                    <TileLayer
                        url={tileLayerConfig.url}
                        subdomains={tileLayerConfig.subdomains}
                        attribution={tileLayerConfig.attribution}
                    />
                )}

                <TrackMarkers
                    gpsData={gpsData}
                    selectedDate={selectedDate}
                    selectedImei={selectedImei}
                    showTrack={showTrack}
                />

                {showFields &&
                    fieldsData.map((field, index) =>
                        field.visible ? (
                            <React.Fragment key={index}>
                                <FieldLabel
                                    feature={field}
                                    zoomLevel={zoomLevel}
                                    type="field"
                                    onOpenModal={handleEditField}
                                />
                                {field.matching_plots?.map((plot, plotIndex) => (
                                    <Polygon
                                        key={`matching-${index}-${plotIndex}`}
                                        positions={plot.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                        color="red"
                                    />
                                ))}
                                {field.not_processed?.map((plot, plotIndex) => (
                                    <Polygon
                                        key={`not-processed-${index}-${plotIndex}`}
                                        positions={plot.geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                        color="green"
                                    />
                                ))}
                            </React.Fragment>
                        ) : null
                    )}

                {showCadastre &&
                    cadastreData.map((cadastre, index) => (
                        <FieldLabel key={index} feature={cadastre} zoomLevel={zoomLevel} type="cadastre" />
                    ))}

                {showGeozones &&
                    geozoneData.map((geozone, index) => (
                        <FieldLabel key={index} feature={geozone} zoomLevel={zoomLevel} type="geozone" />
                    ))}

                {showUnits &&
                    unitsData.map((unit, index) => {
                        const { geometry, properties } = unit;

                        if (geometry?.type === 'Polygon') {
                            return (
                                <Polygon
                                    key={`unit-${index}`}
                                    positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                    color="red"
                                    fillColor="red"
                                    fillOpacity={0.2}
                                >
                                    <Popup>
                                        <strong>{properties?.name || 'Unit'}</strong><br />
                                        {properties?.area && `Площа: ${properties.area}`}<br />
                                        {properties?.branch && `Філія: ${properties.branch}`}
                                    </Popup>
                                </Polygon>
                            );
                        }

                        if (geometry?.type === 'Point') {
                            return (
                                <Marker
                                    key={`unit-marker-${index}`}
                                    position={[geometry.coordinates[1], geometry.coordinates[0]]}
                                    icon={L.divIcon({
                                        className: 'custom-unit-icon',
                                        html: `<div style="width: 16px; height: 16px; background-color: red; border-radius: 50%; border: 2px solid white;"></div>`,
                                    })}
                                >
                                    <Popup>
                                        <strong>{properties?.name || 'Unit'}</strong><br />
                                        {properties?.radius && `Радіус: ${properties.radius}`}
                                    </Popup>
                                </Marker>
                            );
                        }

                        return null;
                    })}

                {showRent &&
                    rentData.map((rent, index) => {
                        const { geometry, properties } = rent;

                        if (geometry?.type === 'Polygon' && geometry.coordinates?.length) {
                            return (
                                <Polygon
                                    key={`rent-${index}`}
                                    positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                    color="#003366"
                                    fillColor="#0077cc"
                                    fillOpacity={0.3}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{properties?.name || 'Орендар'}</strong><br />
                                            {properties?.ikn && <>Кадастр: {properties.ikn}<br /></>}
                                            {properties?.lessor && <>Орендодавець: {properties.lessor}<br /></>}
                                            {properties?.area && <>Площа: {properties.area} га</>}
                                        </div>
                                    </Popup>
                                </Polygon>
                            );
                        }

                        return null;
                    })}

                {showProperty &&
                    propertyData.map((property, index) => {
                        const { geometry, properties } = property;

                        if (geometry?.type === 'Polygon' && geometry.coordinates?.length) {
                            return (
                                <Polygon
                                    key={`property-${index}`}
                                    positions={geometry.coordinates[0].map(([lng, lat]) => [lat, lng])}
                                    color="#006600"            // наприклад зелений колір
                                    fillColor="#00cc00"
                                    fillOpacity={0.3}
                                >
                                    <Popup>
                                        <div>
                                            <strong>{properties?.name || 'Власність'}</strong><br />
                                            {properties?.ikn && <>Кадастр: {properties.ikn}<br /></>}
                                            {properties?.owner && <>Власник: {properties.owner}<br /></>} {/* Якщо є поле owner */}
                                            {properties?.area && <>Площа: {properties.area} га</>}
                                        </div>
                                    </Popup>
                                </Polygon>
                            );
                        }

                        // Можна додати підтримку для інших типів геометрії, якщо потрібно

                        return null;
                    })}




                {currentLocation && (
                    <Marker position={currentLocation} icon={currentLocationIcon}>
                        <Popup>Ви тут!</Popup>
                    </Marker>
                )}

                <ZoomTracker setZoomLevel={(zoom) => dispatch(setZoomLevel(zoom))} />
                <MapCenterUpdater />
                <MeasureLayer />
            </MapContainer>
        </Styles.wrapper>
    );
}
