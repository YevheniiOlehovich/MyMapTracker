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
        _id: group._id,
        name: group.name,
        ownership: group.ownership,
        description: group.description,
        personnel: group.personnel || [], // У випадку, якщо personnel не визначено
        equipment: group.equipment || []    // У випадку, якщо equipment не визначено
    }));
});

// Асинхронний екшен для оновлення групи
export const updateGroup = createAsyncThunk('groups/updateGroup', async ({ groupId, groupData }) => {
    // Використовуємо apiRoutes для формування URL
    const url = apiRoutes.updateGroup(groupId);
    
    // Логування URL для перевірки правильності
    console.log(`Updating group at URL: ${url}`);
    
    const response = await fetch(url, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(groupData),
    });
    
    if (!response.ok) {
        throw new Error('Failed to update group');
    }
    
    return await response.json();
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

// Асинхронний екшен для оновлення персоналу
export const updatePersonnel = createAsyncThunk(
    'groups/updatePersonnel',
    async ({ groupId, personnelId, personnelData, photo }) => {
        const formData = new FormData();

        // Додаємо всі дані персоналу для оновлення
        formData.append('firstName', personnelData.firstName);
        formData.append('lastName', personnelData.lastName);
        formData.append('contactNumber', personnelData.contactNumber);
        formData.append('note', personnelData.note);

        // Якщо є фото, додаємо його до formData
        if (photo) {
            formData.append('photo', photo, 'employee.webp'); // Додаємо фото у форматі WebP
        }

        // Формуємо URL для оновлення персоналу
        const url = apiRoutes.updatePersonnel(groupId, personnelId);

        console.log(`Updating personnel with groupId: ${groupId}, personnelId: ${personnelId}`, url);

        // Відправляємо запит на сервер
        const response = await fetch(url, {
            method: 'PUT',
            body: formData, // Використовуємо formData для відправки
        });

        if (!response.ok) {
            throw new Error('Failed to update personnel');
        }

        return await response.json(); // Повертаємо оновлені дані персоналу
    }
);


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
            .addCase(updateGroup.fulfilled, (state, action) => {
                const updatedGroup = action.payload;
                state.groups = state.groups.map(group => 
                    group._id === updatedGroup._id ? updatedGroup : group
                );
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
            })
            .addCase(updatePersonnel.fulfilled, (state, action) => {
                const updatedPersonnel = action.payload;
                const groupIndex = state.groups.findIndex(group => group._id === updatedPersonnel.groupId); // Знаходимо групу за groupId

                if (groupIndex !== -1) {
                    // Знаходимо персонала в групі та оновлюємо його дані
                    const personnelIndex = state.groups[groupIndex].personnel.findIndex(person => person._id === updatedPersonnel._id);

                    if (personnelIndex !== -1) {
                        state.groups[groupIndex].personnel[personnelIndex] = updatedPersonnel; // Оновлюємо персонала
                    }
                }
            });
    },
});

// Селектор для отримання всіх груп
export const selectAllGroups = (state) => state.groups.groups;

// Експорт редюсера
export default groupsSlice.reducer;
