import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false,
        isAddVehicleModalVisible: false,
        isAddRatesModal: false,
        isAddMileagleModal: false,
        editGroupId: null,
        editPersonId: null,
        editVehicleId: null,
        editRates: null,
        editMileagle: null,
    },
    reducers: {
        openAddGroupModal: (state, action) => {
            state.isAddGroupModalVisible = true;
            state.editGroupId = action.payload || null;
        },
        closeAddGroupModal: (state) => {
            state.isAddGroupModalVisible = false;
            state.editGroupId = null;
        },
        openAddPersonalModal: (state, action) => {
            state.isAddPersonalModalVisible = true;
            state.editPersonId = action.payload?.personId || null;
            state.editGroupId = action.payload?.groupId || null;
        },
        closeAddPersonalModal: (state) => {
            state.isAddPersonalModalVisible = false;
            state.editPersonId = null;
        },
        openAddVehicleModal: (state, action) => {
            state.isAddVehicleModalVisible = true;
            state.editVehicleId = action.payload?.vehicleId || null;
            state.editGroupId = action.payload?.groupId || null;
        },
        closeAddVehicleModal: (state) => {
            state.isAddVehicleModalVisible = false;
            state.editVehicleId = null;
        },
        openAddRatesModal: (state, action) => {
            state.isAddRatesModal = true;
            state.editRates = action.payload || null;
        },
        closeAddRatesModal: (state) => {
            state.isAddRatesModal = false;
            state.editRates = null;
        },
        openAddMileagle: (state, action) => {
            state.isAddMileagleModal = true;
            state.editMileagle = action.payload || null;
        },
        closeAddMileagle: (state) => {
            state.isAddMileagleModal = false;
            state.editMileagle = null;
        },
    },
});

export const {
    openAddGroupModal,
    closeAddGroupModal,
    openAddPersonalModal,
    closeAddPersonalModal,
    openAddVehicleModal,
    closeAddVehicleModal,
    openAddRatesModal,
    closeAddRatesModal,
    openAddMileagle,
    closeAddMileagle
} = modalSlice.actions;

export default modalSlice.reducer;
