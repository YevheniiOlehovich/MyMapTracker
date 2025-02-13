import { StyledWrapper, StyledModal, StyledCloseButton, StyledTitle, StyledLabel, StyledSubtitle, StyledInput } from './styled';
import { useState, useEffect } from 'react';
import Button from '../Button';
import apiRoutes from '../../helpres/ApiRoutes';
import closeModal from "../../helpres/closeModal";

export default function AddRatesModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);
    const [carRate, setCarRate] = useState('');
    const [truckRate, setTruckRate] = useState('');
    const [tracktorRate, setTracktorRate] = useState('');
    const [combineRate, setCombineRate] = useState('');

    useEffect(() => {
        const fetchRates = async () => {
            try {
                const response = await fetch(apiRoutes.getRates);
                if (!response.ok) {
                    throw new Error('Не вдалося отримати тарифи');
                }
                const rates = await response.json();
                setCarRate(rates.carRate || '');
                setTruckRate(rates.truckRate || '');
                setTracktorRate(rates.tracktorRate || '');
                setCombineRate(rates.combineRate || '');
            } catch (error) {
                console.error('Помилка при завантаженні тарифів:', error);
            }
        };
        fetchRates();
    }, []);

    const handleSave = async () => {
        const ratesData = { carRate, truckRate, tracktorRate, combineRate };
        console.log('Збереження тарифів:', ratesData);
        try {
            const response = await fetch(apiRoutes.addRates, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(ratesData),
            });
            if (!response.ok) {
                throw new Error('Не вдалося зберегти тарифи');
            }
            console.log('Тарифи збережено:', await response.json());
            onClose();
        } catch (error) {
            console.error('Помилка при збереженні тарифів:', error);
        }
    };
    
    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} /> 
                <StyledTitle>Поточна тарифна сітка</StyledTitle>
                <StyledLabel>
                    <StyledSubtitle>Тариф для легкового автомобілю, грн/км</StyledSubtitle>
                    <StyledInput value={carRate} onChange={(e) => setCarRate(e.target.value)} />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Тариф для вантажівки, грн/км</StyledSubtitle>
                    <StyledInput value={truckRate} onChange={(e) => setTruckRate(e.target.value)} />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Тариф для трактора, грн/км</StyledSubtitle>
                    <StyledInput value={tracktorRate} onChange={(e) => setTracktorRate(e.target.value)} />
                </StyledLabel>
                <StyledLabel>
                    <StyledSubtitle>Тариф для комбайна, грн/км</StyledSubtitle>
                    <StyledInput value={combineRate} onChange={(e) => setCombineRate(e.target.value)} />
                </StyledLabel>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text={'Зберегти'} onClick={handleSave} />
                </div>
            </StyledModal>
        </StyledWrapper>
    );
}
