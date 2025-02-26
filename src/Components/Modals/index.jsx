import React from 'react';
import { useSelector } from 'react-redux';
import AddFieldsModal from '../AddFieldsModal'; // Імпорт модалки для полів

const Modals = () => {
    const isAddFieldsModalVisible = useSelector((state) => state.modals.isAddFieldsModalVisible); // Отримання стану видимості модалки
    const selectedField = useSelector((state) => state.modals.selectedField); // Отримання вибраного поля з Redux

    return (
        <>
            {isAddFieldsModalVisible && selectedField && (
                <AddFieldsModal field={selectedField} /> // Відображення модалки при відкритті
            )}
        </>
    );
};

export default Modals;