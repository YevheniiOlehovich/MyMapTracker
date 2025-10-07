import { createSlice } from '@reduxjs/toolkit';

const initialState = {
  role: null,
  isLoggedIn: false,
};

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser: (state, action) => {
      state.role = action.payload.role;
      state.isLoggedIn = true;
    },
    logout: (state) => {
      state.role = null;
      state.isLoggedIn = false;
    },
  },
});

export const { setUser, logout } = userSlice.actions;
export default userSlice.reducer;
