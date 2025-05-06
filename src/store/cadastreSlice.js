// import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
// import apiRoutes from '../helpres/ApiRoutes';

// // Асинхронний екшен для отримання кадастрових даних
// export const fetchCadastre = createAsyncThunk('cadastre/fetchCadastre', async () => {
//     const response = await fetch(apiRoutes.getCadastre);
//     if (!response.ok) {
//         throw new Error('Failed to fetch cadastre data');
//     }
//     const data = await response.json();
//     return data;
// });

// const cadastreSlice = createSlice({
//     name: 'cadastre',
//     initialState: {
//         items: [],
//         status: 'idle',
//         error: null,
//     },
//     reducers: {},
//     extraReducers: (builder) => {
//         builder
//             .addCase(fetchCadastre.pending, (state) => {
//                 state.status = 'loading';
//             })
//             .addCase(fetchCadastre.fulfilled, (state, action) => {
//                 state.status = 'succeeded';
//                 state.items = action.payload;
//             })
//             .addCase(fetchCadastre.rejected, (state, action) => {
//                 state.status = 'failed';
//                 state.error = action.error.message;
//             });
//     },
// });

// // Селектор для отримання всіх кадастрових даних
// export const selectAllCadastre = (state) => state.cadastre.items;

// // Експорт редюсера
// export default cadastreSlice.reducer;