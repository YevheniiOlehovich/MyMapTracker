import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker, Popup } from 'react-leaflet';
import Styles from './styled';
import { getTileLayerConfig } from '../../helpres/tileLayerHelper';
import { fetchGpsData } from '../../store/locationSlice';
import { fetchFields, selectAllFields } from '../../store/fieldsSlice';
import { fetchCadastre, selectAllCadastre } from '../../store/cadastreSlice';
import { fetchGeozone, selectAllGeozone } from '../../store/geozoneSlice';
import { selectShowFields, selectShowCadastre, selectShowGeozones } from '../../store/layersList';
import { selectMapCenter, selectZoomLevel, setZoomLevel } from '../../store/mapCenterSlice';
import { selectCurrentLocation } from '../../store/currentLocationSlice';
import MapCenterUpdater from '../MapCenterUpdater';
import TrackMarkers from '../TrackMarkers';
import FieldLabel from '../FieldLabel';
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice';
import L from 'leaflet';

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
    const gpsData = useSelector((state) => state.gps.data);
    const gpsStatus = useSelector((state) => state.gps.status);
    const gpsError = useSelector((state) => state.gps.error);
    const selectedDate = useSelector((state) => state.calendar.selectedDate);
    const selectedImei = useSelector((state) => state.vehicle.imei);
    const showTrack = useSelector((state) => state.vehicle.showTrack);

    const fieldsData = useSelector(selectAllFields);
    const fieldsStatus = useSelector((state) => state.fields.status);
    const fieldsError = useSelector((state) => state.fields.error);

    const cadastreData = useSelector(selectAllCadastre);
    const cadastreStatus = useSelector((state) => state.cadastre.status);
    const cadastreError = useSelector((state) => state.cadastre.error);

    const geozoneData = useSelector(selectAllGeozone);
    const geozoneStatus = useSelector((state) => state.geozone.status);
    const geozoneError = useSelector((state) => state.geozone.error);

    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);

    const mapType = useSelector((state) => state.map.type);
    const mapCenter = useSelector(selectMapCenter);
    const zoomLevel = useSelector(selectZoomLevel);
    const currentLocation = useSelector(selectCurrentLocation); // Поточне місцезнаходження

    const [key, setKey] = useState(0);

    useEffect(() => {
        if (gpsStatus === 'idle') {
            dispatch(fetchGpsData());
        }
        if (fieldsStatus === 'idle') {
            dispatch(fetchFields());
        }
        if (cadastreStatus === 'idle') {
            dispatch(fetchCadastre());
        }
        if (geozoneStatus === 'idle') {
            dispatch(fetchGeozone());
        }
    }, [dispatch, gpsStatus, fieldsStatus, cadastreStatus, geozoneStatus]);

    useEffect(() => {
        setKey((prevKey) => prevKey + 1);
    }, [mapType]);

    const tileLayerConfig = getTileLayerConfig(mapType);

    const handleEditField = (field) => {
        dispatch(setSelectedField(field));
        dispatch(openAddFieldsModal());
    };

    const currentLocationIcon = L.icon({
        iconUrl: 'https://cdn-icons-png.flaticon.com/512/684/684908.png',
        iconSize: [25, 25],
        iconAnchor: [12, 12],
    });

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

                {showFields && fieldsData.map((field, index) => (
                    field.visibility && (
                        <React.Fragment key={index}>
                            <FieldLabel key={index} feature={field} zoomLevel={zoomLevel} type="field" onOpenModal={handleEditField} />
                            {field.matching_plots && field.matching_plots.map((plot, plotIndex) => (
                                <Polygon
                                    key={`matching-${index}-${plotIndex}`}
                                    positions={plot.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                                    color="red"
                                />
                            ))}
                            {field.not_processed && field.not_processed.map((plot, plotIndex) => (
                                <Polygon
                                    key={`not-processed-${index}-${plotIndex}`}
                                    positions={plot.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                                    color="green"
                                />
                            ))}
                        </React.Fragment>
                    )
                ))}

                {showCadastre && cadastreData.map((cadastre, index) => (
                    <FieldLabel key={index} feature={cadastre} zoomLevel={zoomLevel} type="cadastre" />
                ))}

                {showGeozones && geozoneData.map((geozone, index) => (
                    <FieldLabel key={index} feature={geozone} zoomLevel={zoomLevel} type="geozone" />
                ))}

                {/* Додаємо маркер тільки якщо currentLocation заданий */}
                {currentLocation && (
                    <Marker position={currentLocation} icon={currentLocationIcon}>
                        <Popup>Ви тут!</Popup>
                    </Marker>
                )}

                <ZoomTracker setZoomLevel={(zoom) => dispatch(setZoomLevel(zoom))} />
                <MapCenterUpdater />
            </MapContainer>
        </Styles.wrapper>
    );
}