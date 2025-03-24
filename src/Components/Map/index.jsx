import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { MapContainer, TileLayer, useMapEvents, Polygon } from 'react-leaflet';
import Styles from './styled';
import { getTileLayerConfig } from '../../helpres/tileLayerHelper'; // Імпорт хелпера
import { fetchGpsData } from '../../store/locationSlice';
import { fetchFields, selectAllFields } from '../../store/fieldsSlice'; // Імпорт селектора для отримання полів
import { fetchCadastre, selectAllCadastre } from '../../store/cadastreSlice';
import { fetchGeozone, selectAllGeozone } from '../../store/geozoneSlice';


// Імпорт селектора для отримання даних land_squatting
// import { fetchLandSquatting, selectAllLandSquatting } from '../../store/landSquattingSlice'; 

import { selectShowFields, selectShowCadastre, selectShowGeozones } from '../../store/layersList'; // Імпорт селекторів для керування шарами
import { selectMapCenter, selectZoomLevel, setZoomLevel } from '../../store/mapCenterSlice'; // Імпорт селекторів і дій для керування центром карти
import MapCenterUpdater from '../MapCenterUpdater'; // Імпорт компонента для оновлення центру карти
import TrackMarkers from '../TrackMarkers'; // Імпорт нового компонента
import FieldLabel from '../FieldLabel'; // Імпорт нового компонента
import { openAddFieldsModal, setSelectedField } from '../../store/modalSlice'; // Імпорт дій для відкриття модалки та встановлення вибраного поля

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
    const showTrack = useSelector((state) => state.vehicle.showTrack); // Додаємо стан для відображення треку

    const fieldsData = useSelector(selectAllFields);
    const fieldsStatus = useSelector((state) => state.fields.status);
    const fieldsError = useSelector((state) => state.fields.error);

    const cadastreData = useSelector(selectAllCadastre);
    const cadastreStatus = useSelector((state) => state.cadastre.status);
    const cadastreError = useSelector((state) => state.cadastre.error);

    const geozoneData = useSelector(selectAllGeozone);
    const geozoneStatus = useSelector((state) => state.geozone.status);
    const geozoneError = useSelector((state) => state.geozone.error);

    // Отримання даних land_squatting
    // const landSquattingData = useSelector(selectAllLandSquatting); 
    // const landSquattingStatus = useSelector((state) => state.landSquatting.status);
    // const landSquattingError = useSelector((state) => state.landSquatting.error);

    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);

    const mapType = useSelector((state) => state.map.type); // Отримання типу карти з Redux
    const mapCenter = useSelector(selectMapCenter); // Отримання центру карти з Redux
    const zoomLevel = useSelector(selectZoomLevel); // Отримання рівня зуму з Redux

    const [key, setKey] = useState(0); // Додаємо стан для ключа

    // useEffect(() => {
    //     if (gpsStatus === 'idle') {
    //         dispatch(fetchGpsData());
    //     }
    //     if (fieldsStatus === 'idle') {
    //         dispatch(fetchFields());
    //     }
    //     if (cadastreStatus === 'idle') {
    //         dispatch(fetchCadastre());
    //     }
    //     if (geozoneStatus === 'idle') {
    //         dispatch(fetchGeozone());
    //     }
    //     if (landSquattingStatus === 'idle') {
    //         dispatch(fetchLandSquatting());
    //     }
    // }, [dispatch, gpsStatus, fieldsStatus, cadastreStatus, geozoneStatus, landSquattingStatus]);

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
        setKey((prevKey) => prevKey + 1); // Оновлюємо ключ при зміні типу карти
    }, [mapType]);

    // useEffect(() => {
    //     console.log('Land Squatting Data:', landSquattingData); // Логування даних land_squatting
    // }, [landSquattingData]);

    const tileLayerConfig = getTileLayerConfig(mapType);

    const handleEditField = (field) => {
        dispatch(setSelectedField(field));
        dispatch(openAddFieldsModal());
    };

    return (
        <Styles.wrapper>
            <MapContainer
                key={key} // Додаємо ключ для примусового ререндеру
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
                            {/* Відображення основного поля */}
                            <FieldLabel key={index} feature={field} zoomLevel={zoomLevel} type="field" onOpenModal={handleEditField} />
                            
                            {/* Відображення matching_plots (червоні) */}
                            {field.matching_plots && field.matching_plots.map((plot, plotIndex) => (
                                <Polygon
                                    key={`matching-${index}-${plotIndex}`}
                                    positions={plot.geometry.coordinates[0].map(coord => [coord[1], coord[0]])}
                                    color="red"
                                />
                            ))}

                            {/* Відображення not_processed (зелені) */}
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

                <ZoomTracker setZoomLevel={(zoom) => dispatch(setZoomLevel(zoom))} />
                <MapCenterUpdater /> {/* Додаємо компонент для оновлення центру карти */}
            </MapContainer>
        </Styles.wrapper>
    );
}