import { configureStore } from '@reduxjs/toolkit';
import gpsReducer from './locationSlice'; // Імпортуємо редюсер для GPS
import groupsReducer from './groupSlice';
import modalReducer from './modalSlice';
import calendarReducer from "./calendarSlice";

const store = configureStore({
    reducer: {
        gps: gpsReducer, // Додаємо редюсер GPS
        groups: groupsReducer,
        modals: modalReducer,
        calendar: calendarReducer,
    },
});

export default store;
