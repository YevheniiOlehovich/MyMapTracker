import { createSlice } from '@reduxjs/toolkit';

const vehicleSlice = createSlice({
    name: 'map',
    initialState: {
        imei: null, // Відстежуваний IMEI
    },
    reducers: {
        setImei: (state, action) => {
            state.imei = action.payload;
        },
    },
});

export const { setImei } = vehicleSlice.actions;
export default vehicleSlice.reducer;
