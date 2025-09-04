// import { configureStore } from '@reduxjs/toolkit';
// // import gpsReducer from './locationSlice'; 
// // import groupsReducer from './groupSlice';
// import modalReducer from './modalSlice';
// import calendarReducer from "./calendarSlice";
// import vehicleReducer from './vehicleSlice';
// // import ratesReducer from './ratesSlice';
// import mapReducer from './mapSlice'; // Імпортуємо редюсер для карти
// import layersReducer from './layersList';
// import mapCenterSliceReducer from './mapCenterSlice';
// import currentLocationReducer from './currentLocationSlice';

// const store = configureStore({
//     reducer: {
//         // gps: gpsReducer, 
//         // groups: groupsReducer, 
//         modals: modalReducer,
//         calendar: calendarReducer,
//         vehicle: vehicleReducer,
//         // rates: ratesReducer,
//         map: mapReducer, // Додаємо редюсер для карти
//         layers: layersReducer,
//         mapCenter: mapCenterSliceReducer,
//         currentLocation: currentLocationReducer,
//     },
// });

// export default store;

import { configureStore } from '@reduxjs/toolkit';
// import gpsReducer from './locationSlice'; 
// import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";
import vehicleReducer from './vehicleSlice';
// import ratesReducer from './ratesSlice';
import mapReducer from './mapSlice'; // Імпортуємо редюсер для карти
import layersReducer from './layersList';
import mapCenterSliceReducer from './mapCenterSlice';
import currentLocationReducer from './currentLocationSlice';
import activeFieldReducer from './activeFieldSlice'; // Імпортуємо новий редюсер

const store = configureStore({
    reducer: {
        // gps: gpsReducer, 
        // groups: groupsReducer, 
        modals: modalReducer,
        calendar: calendarReducer,
        vehicle: vehicleReducer,
        // rates: ratesReducer,
        map: mapReducer, // Додаємо редюсер для карти
        layers: layersReducer,
        mapCenter: mapCenterSliceReducer,
        currentLocation: currentLocationReducer,
        activeField: activeFieldReducer, // Додаємо новий редюсер
    },
});

export default store;
