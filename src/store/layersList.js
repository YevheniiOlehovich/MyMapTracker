import { createSlice } from '@reduxjs/toolkit';

const layersSlice = createSlice({
    name: 'layers',
    initialState: {
        showFields: true,
        showCadastre: false,
        showGeozones: true,
    },
    reducers: {
        toggleFields: (state) => {
            state.showFields = !state.showFields;
        },
        toggleCadastre: (state) => {
            state.showCadastre = !state.showCadastre;
        },
        toggleGeozones: (state) => {
            state.showGeozones = !state.showGeozones;
        },
    },
});

export const { toggleFields, toggleCadastre, toggleGeozones } = layersSlice.actions;

export const selectShowFields = (state) => state.layers.showFields;
export const selectShowCadastre = (state) => state.layers.showCadastre;
export const selectShowGeozones = (state) => state.layers.showGeozones;

export default layersSlice.reducer;