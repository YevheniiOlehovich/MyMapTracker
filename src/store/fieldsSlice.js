import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний екшен для отримання даних полів
export const fetchFields = createAsyncThunk('fields/fetchFields', async () => {
    const response = await fetch(apiRoutes.getFields);
    if (!response.ok) {
        throw new Error('Failed to fetch fields');
    }
    const data = await response.json();
    return data;
});

const fieldsSlice = createSlice({
    name: 'fields',
    initialState: {
        items: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchFields.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFields.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload;
            })
            .addCase(fetchFields.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання всіх полів
export const selectAllFields = (state) => state.fields.items;

// Експорт редюсера
export default fieldsSlice.reducer;