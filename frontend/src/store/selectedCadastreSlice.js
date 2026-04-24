import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  selectedCadastre: null,
};

const selectedCadastreSlice = createSlice({
  name: "selectedCadastre",
  initialState,
  reducers: {
    setSelectedCadastre: (state, action) => {
      state.selectedCadastre = action.payload;
    },

    clearSelectedCadastre: (state) => {
      state.selectedCadastre = null;
    },
  },
});

export const {
  setSelectedCadastre,
  clearSelectedCadastre,
} = selectedCadastreSlice.actions;

export default selectedCadastreSlice.reducer;