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
    reducers: {
        toggleFieldVisibility: (state, action) => {
            const fieldId = action.payload;
            const field = state.items.find(field => field._id === fieldId);
            if (field) {
                field.visibility = !field.visibility;
            }
        },
        setFieldVisibility: (state, action) => {
            const { fieldId, isVisible } = action.payload;
            const field = state.items.find(field => field._id === fieldId);
            if (field) {
                field.visibility = isVisible;
            }
        }
    },
    extraReducers: (builder) => {
        builder
            .addCase(fetchFields.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchFields.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.items = action.payload.map(field => ({
                    ...field,
                    visibility: true, // Додаємо параметр visibility до кожного поля
                }));
            })
            .addCase(fetchFields.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання всіх полів
export const selectAllFields = (state) => state.fields.items;

// Селектор для отримання видимості поля
export const selectFieldVisibility = (state, fieldId) => {
    const field = state.fields.items.find(field => field._id === fieldId);
    return field ? field.visibility : false;
};

// Експорт дій
export const { toggleFieldVisibility, setFieldVisibility } = fieldsSlice.actions;

// Експорт редюсера
export default fieldsSlice.reducer;