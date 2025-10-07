import { createSlice } from '@reduxjs/toolkit';

const mapCenterSlice = createSlice({
    name: 'mapCenter',
    initialState: {
        center: [50.603611, 32.105556], // Початковий центр карти
        zoom: 13, // Початковий рівень зуму
    },
    reducers: {
        setMapCenter: (state, action) => {
            state.center = action.payload;
        },
        setZoomLevel: (state, action) => {
            state.zoom = action.payload;
        },
    },
});

export const { setMapCenter, setZoomLevel } = mapCenterSlice.actions;

export const selectMapCenter = (state) => state.mapCenter.center;
export const selectZoomLevel = (state) => state.mapCenter.zoom;

export default mapCenterSlice.reducer;