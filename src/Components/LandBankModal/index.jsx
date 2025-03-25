import { StyledWrapper, StyledModal, StyledCloseButton } from './styles';
import closeModal from "../../helpres/closeModal";
import { useDispatch, useSelector } from 'react-redux';
import { selectAllFields } from '../../store/fieldsSlice';

export default function LandBankModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);
    const dispatch = useDispatch();
    const fieldsData = useSelector(selectAllFields);

    // Рахуємо загальну площу та розраховану площу
    const totalArea = fieldsData.reduce((total, field) => total + parseFloat(field.properties.area || 0), 0);
    const totalCalculatedArea = fieldsData.reduce((total, field) => total + parseFloat(field.properties.calculated_area || 0), 0);
    
    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal onClick={(e) => e.stopPropagation()}>
                <StyledCloseButton onClick={onClose} />
                
                <h2>Список полів</h2>
                {fieldsData.length > 0 ? (
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
                {fieldsData.length > 0 && (
                    <div style={{ marginTop: '20px', fontWeight: 'bold' }}>
                        <p><strong>Загальна площа:</strong> {totalArea.toFixed(2)} га</p>
                        <p><strong>Загальна розрахована площа:</strong> {totalCalculatedArea.toFixed(2)} га</p>
                    </div>
                )}
            </StyledModal>
        </StyledWrapper>
    );
}
