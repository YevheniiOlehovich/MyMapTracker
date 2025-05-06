import { configureStore } from '@reduxjs/toolkit';
import gpsReducer from './locationSlice'; // Імпортуємо редюсер для GPS
import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";
import vehicleReducer from './vehicleSlice';
import ratesReducer from './ratesSlice';
// import fieldsReducer from './fieldsSlice'; 
// import cadastreReducer from './cadastreSlice'; 
import mapReducer from './mapSlice'; // Імпортуємо редюсер для карти
import geozoneReducer from './geozoneSlice';
import layersReducer from './layersList';
import mapCenterSliceReducer from './mapCenterSlice';
import currentLocationReducer from './currentLocationSlice';

const store = configureStore({
    reducer: {
        gps: gpsReducer, 
        groups: groupsReducer, 
        modals: modalReducer,
        calendar: calendarReducer,
        vehicle: vehicleReducer,
        rates: ratesReducer,
        // fields: fieldsReducer, 
        // cadastre: cadastreReducer, 
        map: mapReducer, // Додаємо редюсер для карти
        geozone: geozoneReducer,
        layers: layersReducer,
        mapCenter: mapCenterSliceReducer,
        currentLocation: currentLocationReducer,
        // Додаємо редюсер для land_squatting
        // landSquatting: landSquattingReducer, 
    },
});

export default store;
