import { createSlice } from '@reduxjs/toolkit';

const mapSlice = createSlice({
    name: 'map',
    initialState: {
        type: 'google', // Початковий тип карти
    },
    reducers: {
        setMapType: (state, action) => {
            state.type = action.payload;
            console.log('Current map type:', state.type); // Логування поточного типу карти
        },
    },
});

export const { setMapType } = mapSlice.actions;
export default mapSlice.reducer;