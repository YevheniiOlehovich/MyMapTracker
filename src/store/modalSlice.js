// import { createSlice } from '@reduxjs/toolkit';

// const modalSlice = createSlice({
//     name: 'modals',
//     initialState: {
//         isAddGroupModalVisible: false,
//         isAddPersonalModalVisible: false,
//         isAddVehicleModalVisible: false,
//         isAddRatesModal: false,
//         isAddMileagleModal: false,
//         isAddFieldsModalVisible: false, // Додаємо стан для модалки з полями
//         editGroupId: null,
//         editPersonId: null,
//         editVehicleId: null,
//         editRates: null,
//         editMileagle: null,
//         selectedField: null, // Додаємо стан для вибраного поля
//     },
//     reducers: {
//         openAddGroupModal: (state, action) => {
//             state.isAddGroupModalVisible = true;
//             state.editGroupId = action.payload || null;
//         },
//         closeAddGroupModal: (state) => {
//             state.isAddGroupModalVisible = false;
//             state.editGroupId = null;
//         },
//         openAddPersonalModal: (state, action) => {
//             state.isAddPersonalModalVisible = true;
//             state.editPersonId = action.payload?.personId || null;
//             state.editGroupId = action.payload?.groupId || null;
//         },
//         closeAddPersonalModal: (state) => {
//             state.isAddPersonalModalVisible = false;
//             state.editPersonId = null;
//         },
//         openAddVehicleModal: (state, action) => {
//             state.isAddVehicleModalVisible = true;
//             state.editVehicleId = action.payload?.vehicleId || null;
//             state.editGroupId = action.payload?.groupId || null;
//         },
//         closeAddVehicleModal: (state) => {
//             state.isAddVehicleModalVisible = false;
//             state.editVehicleId = null;
//         },
//         openAddRatesModal: (state, action) => {
//             state.isAddRatesModal = true;
//             state.editRates = action.payload || null;
//         },
//         closeAddRatesModal: (state) => {
//             state.isAddRatesModal = false;
//             state.editRates = null;
//         },
//         openAddMileagle: (state, action) => {
//             state.isAddMileagleModal = true;
//             state.editMileagle = action.payload || null;
//         },
//         closeAddMileagle: (state) => {
//             state.isAddMileagleModal = false;
//             state.editMileagle = null;
//         },
//         openAddFieldsModal: (state) => { // Додаємо редюсер для відкриття модалки з полями
//             state.isAddFieldsModalVisible = true;
//         },
//         closeAddFieldsModal: (state) => { // Додаємо редюсер для закриття модалки з полями
//             state.isAddFieldsModalVisible = false;
//             state.selectedField = null;
//         },
//         setSelectedField: (state, action) => { // Додаємо редюсер для встановлення вибраного поля
//             state.selectedField = action.payload;
//         },
//     },
// });

// export const {
//     openAddGroupModal,
//     closeAddGroupModal,
//     openAddPersonalModal,
//     closeAddPersonalModal,
//     openAddVehicleModal,
//     closeAddVehicleModal,
//     openAddRatesModal,
//     closeAddRatesModal,
//     openAddMileagle,
//     closeAddMileagle,
//     openAddFieldsModal, // Експортуємо дію для відкриття модалки з полями
//     closeAddFieldsModal, // Експортуємо дію для закриття модалки з полями
//     setSelectedField, // Експортуємо дію для встановлення вибраного поля
// } = modalSlice.actions;

// export default modalSlice.reducer;








import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false,
        isAddVehicleModalVisible: false,
        isAddRatesModal: false,
        isAddMileagleModal: false,
        isAddFieldsModalVisible: false, // Додаємо стан для модалки з полями
        isLandBankReportModalVisible: false, // Додаємо стан для модалки звіту земельного банку
        editGroupId: null,
        editPersonId: null,
        editVehicleId: null,
        editRates: null,
        editMileagle: null,
        selectedField: null, // Додаємо стан для вибраного поля
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
} = modalSlice.actions;

export default modalSlice.reducer;