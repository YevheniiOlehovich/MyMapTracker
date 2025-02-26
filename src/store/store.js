import { configureStore } from '@reduxjs/toolkit';
import gpsReducer from './locationSlice'; // Імпортуємо редюсер для GPS
import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";
import vehicleReducer from './vehicleSlice';
import ratesReducer from './ratesSlice';
import fieldsReducer from './fieldsSlice'; // Імпортуємо редюсер для полів
import cadastreReducer from './cadastreSlice'; // Імпортуємо редюсер для кадастрових даних
import mapReducer from './mapSlice'; // Імпортуємо редюсер для карти
import geozoneReducer from './geozoneSlice';
import layersReducer from './layersList'
import mapCenterSliceReducer from './mapCenterSlice'

const store = configureStore({
    reducer: {
        gps: gpsReducer, 
        groups: groupsReducer, 
        modals: modalReducer,
        calendar: calendarReducer,
        vehicle: vehicleReducer,
        rates: ratesReducer,
        fields: fieldsReducer, // Додаємо редюсер для полів
        cadastre: cadastreReducer, // Додаємо редюсер для кадастрових даних
        map: mapReducer, // Додаємо редюсер для карти
        geozone: geozoneReducer,
        layers: layersReducer,
        mapCenter: mapCenterSliceReducer,
    },
});

export default store;
