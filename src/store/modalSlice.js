// store/slices/modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false,
    },
    reducers: {
        openAddGroupModal: (state) => {
            state.isAddGroupModalVisible = true;
        },
        closeAddGroupModal: (state) => {
            state.isAddGroupModalVisible = false;
        },
        openAddPersonalModal: (state) => {
            state.isAddPersonalModalVisible = true;
        },
        closeAddPersonalModal: (state) => {
            state.isAddPersonalModalVisible = false;
        },
    },
});

export const {
    openAddGroupModal,
    closeAddGroupModal,
    openAddPersonalModal,
    closeAddPersonalModal,
} = modalSlice.actions;

export default modalSlice.reducer;
