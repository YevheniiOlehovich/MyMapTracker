import { createSlice } from '@reduxjs/toolkit';

// Створення slice для календаря
export const calendarSlice = createSlice({
    name: "calendar",
    initialState: {
        selectedDate: new Date().toISOString(), // Початкове значення для вибраної дати
    },
    reducers: {
        setSelectedDate: (state, action) => {
            state.selectedDate = action.payload.toISOString(); // Оновлення вибраної дати
        },
    },
});

// Експортуємо дії для диспетчеризації
export const { setSelectedDate } = calendarSlice.actions; // Використовуємо правильну дію

// Експортуємо редуктор для підключення до store
export default calendarSlice.reducer;
