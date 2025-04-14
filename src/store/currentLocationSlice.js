import { createSlice } from '@reduxjs/toolkit';

const currentLocationSlice = createSlice({
    name: 'currentLocation',
    initialState: {
        coordinates: null, // Поточні координати користувача
        error: null, // Помилки при визначенні місцезнаходження
    },
    reducers: {
        setCurrentLocation: (state, action) => {
            state.coordinates = action.payload;
            state.error = null;
        },
        setLocationError: (state, action) => {
            state.coordinates = null;
            state.error = action.payload;
        },
    },
});

export const { setCurrentLocation, setLocationError } = currentLocationSlice.actions;
export const selectCurrentLocation = (state) => state.currentLocation.coordinates;
export const selectLocationError = (state) => state.currentLocation.error;
export default currentLocationSlice.reducer;