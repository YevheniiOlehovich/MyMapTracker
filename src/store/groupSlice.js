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

// Асинхронний екшен для видалення групи
export const deleteGroup = createAsyncThunk('groups/deleteGroup', async (groupId) => {
    const url = apiRoutes.deleteGroup(groupId); // Отримуємо URL
    console.log(`Deleting group with URL: ${url}`); // Логування URL

    const response = await fetch(url, {
        method: 'DELETE',
    });
    if (!response.ok) {
        throw new Error('Failed to delete group');
    }
    return groupId; // Повертаємо groupId, щоб видалити групу з локального стану
});


// Асинхронний екшен для видалення персоналу з групи
export const deletePersonnel = createAsyncThunk('groups/deletePersonnel', async ({ groupId, personnelId }) => {
    const url = apiRoutes.deletePersonnel(groupId, personnelId);
    console.log(`Deleting personnel with groupId: ${groupId}, personnelId: ${personnelId}`, url);

    const response = await fetch(url, {
        method: 'DELETE',
    });

    if (!response.ok) {
        throw new Error('Failed to delete personnel');
    }

    return personnelId; // Повертаємо personnelId для подальшого видалення з локального стану
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
            })
            .addCase(deleteGroup.fulfilled, (state, action) => {
                state.groups = state.groups.filter(group => group._id !== action.payload);
            })
            .addCase(deletePersonnel.fulfilled, (state, action) => {
                const personnelId = action.payload; // Отримуємо personnelId
                const group = state.groups.find(group => group.personnel.some(person => person._id === personnelId)); // Знаходимо групу, де є цей персонал
            
                if (group) {
                    // Виправлений код для фільтрації
                    group.personnel = group.personnel.filter(person => person._id !== personnelId); // Фільтруємо персонал
                }
            });
    },
});

// Селектор для отримання всіх груп
export const selectAllGroups = (state) => state.groups.groups;

// Експорт редюсера
export default groupsSlice.reducer;