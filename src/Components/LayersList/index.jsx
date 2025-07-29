import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import arrowPic from '../../assets/ico/arrow.svg';
import { setMapType } from '../../store/mapSlice'; // Імпорт дії для зміни типу карти
import { toggleFields, toggleCadastre, toggleGeozones, toggleUnits, toggleRent, toggleProperty, selectShowFields, selectShowCadastre, selectShowGeozones, selectShowUnits, selectShowRent, selectShowProperty } from '../../store/layersList'; // Імпорт дій і селекторів для керування шарами
import FieldsList from '../FieldsList';
import TriangleIco from '../../assets/ico/triangle.png';
import DatePickerComponent from '../DatePicker';

const LayersList = () => {
    const [isVisible, setIsVisible] = useState(false);
    const [isMapListVisible, setIsMapListVisible] = useState(false); // Додаємо стан для видимості першого списку шарів мапи
    const [isGeoDataListVisible, setIsGeoDataListVisible] = useState(false); // Додаємо стан для видимості другого списку шарів геоданих
    const dispatch = useDispatch();
    const mapType = useSelector((state) => state.map.type); // Отримання поточного типу карти з Redux
    const showFields = useSelector(selectShowFields);
    const showCadastre = useSelector(selectShowCadastre);
    const showGeozones = useSelector(selectShowGeozones);
    const showUnits = useSelector(selectShowUnits); // Отримання стану видимості юнітів
    const showRent = useSelector(selectShowRent); // Отримання стану видимості оренди
    const showProperty = useSelector(selectShowProperty); // Отримання стану видимості власності
    
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

    const handleToggleUnits = () => {
        dispatch(toggleUnits()); 
    };   

    const handleToggleRent = () => {
        dispatch(toggleRent());
    };

    const handleToggleProperty = () => {
        dispatch(toggleProperty());     
    };

    const toggleMapListVisibility = () => {
        setIsMapListVisible(!isMapListVisible);
    };

    const toggleGeoDataListVisibility = () => {
        setIsGeoDataListVisible(!isGeoDataListVisible);
    };

    return (
        <Styles.wrapper $isVisible={isVisible}>
            <Styles.showBtn onClick={toggleListHandler} $isVisible={isVisible}>
                <Styles.showBtnImg src={arrowPic} alt="Show Layers" />
            </Styles.showBtn>

            <Styles.Block>
                <Styles.Title>Шари мапи</Styles.Title>

                <Styles.btn onClick={toggleMapListVisibility}>
                    <Styles.btnIco
                        $pic={TriangleIco}
                        $rotation={isMapListVisible ? 180 : 0} // Перевертаємо трикутник
                    />
                </Styles.btn>
            </Styles.Block>
            
            {isMapListVisible && (
                <Styles.maplist>
                    <Styles.label>
                        <input
                            type="radio"
                            value="google_roadmap"
                            checked={mapType === 'google_roadmap'}
                            onChange={handleMapTypeChange}
                        />
                        Google Maps
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="google_satellite"
                            checked={mapType === 'google_satellite'}
                            onChange={handleMapTypeChange}
                        />
                        Google Satelite
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="google_hybrid"
                            checked={mapType === 'google_hybrid'}
                            onChange={handleMapTypeChange}
                        />
                        Google Hybrid
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="google_terrain"
                            checked={mapType === 'google_terrain'}
                            onChange={handleMapTypeChange}
                        />
                        Google Terrain
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="osm"
                            checked={mapType === 'osm'}
                            onChange={handleMapTypeChange}
                        />
                        OpenStreetMap
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="osm_hot"
                            checked={mapType === 'osm_hot'}
                            onChange={handleMapTypeChange}
                        />
                        OpenStreetMap HOT
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="radio"
                            value="osm_topo"
                            checked={mapType === 'osm_topo'}
                            onChange={handleMapTypeChange}
                        />
                        OpenStreetMap TOPO
                    </Styles.label>
                </Styles.maplist>
            )}
            
            <Styles.Block>
                <Styles.Title>Шари геоданих</Styles.Title>

                <Styles.btn onClick={toggleGeoDataListVisibility}>
                    <Styles.btnIco
                        $pic={TriangleIco}
                        $rotation={isGeoDataListVisible ? 180 : 0} // Перевертаємо трикутник
                    />
                </Styles.btn>
            </Styles.Block>

            {isGeoDataListVisible && (
                <Styles.maplist>
                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showFields}
                            onChange={handleToggleFields}
                        />
                        Поля
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showCadastre}
                            onChange={handleToggleCadastre}
                        />
                        Кадастр
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showGeozones}
                            onChange={handleToggleGeozones}
                        />
                        Геозони
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showUnits}
                            onChange={handleToggleUnits}
                        />
                        Господарчі ділянки
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showRent}
                            onChange={handleToggleRent}
                        />
                        Орендоані ділянки
                    </Styles.label>

                    <Styles.label>
                        <input
                            type="checkbox"
                            checked={showProperty}
                            onChange={handleToggleProperty}
                        />
                        Ділянки у власності
                    </Styles.label>
                </Styles.maplist>
            )}
            <FieldsList />
            <DatePickerComponent />
        </Styles.wrapper>
    );
};

export default LayersList;