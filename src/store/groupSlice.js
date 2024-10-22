import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import apiRoutes from '../helpres/ApiRoutes';

// Асинхронний екшен для отримання груп
export const fetchGroups = createAsyncThunk('groups/fetchGroups', async () => {
    const response = await fetch(apiRoutes.getGroups);
    if (!response.ok) {
        throw new Error('Failed to fetch groups');
    }
    const data = await response.json();

    // Перетворення даних відповідно до нової схеми
    return data.map(group => ({
        value: group._id,
        label: group.name,
        ownership: group.ownership,
        description: group.description,
        personnel: group.personnel || [], // У випадку, якщо personnel не визначено
        equipment: group.equipment || []    // У випадку, якщо equipment не визначено
    }));
});

// Створення слайсу
const groupsSlice = createSlice({
    name: 'groups',
    initialState: {
        groups: [],
        status: 'idle',
        error: null,
    },
    reducers: {},
    extraReducers: (builder) => {
        builder
            .addCase(fetchGroups.pending, (state) => {
                state.status = 'loading';
            })
            .addCase(fetchGroups.fulfilled, (state, action) => {
                state.status = 'succeeded';
                state.groups = action.payload; // Зберігаємо отримані групи
            })
            .addCase(fetchGroups.rejected, (state, action) => {
                state.status = 'failed';
                state.error = action.error.message;
            });
    },
});

// Селектор для отримання всіх груп
export const selectAllGroups = (state) => state.groups.groups;

// Експорт редюсера
export default groupsSlice.reducer;
