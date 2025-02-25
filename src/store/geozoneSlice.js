import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний екшен для отримання даних геозон
export const fetchGeozone = createAsyncThunk('geozone/fetchGeozone', async () => {
    const response = await fetch(apiRoutes.getGeozone);
    if (!response.ok) {
        throw new Error('Failed to fetch geozone data');
    }
    const data = await response.json();
    return data;
});

const geozoneSlice = createSlice({
    name: 'geozone',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGeozone.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGeozone.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchGeozone.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання всіх даних геозон
export const selectAllGeozone = (state) => state.geozone.items;

// Експорт редюсера
export default geozoneSlice.reducer;