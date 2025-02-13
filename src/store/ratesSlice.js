import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний thunk для отримання останніх тарифів
export const fetchRates = createAsyncThunk('rates/fetchRates', async () => {
    const apiUrl = apiRoutes.getRates;
    console.log('Запит до API для отримання тарифів...');
    console.log('Адреса API:', apiUrl); // Логування адреси
    const response = await fetch(apiUrl); // Переконайтесь, що API працює
    if (!response.ok) {
        throw new Error('Не вдалося отримати тарифи');
    }
    const data = await response.json();
    console.log('Отримані тарифи:', data); // Логування отриманих даних
    return data;
});

const ratesSlice = createSlice({
    name: 'rates',
    initialState: {
        data: {}, // Зберігаємо тарифи як об'єкт
        status: 'idle', // 'loading', 'succeeded', 'failed'
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchRates.pending, (state) => {
                console.log('Запит до API у процесі...');
                state.status = 'loading';
            })
            .addCase(fetchRates.fulfilled, (state, action) => {
                console.log('Запит завершено успішно!');
                console.log('Дані тарифів, що зберігаються:', action.payload); // Логування даних
                state.status = 'succeeded';
                state.data = action.payload; // Зберігаємо тарифи в data
            })
            .addCase(fetchRates.rejected, (state, action) => {
                console.log('Запит не вдалося виконати');
                console.log('Помилка:', action.error.message); // Логування помилки
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

export default ratesSlice.reducer;
