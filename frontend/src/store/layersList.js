import { createSlice } from '@reduxjs/toolkit';

const layersSlice = createSlice({
    name: 'layers',
    initialState: {
        showFields: true,
        showCadastre: false,
        showGeozones: false,
        showUnits: true,
        showRent: false,
        showProperty: false,
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
        toggleUnits: (state) => {
            state.showUnits = !state.showUnits;
        },
        toggleRent: (state) => {
            state.showRent = !state.showRent;
        },
        toggleProperty: (state) => {  // переключати власність
            state.showProperty = !state.showProperty;
        },
    },
});

export const { toggleFields, toggleCadastre, toggleGeozones, toggleUnits, toggleRent, toggleProperty } = layersSlice.actions;

export const selectShowFields = (state) => state.layers.showFields;
export const selectShowCadastre = (state) => state.layers.showCadastre;
export const selectShowGeozones = (state) => state.layers.showGeozones;
export const selectShowUnits = (state) => state.layers.showUnits;
export const selectShowRent = (state) => state.layers.showRent;
export const selectShowProperty = (state) => state.layers.showProperty;

export default layersSlice.reducer;