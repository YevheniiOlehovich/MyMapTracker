import { createSlice } from '@reduxjs/toolkit';

// Створення slice для календаря
export const calendarSlice = createSlice({
    name: "calendar",
    initialState: {
        selectedDate: new Date().toISOString(), // Початкове значення для вибраної дати
    },
    reducers: {
        setSelectedDate: (state, action) => {
            // Перевіряємо, чи є payload об'єктом Date
            const newDate = action.payload instanceof Date ? action.payload : new Date(action.payload);
            state.selectedDate = newDate.toISOString(); // Оновлення вибраної дати
        },
    },
});

// Експортуємо дії для диспетчеризації
export const { setSelectedDate } = calendarSlice.actions; // Використовуємо правильну дію

// Експортуємо редуктор для підключення до store
export default calendarSlice.reducer;

