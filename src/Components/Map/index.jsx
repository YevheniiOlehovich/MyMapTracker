import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMapEvents, Polygon, Marker, Popup, useMap } from 'react-leaflet';
import Styles from './styled';
import { getTileLayerConfig } from '../../helpres/tileLayerHelper';
import { useCadastreData } from '../../hooks/useCadastreData'; // Хук для кадастрових даних
import { useFieldsData } from '../../hooks/useFieldsData'; // Хук для даних полів
import { useGeozoneData } from '../../hooks/useGeozonesData'; // Хук для геозон
import { useGpsData } from '../../hooks/useGpsData'; // Хук для GPS-даних
import reducer, { selectShowFields, selectShowCadastre, selectShowGeozones } from '../../store/layersList';
import { selectMapCenter, selectZoomLevel, setZoomLevel } from '../../store/mapCenterSlice';
import { selectCurrentLocation } from '../../store/currentLocationSlice';
import MapCenterUpdater from '../MapCenterUpdater';
import TrackMarkers from '../TrackMarkers';
import FieldLabel from '../FieldLabel';
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice';
import L from 'leaflet';
import RedMarker from '../../assets/ico/redmarker.png';


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

    // Використовуємо React Query для отримання GPS-даних
    const { data: gpsData = [], isLoading: isGpsLoading, isError: isGpsError, error: gpsError } = useGpsData();

    // Використовуємо React Query для отримання кадастрових даних
    const { data: cadastreData, isLoading: isCadastreLoading, error: cadastreError } = useCadastreData();

    // Використовуємо React Query для отримання даних полів
    const { data: fieldsData, isLoading: isFieldsLoading, error: fieldsError } = useFieldsData();

    // Використовуємо React Query для отримання геозон
    const { data: geozoneData, isLoading: isGeozoneLoading, error: geozoneError } = useGeozoneData();

    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);

    const mapType = useSelector((state) => state.map.type);
    const mapCenter = useSelector(selectMapCenter);
    const zoomLevel = useSelector(selectZoomLevel);
    const currentLocation = useSelector(selectCurrentLocation); // Поточне місцезнаходження

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

    if (isGpsLoading || isCadastreLoading || isFieldsLoading || isGeozoneLoading) {
        return <p>Loading map data...</p>;
    }

    if (isGpsError || cadastreError || fieldsError || geozoneError) {
        return (
            <p>
                Error loading map data:{' '}
                {gpsError?.message || cadastreError?.message || fieldsError?.message || geozoneError?.message}
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
                    selectedDate={selectedDate} // Якщо потрібна фільтрація за датою, додайте відповідний параметр
                    selectedImei={selectedImei} // Якщо потрібна фільтрація за IMEI, додайте відповідний параметр
                    showTrack={showTrack} // Якщо потрібно показувати трек
                />

                {showFields &&
                    fieldsData.map((field, index) =>
                        field.visible ? (
                            <React.Fragment key={index}>
                                <FieldLabel
                                    key={index}
                                    feature={field}
                                    zoomLevel={zoomLevel}
                                    type="field"
                                    onOpenModal={handleEditField}
                                />
                                {field.matching_plots &&
                                    field.matching_plots.map((plot, plotIndex) => (
                                        <Polygon
                                            key={`matching-${index}-${plotIndex}`}
                                            positions={plot.geometry.coordinates[0].map((coord) => [
                                                coord[1],
                                                coord[0],
                                            ])}
                                            color="red"
                                        />
                                    ))}
                                {field.not_processed &&
                                    field.not_processed.map((plot, plotIndex) => (
                                        <Polygon
                                            key={`not-processed-${index}-${plotIndex}`}
                                            positions={plot.geometry.coordinates[0].map((coord) => [
                                                coord[1],
                                                coord[0],
                                            ])}
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