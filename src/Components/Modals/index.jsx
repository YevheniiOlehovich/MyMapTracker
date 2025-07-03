import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddFieldsModal from '../AddFieldsModal'; // Імпорт модалки для полів
import AddRatesModal from '../AddRatesModal'; // Імпорт модалки для тарифів
import AddMileagleModal from '../AddMileagleModal'; // Імпорт модалки для пробігу
import LandBankModal from '../LandBankModal'; // Імпорт модалки для земельного банку
import AddGroupModal from '../AddGroupModal';
import AddPersonalModal from '../AddPersonalModal';
import AddVehicleModal from '../AddVehicleModal'; // Імпорт модалки для додавання транспортного засобу
import AddTechniqueModal from '../AddTechniqueModal'; // Імпорт модалки для додавання техніки
import AddOperaionModal from '../AddOperationModal';
import AddCropsModal from '../AddCropsModal'; // Імпорт модалки для додавання культур
import { 
    closeAddRatesModal, 
    closeAddMileagle, 
    closeLandBankReportModal,
    closeAddGroupModal,
    closeAddPersonalModal,
    closeAddVehicleModal,
    closeAddTechniqueModal, 
    closeAddOperationModal,
    closeAddCropModal,
} from '../../store/modalSlice'; // Actions для закриття модалок

const Modals = () => {
    const dispatch = useDispatch();
    const isAddFieldsModalVisible = useSelector((state) => state.modals.isAddFieldsModalVisible); // Видимість модалки для полів
    const selectedField = useSelector((state) => state.modals.selectedField); // Вибране поле
    const isAddRatesModal = useSelector((state) => state.modals.isAddRatesModal); // Видимість модалки для тарифів
    const isAddMileagleModal = useSelector((state) => state.modals.isAddMileagleModal); // Видимість модалки для пробігу
    const isLandBankReportModalVisible = useSelector((state) => state.modals.isLandBankReportModalVisible); // Видимість модалки для земельного банку
    const isAddGroupModalVisible = useSelector((state) => state.modals.isAddGroupModalVisible); // Видимість модалки для груп
    const isAddPersonalModalVisible = useSelector((state) => state.modals.isAddPersonalModalVisible); // Видимість модалки для персоналу 
    const isAddVehicleModalVisible = useSelector((state) => state.modals.isAddVehicleModalVisible); // Видимість модалки для додавання транспортного засобу   
    const isAddTechniqueModalVisible = useSelector((state) => state.modals.isAddTechniqueModalVisible); // Видимість модалки для додавання техніки
    const isAddOperationModalVisible = useSelector((state) => state.modals.isAddOperationModalVisible); // Видимість модалки для операцій
    const isAddCropModalVisible = useSelector((state) => state.modals.isAddCropModalVisible); // Видимість модалки для додавання культур
    return (
        <>
            {isAddFieldsModalVisible && selectedField && (
                <AddFieldsModal field={selectedField} /> // Відображення модалки для полів
            )}
            {isAddRatesModal && (
                <AddRatesModal onClose={() => dispatch(closeAddRatesModal())} /> // Відображення модалки для тарифів
            )}
            {isAddMileagleModal && (
                <AddMileagleModal onClose={() => dispatch(closeAddMileagle())} /> // Відображення модалки для пробігу
            )}
            {isLandBankReportModalVisible && (
                <LandBankModal onClose={() => dispatch(closeLandBankReportModal())} /> // Відображення модалки для земельного банку
            )}
            {isAddGroupModalVisible && (
                <AddGroupModal onClose={() => dispatch(closeAddGroupModal())} /> // Відображення модалки для груп
            )}
            {isAddPersonalModalVisible && (
                <AddPersonalModal onClose={() => dispatch(closeAddPersonalModal())} /> // Відображення модалки для персоналу
            )}
            {isAddVehicleModalVisible && (
                <AddVehicleModal onClose={() => dispatch(closeAddVehicleModal())} /> // Відображення модалки для додавання транспортного засобу
            )}
            {isAddTechniqueModalVisible && (
                <AddTechniqueModal onClose={() => dispatch(closeAddTechniqueModal())} /> // Відображення модалки для додавання техніки
            )}
            {isAddOperationModalVisible && (
                <AddOperaionModal onClose={() => dispatch(closeAddOperationModal())} /> // Відображення модалки для операцій
            )}
            {isAddCropModalVisible && (
                <AddCropsModal onClose={() => dispatch(closeAddCropModal())} />
            )}
        </>
    );
};

export default Modals;