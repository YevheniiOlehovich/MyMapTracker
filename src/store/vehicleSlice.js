import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    imei: null,
    showTrack: false, // Додаємо стан для відображення треку
};

const vehicleSlice = createSlice({
    name: 'vehicle',
    initialState,
    reducers: {
        setImei: (state, action) => {
            state.imei = action.payload;
        },
        toggleShowTrack: (state) => {
            state.showTrack = !state.showTrack; // Перемикаємо стан відображення треку
        },
    },
});

export const { setImei, toggleShowTrack } = vehicleSlice.actions;

export default vehicleSlice.reducer;