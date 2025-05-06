// import styles from './styles';
// import closeModal from "../../helpres/closeModal";
// import { useDispatch, useSelector } from 'react-redux';
// import { selectAllFields } from '../../store/fieldsSlice';

// export default function LandBankModal({ onClose }) {
//     const handleWrapperClick = closeModal(onClose);
//     const dispatch = useDispatch();
//     const fieldsData = useSelector(selectAllFields);

//     // Рахуємо загальну площу та розраховану площу
//     const totalArea = fieldsData.reduce((total, field) => total + parseFloat(field.properties.area || 0), 0);
//     const totalCalculatedArea = fieldsData.reduce((total, field) => total + parseFloat(field.properties.calculated_area || 0), 0);
    
//     return (
//         <styles.Wrapper onClick={handleWrapperClick}>
//             <styles.Modal onClick={(e) => e.stopPropagation()}>
//                 <styles.CloseButton onClick={onClose} />
                
//                 <h2>Список полів</h2>
//                 {fieldsData.length > 0 ? (
//                     fieldsData.map((field, index) => (
//                         <div key={index}>
//                             <p><strong>Назва:</strong> {field.properties.name}</p>
//                             <p><strong>Площа:</strong> {field.properties.area} га</p>
//                             <p><strong>Розрахована площа:</strong> {field.properties.calculated_area} га</p>
//                             <hr />
//                         </div>
//                     ))
//                 ) : (
//                     <p>Немає даних</p>
//                 )}
                
//                 {/* Підсумкові площі */}
//                 {fieldsData.length > 0 && (
//                     <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
//                         <p><strong>Загальна площа:</strong> {totalArea.toFixed(2)} га</p>
//                         <p><strong>Загальна розрахована площа:</strong> {totalCalculatedArea.toFixed(2)} га</p>
//                     </div>
//                 )}
//             </styles.Modal>
//         </styles.Wrapper>
//     );
// }





import styles from './styles';
import closeModal from "../../helpres/closeModal";
import { useFieldsData } from '../../hooks/useFieldsData'; // Використовуємо React Query

export default function LandBankModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    // Отримуємо дані полів через React Query
    const { data: fieldsData, isLoading, error } = useFieldsData();

    // Рахуємо загальну площу та розраховану площу
    const totalArea = fieldsData?.reduce((total, field) => total + parseFloat(field.properties.area || 0), 0) || 0;
    const totalCalculatedArea = fieldsData?.reduce((total, field) => total + parseFloat(field.properties.calculated_area || 0), 0) || 0;

    if (isLoading) return <p>Завантаження даних...</p>;
    if (error) return <p>Помилка завантаження даних: {error.message}</p>;

    return (
        <styles.Wrapper onClick={handleWrapperClick}>
            <styles.Modal onClick={(e) => e.stopPropagation()}>
                <styles.CloseButton onClick={onClose} />
                
                <h2>Список полів</h2>
                {fieldsData?.length > 0 ? (
                    fieldsData.map((field, index) => (
                        <div key={index}>
                            <p><strong>Назва:</strong> {field.properties.name}</p>
                            <p><strong>Площа:</strong> {field.properties.area} га</p>
                            <p><strong>Розрахована площа:</strong> {field.properties.calculated_area} га</p>
                            <hr />
                        </div>
                    ))
                ) : (
                    <p>Немає даних</p>
                )}
                
                {/* Підсумкові площі */}
                {fieldsData?.length > 0 && (
                    <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                        <p><strong>Загальна площа:</strong> {totalArea.toFixed(2)} га</p>
                        <p><strong>Загальна розрахована площа:</strong> {totalCalculatedArea.toFixed(2)} га</p>
                    </div>
                )}
            </styles.Modal>
        </styles.Wrapper>
    );
}