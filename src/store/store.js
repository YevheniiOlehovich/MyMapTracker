import { configureStore } from '@reduxjs/toolkit';
import groupsReducer from './groupSlice'; // Шлях до вашого слайсу

const store = configureStore({
    reducer: {
        groups: groupsReducer, // Додаємо редюсер груп
        // Інші редюсери, якщо вони є
    },
});

export default store;
