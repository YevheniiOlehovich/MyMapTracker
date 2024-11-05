// // store/slices/modalSlice.js
// import { createSlice } from '@reduxjs/toolkit';

// const modalSlice = createSlice({
//     name: 'modals',
//     initialState: {
//         isAddGroupModalVisible: false,
//         isAddPersonalModalVisible: false,
//     },
//     reducers: {
//         openAddGroupModal: (state) => {
//             state.isAddGroupModalVisible = true;
//         },
//         closeAddGroupModal: (state) => {
//             state.isAddGroupModalVisible = false;
//         },
//         openAddPersonalModal: (state) => {
//             state.isAddPersonalModalVisible = true;
//         },
//         closeAddPersonalModal: (state) => {
//             state.isAddPersonalModalVisible = false;
//         },
//     },
// });

// export const {
//     openAddGroupModal,
//     closeAddGroupModal,
//     openAddPersonalModal,
//     closeAddPersonalModal,
// } = modalSlice.actions;

// export default modalSlice.reducer;


// modalSlice.js
import { createSlice } from '@reduxjs/toolkit';

const modalSlice = createSlice({
    name: 'modals',
    initialState: {
        isAddGroupModalVisible: false,
        isAddPersonalModalVisible: false, // Додаємо видимість модалки для персоналу
        editGroupId: null, // ID редагованої групи
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
        openAddPersonalModal: (state) => { // Додаємо екшен для відкриття персональної модалки
            state.isAddPersonalModalVisible = true;
        },
        closeAddPersonalModal: (state) => { // Додаємо екшен для закриття персональної модалки
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
