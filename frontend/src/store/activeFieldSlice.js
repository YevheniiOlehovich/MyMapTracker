import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  activeFieldId: null,
};

const activeFieldSlice = createSlice({
  name: "activeField",
  initialState,
  reducers: {
    setActiveField: (state, action) => {
      state.activeFieldId = action.payload;
    },
    clearActiveField: (state) => {
      state.activeFieldId = null;
    },
  },
});

export const { setActiveField, clearActiveField } = activeFieldSlice.actions;
export default activeFieldSlice.reducer;
