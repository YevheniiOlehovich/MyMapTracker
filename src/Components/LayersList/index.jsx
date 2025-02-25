import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import arrowPic from '../../assets/ico/arrow.svg';
import { setMapType } from '../../store/mapSlice'; // Імпорт дії для зміни типу карти
import { toggleFields, toggleCadastre, toggleGeozones, selectShowFields, selectShowCadastre, selectShowGeozones } from '../../store/layersList'; // Імпорт дій і селекторів для керування шарами

const LayersList = () => {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const mapType = useSelector((state) => state.map.type); // Отримання поточного типу карти з Redux
    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);

    const toggleListHandler = () => {
        setIsVisible(!isVisible);
    };

    const handleMapTypeChange = (event) => {
        dispatch(setMapType(event.target.value));
    };

    const handleToggleFields = () => {
        dispatch(toggleFields());
    };

    const handleToggleCadastre = () => {
        dispatch(toggleCadastre());
    };

    const handleToggleGeozones = () => {
        dispatch(toggleGeozones());
    };

    return (
        <Styles.wrapper isVisible={isVisible}>
            <Styles.showBtn onClick={toggleListHandler} isVisible={isVisible}>
                <Styles.showBtnImg src={arrowPic} alt="Show Layers" />
            </Styles.showBtn>

            <Styles.Block>
                <Styles.Title>Шари мапи</Styles.Title>
            </Styles.Block>
            
            <Styles.maplist>
                <label>
                    <input
                        type="radio"
                        value="google_roadmap"
                        checked={mapType === 'google_roadmap'}
                        onChange={handleMapTypeChange}
                    />
                    Google Maps
                </label>

                <label>
                    <input
                        type="radio"
                        value="google_satellite"
                        checked={mapType === 'google_satellite'}
                        onChange={handleMapTypeChange}
                    />
                    Google Satelite
                </label>

                <label>
                    <input
                        type="radio"
                        value="google_hybrid"
                        checked={mapType === 'google_hybrid'}
                        onChange={handleMapTypeChange}
                    />
                    Google Hybrid
                </label>

                <label>
                    <input
                        type="radio"
                        value="google_terrain"
                        checked={mapType === 'google_terrain'}
                        onChange={handleMapTypeChange}
                    />
                    Google Hybrid
                </label>

                <label>
                    <input
                        type="radio"
                        value="osm"
                        checked={mapType === 'osm'}
                        onChange={handleMapTypeChange}
                    />
                    OpenStreetMap
                </label>

                <label>
                    <input
                        type="radio"
                        value="osm_hot"
                        checked={mapType === 'osm_hot'}
                        onChange={handleMapTypeChange}
                    />
                    OpenStreetMap HOT
                </label>

                <label>
                    <input
                        type="radio"
                        value="osm_topo"
                        checked={mapType === 'osm_topo'}
                        onChange={handleMapTypeChange}
                    />
                    OpenStreetMap TOPO
                </label>
            </Styles.maplist>
            
            <Styles.Block>
                <Styles.Title>Шари геоданих</Styles.Title>
            </Styles.Block>

            <Styles.maplist>
                <label>
                    <input
                        type="checkbox"
                        checked={showFields}
                        onChange={handleToggleFields}
                    />
                    Поля
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={showCadastre}
                        onChange={handleToggleCadastre}
                    />
                    Кадастр
                </label>

                <label>
                    <input
                        type="checkbox"
                        checked={showGeozones}
                        onChange={handleToggleGeozones}
                    />
                    Геозони
                </label>
            </Styles.maplist>
        </Styles.wrapper>
    );
};

export default LayersList;