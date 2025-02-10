import { configureStore } from '@reduxjs/toolkit';
import gpsReducer from './locationSlice'; // Імпортуємо редюсер для GPS
import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";
import vehicleReducer from './vehicleSlice'

const store = configureStore({
    reducer: {
        gps: gpsReducer, // Додаємо редюсер GPS
        groups: groupsReducer,
        modals: modalReducer,
        calendar: calendarReducer,
        vehicle: vehicleReducer,
    },
});

export default store;
