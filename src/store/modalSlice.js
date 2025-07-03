import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false,
        isAddVehicleModalVisible: false,
        isAddTechniqueModalVisible: false,
        isAddRatesModal: false,
        isAddMileagleModal: false,
        isAddFieldsModalVisible: false, // Додаємо стан для модалки з полями
        isLandBankReportModalVisible: false, // Додаємо стан для модалки звіту земельного банку
        isAddOperationModalVisible: false,
        isAddCropModalVisible: false,
        isAddVarietyModalVisible: false,

        editTechniqueId: null,
        editGroupId: null,
        editPersonId: null,
        editVehicleId: null,
        editRates: null,
        editMileagle: null,
        selectedField: null, // Додаємо стан для вибраного поля
        editOperationId: null,
        editCropId: null,
        editVarietyId: null,
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
        openAddTechniqueModal: (state, action) => {
            state.isAddTechniqueModalVisible = true;
            state.editTechniqueId = action.payload?.techniqueId || null;
            state.editGroupId = action.payload?.groupId || null;
        },
        closeAddTechniqueModal: (state) => {
            state.isAddTechniqueModalVisible  = false;
            state.editTechniqueId = null;
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
        openAddFieldsModal: (state) => {
            state.isAddFieldsModalVisible = true;
        },
        closeAddFieldsModal: (state) => {
            state.isAddFieldsModalVisible = false;
            state.selectedField = null;
        },
        setSelectedField: (state, action) => {
            state.selectedField = action.payload;
        },
        // Додаємо редюсери для модалки звіту земельного банку
        openLandBankReportModal: (state) => {
            state.isLandBankReportModalVisible = true;
        },
        closeLandBankReportModal: (state) => {
            state.isLandBankReportModalVisible = false;
        },
        openAddOperationModal: (state, action) => {
            state.isAddOperationModalVisible = true;
            state.editOperationId = action.payload || null;
        },
        closeAddOperationModal: (state) => {
            state.isAddOperationModalVisible = false;
            state.editOperationId = null;
        },
        openAddCropModal: (state, action) => {
            state.isAddCropModalVisible = true;
            state.editCropId = action.payload || null;
        },
        closeAddCropModal: (state) => {
            state.isAddCropModalVisible = false;
            state.editCropId = null;
        },
        openAddVarietyModal: (state, action) => {
            state.isAddVarietyModalVisible = true;
            state.editVarietyId = action.payload || null;
        },
        closeAddVarietyModal: (state) => {
            state.isAddVarietyModalVisible = false;
            state.editVarietyId = null;
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
    closeAddMileagle,
    openAddFieldsModal,
    closeAddFieldsModal,
    setSelectedField,
    openLandBankReportModal, // Експортуємо дію для відкриття модалки звіту земельного банку
    closeLandBankReportModal, // Експортуємо дію для закриття модалки звіту земельного банку
    openAddTechniqueModal,
    closeAddTechniqueModal,
    openAddOperationModal,
    closeAddOperationModal,
    openAddCropModal,
    closeAddCropModal,
    openAddVarietyModal,
    closeAddVarietyModal,

} = modalSlice.actions;

export default modalSlice.reducer;