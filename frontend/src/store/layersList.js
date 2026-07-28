import { createSlice } from "@reduxjs/toolkit";

const layersSlice = createSlice({
    name: "layers",

    initialState: {
        showFields: true,
        showCadastre: false,
        showGeozones: false,
        showUnits: true,

        showOwnPlots: false,
        showLadaRentPlots: false,
        showKrokRentPlots: false,
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

        toggleOwnPlots: (state) => {
            state.showOwnPlots = !state.showOwnPlots;
        },

        toggleLadaRentPlots: (state) => {
            state.showLadaRentPlots = !state.showLadaRentPlots;
        },

        toggleKrokRentPlots: (state) => {
            state.showKrokRentPlots = !state.showKrokRentPlots;
        },
    },
});

export const {
    toggleFields,
    toggleCadastre,
    toggleGeozones,
    toggleUnits,
    toggleOwnPlots,
    toggleLadaRentPlots,
    toggleKrokRentPlots,
} = layersSlice.actions;

export const selectShowFields = (state) => state.layers.showFields;
export const selectShowCadastre = (state) => state.layers.showCadastre;
export const selectShowGeozones = (state) => state.layers.showGeozones;
export const selectShowUnits = (state) => state.layers.showUnits;

export const selectShowOwnPlots = (state) =>
    state.layers.showOwnPlots;

export const selectShowLadaRentPlots = (state) =>
    state.layers.showLadaRentPlots;

export const selectShowKrokRentPlots = (state) =>
    state.layers.showKrokRentPlots;

export default layersSlice.reducer;