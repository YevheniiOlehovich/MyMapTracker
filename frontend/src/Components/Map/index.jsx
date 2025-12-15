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
import { setActiveField, clearActiveField } from '../../store/activeFieldSlice';
import { useLastGpsByDate  } from '../../hooks/useLastGpsByDate';

import {
    selectShowFields,
    selectShowCadastre,
    selectShowGeozones,
    selectShowUnits,
    selectShowRent,
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

import CurrentLocationMarker from '../CurrentLocationMarker';
import PropertyLayer from '../PropertyLayer';
import RentLayer from '../RentLayer';
import UnitsLayer from '../UnitsLayer';
import GeozoneLayer from '../GeozoneLayer';
import CadastreLayer from '../CadastreLayer';
import FieldsLayer from '../FieldsLayer';

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
    const { data: lastGpsData = [] } = useLastGpsByDate();
      
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

    const activeFieldId = useSelector((state) => state.activeField.activeFieldId);

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
                    gpsData={lastGpsData} // передаємо тільки останні точки
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

                {showCadastre && <CadastreLayer cadastreData={cadastreData} zoomLevel={zoomLevel} />}

                {showGeozones && <GeozoneLayer geozoneData={geozoneData} zoomLevel={zoomLevel} />}

                {showUnits && <UnitsLayer unitsData={unitsData} />}

                {showRent && <RentLayer rentData={rentData} />}

                {showProperty && <PropertyLayer propertyData={propertyData} zoomLevel={zoomLevel} />}

                {currentLocation && <CurrentLocationMarker position={currentLocation} />}

                <ZoomTracker setZoomLevel={(zoom) => dispatch(setZoomLevel(zoom))} />
                <MapCenterUpdater />
                <MeasureLayer />
            </MapContainer>
        </Styles.wrapper>
    );
}