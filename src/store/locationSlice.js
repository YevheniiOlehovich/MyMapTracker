// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiRoutes from '../helpres/ApiRoutes';

// // Асинхронний thunk для отримання даних GPS
// export const fetchGpsData = createAsyncThunk('gps_data/fetchData', async () => {
//     const response = await fetch(apiRoutes.getLocation); // Переконайтесь, що API працює
//     if (!response.ok) {
//         throw new Error('Не вдалося отримати дані GPS');
//     }
//     const data = await response.json();
//     return data;
// });


// const gpsSlice = createSlice({
//     name: 'gps',
//     initialState: {
//         data: [],
//         status: 'idle', // 'loading', 'succeeded', 'failed'
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchGpsData.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchGpsData.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.data = action.payload;
//             })
//             .addCase(fetchGpsData.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             });
//     },
// });

// export default gpsSlice.reducer;
