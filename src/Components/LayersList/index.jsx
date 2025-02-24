import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Styles from './styles';
import arrowPic from '../../assets/ico/arrow.svg';
import { setMapType } from '../../store/mapSlice'; // Імпорт дії для зміни типу карти

const LayersList = () => {
    const [isVisible, setIsVisible] = useState(false);
    const dispatch = useDispatch();
    const mapType = useSelector((state) => state.map.type); // Отримання поточного типу карти з Redux

    const toggleListHandler = () => {
        setIsVisible(!isVisible);
    };

    const handleMapTypeChange = (event) => {
        dispatch(setMapType(event.target.value));
    };

    return (
        <Styles.wrapper isVisible={isVisible}>
            <Styles.Title>Шари мапи</Styles.Title>
            <Styles.showBtn onClick={toggleListHandler}>
                <Styles.showBtnImg src={arrowPic} alt="Show Layers" />
            </Styles.showBtn>
            <div>
                <label>
                    <input
                        type="radio"
                        value="google"
                        checked={mapType === 'google'}
                        onChange={handleMapTypeChange}
                    />
                    Google Maps
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
            </div>
        </Styles.wrapper>
    );
};

export default LayersList;