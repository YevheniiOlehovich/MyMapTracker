// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false, // Додаємо видимість модалки для персоналу
        isAddVehicleModalVisible: false,
        editGroupId: null, // ID редагованої 
        editPersonId: null, // ID редагованого персоналу
        editVehicleId: null
    },
    reducers: {
        openAddGroupModal: (state, action) => {
            state.isAddGroupModalVisible = true;
            state.editGroupId = action.payload || null; // Встановлюємо ID групи, якщо передано
        },
        closeAddGroupModal: (state) => {
            state.isAddGroupModalVisible = false;
            state.editGroupId = null;
        },
        openAddPersonalModal: (state, action) => {
            state.isAddPersonalModalVisible = true;
            state.editPersonId = action.payload?.personId || null;  // Тільки персонал
            state.editGroupId = action.payload?.groupId || null;  // Додаємо групу
        },
        closeAddPersonalModal: (state) => {
            state.isAddPersonalModalVisible = false;
            state.editPersonId = null; // При закритті модалки, скидаємо тільки ID персоналу
        },
        openAddVehicleModal: (state, action) => {
            state.isAddVehicleModalVisible = true;
            state.editVehicleId = action.payload?.vehicleId || null;  // Тільки персонал
            state.editGroupId = action.payload?.groupId || null;  // Додаємо групу
        },
        closeAddVehicleModal: (state) => {
            state.isAddVehicleModalVisible = false;
            state.editVehicleId = null;
        }
    },
});

export const {
    openAddGroupModal,
    closeAddGroupModal,
    openAddPersonalModal,
    closeAddPersonalModal,
    openAddVehicleModal,
    closeAddVehicleModal
} = modalSlice.actions;

export default modalSlice.reducer;

