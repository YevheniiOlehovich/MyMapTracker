import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний екшен для отримання даних з колекції land_squatting
export const fetchLandSquatting = createAsyncThunk('landSquatting/fetchLandSquatting', async () => {
    const response = await fetch(apiRoutes.getLandSquatting);
    if (!response.ok) {
        throw new Error('Failed to fetch land squatting data');
    }
    const data = await response.json();
    return data;
});

const landSquattingSlice = createSlice({
    name: 'landSquatting',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchLandSquatting.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchLandSquatting.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchLandSquatting.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання всіх даних з колекції land_squatting
export const selectAllLandSquatting = (state) => state.landSquatting.items;

// Експорт редюсера
export default landSquattingSlice.reducer;