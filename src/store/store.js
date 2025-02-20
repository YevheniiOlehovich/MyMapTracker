import { configureStore } from '@reduxjs/toolkit';
import gpsReducer from './locationSlice'; // Імпортуємо редюсер для GPS
import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";
import vehicleReducer from './vehicleSlice'
import ratesReducer from './ratesSlice'

const store = configureStore({
    reducer: {
        gps: gpsReducer, // Додаємо редюсер GPS
        groups: groupsReducer,
        modals: modalReducer,
        calendar: calendarReducer,
        vehicle: vehicleReducer,
        rates: ratesReducer,
    },
});

export default store;
