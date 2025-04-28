import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import AddFieldsModal from '../AddFieldsModal'; // Імпорт модалки для полів
import AddRatesModal from '../AddRatesModal'; // Імпорт модалки для тарифів
import AddMileagleModal from '../AddMileagleModal'; // Імпорт модалки для пробігу
import LandBankModal from '../LandBankModal'; // Імпорт модалки для земельного банку
import { 
    closeAddRatesModal, 
    closeAddMileagle, 
    closeLandBankReportModal 
} from '../../store/modalSlice'; // Actions для закриття модалок

const Modals = () => {
    const dispatch = useDispatch();
    const isAddFieldsModalVisible = useSelector((state) => state.modals.isAddFieldsModalVisible); // Видимість модалки для полів
    const selectedField = useSelector((state) => state.modals.selectedField); // Вибране поле
    const isAddRatesModal = useSelector((state) => state.modals.isAddRatesModal); // Видимість модалки для тарифів
    const isAddMileagleModal = useSelector((state) => state.modals.isAddMileagleModal); // Видимість модалки для пробігу
    const isLandBankReportModalVisible = useSelector((state) => state.modals.isLandBankReportModalVisible); // Видимість модалки для земельного банку

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
        </>
    );
};

export default Modals;