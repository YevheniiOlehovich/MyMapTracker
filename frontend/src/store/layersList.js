import { createSlice } from '@reduxjs/toolkit';

const layersSlice = createSlice({
    name: 'layers',
    initialState: {
        showFields: true,
        showCadastre: false,
        showGeozones: false,
        showUnits: true,
        showRent: false,
        showRent2026: false,
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
        toggleRent2026: (state) => {
            state.showRent2026 = !state.showRent2026;
        },
        toggleProperty: (state) => {  // переключати власність
            state.showProperty = !state.showProperty;
        },
    },
});

export const { toggleFields, toggleCadastre, toggleGeozones, toggleUnits, toggleRent, toggleRent2026, toggleProperty } = layersSlice.actions;

export const selectShowFields = (state) => state.layers.showFields;
export const selectShowCadastre = (state) => state.layers.showCadastre;
export const selectShowGeozones = (state) => state.layers.showGeozones;
export const selectShowUnits = (state) => state.layers.showUnits;
export const selectShowRent = (state) => state.layers.showRent;
export const selectShowRent2026 = (state) => state.layers.showRent2026;
export const selectShowProperty = (state) => state.layers.showProperty;

export default layersSlice.reducer;