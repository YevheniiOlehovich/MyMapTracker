import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from './groupSlice'; // Шлях до вашого слайсу
import modalReducer from './modalSlice';

const store = configureStore({
    reducer: {
        groups: groupsReducer, // Додаємо редюсер груп
        modals: modalReducer,
        // Інші редюсери, якщо вони є
    },
});

export default store;
