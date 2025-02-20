import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний thunk для отримання останніх тарифів
export const fetchRates = createAsyncThunk('rates/fetchRates', async () => {
    const apiUrl = apiRoutes.getRates;
    const response = await fetch(apiUrl); // Переконайтесь, що API працює
    if (!response.ok) {
        throw new Error('Не вдалося отримати тарифи');
    }
    const data = await response.json();
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
                state.status = 'loading';
            })
            .addCase(fetchRates.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.data = action.payload; // Зберігаємо тарифи в data
            })
            .addCase(fetchRates.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання тарифів
export const selectRates = (state) => state.rates.data;

export default ratesSlice.reducer;