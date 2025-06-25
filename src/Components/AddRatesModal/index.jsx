import Styles from './styled';
import { useState, useEffect } from 'react';
import Button from '../Button';
import closeModal from '../../helpres/closeModal';
import { useRatesData, useAddRates } from '../../hooks/useRatesData';

export default function AddRatesModal({ onClose }) {
    const handleWrapperClick = closeModal(onClose);

    const { data: rates, isLoading, isError } = useRatesData();
    const addRatesMutation = useAddRates();

    const [carRate, setCarRate] = useState('');
    const [truckRate, setTruckRate] = useState('');
    const [tracktorRate, setTracktorRate] = useState('');
    const [combineRate, setCombineRate] = useState('');

    // Заповнюємо стейт після завантаження тарифів
    useEffect(() => {
        if (rates) {
            setCarRate(rates.carRate ?? '');
            setTruckRate(rates.truckRate ?? '');
            setTracktorRate(rates.tracktorRate ?? '');
            setCombineRate(rates.combineRate ?? '');
        }
    }, [rates]);

    const handleSave = () => {
        const ratesData = {
            carRate: Number(carRate),
            truckRate: Number(truckRate),
            tracktorRate: Number(tracktorRate),
            combineRate: Number(combineRate),
        };

        addRatesMutation.mutate(ratesData, {
            onSuccess: () => {
                onClose();
            },
            onError: (error) => {
                console.error('Помилка при збереженні тарифів:', error);
            },
        });
    };

    if (isLoading) return <p>Завантаження тарифів...</p>;
    if (isError) return <p>Помилка при завантаженні тарифів</p>;

    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />
                <Styles.Title>Поточна тарифна сітка</Styles.Title>
                <Styles.Label>
                    <Styles.Subtitle>Тариф для легкового автомобілю, грн/км</Styles.Subtitle>
                    <Styles.Input
                        type="number"
                        value={carRate}
                        onChange={(e) => setCarRate(e.target.value)}
                    />
                </Styles.Label>
                <Styles.Label>
                    <Styles.Subtitle>Тариф для вантажівки, грн/км</Styles.Subtitle>
                    <Styles.Input
                        type="number"
                        value={truckRate}
                        onChange={(e) => setTruckRate(e.target.value)}
                    />
                </Styles.Label>
                <Styles.Label>
                    <Styles.Subtitle>Тариф для трактора, грн/км</Styles.Subtitle>
                    <Styles.Input
                        type="number"
                        value={tracktorRate}
                        onChange={(e) => setTracktorRate(e.target.value)}
                    />
                </Styles.Label>
                <Styles.Label>
                    <Styles.Subtitle>Тариф для комбайна, грн/км</Styles.Subtitle>
                    <Styles.Input
                        type="number"
                        value={combineRate}
                        onChange={(e) => setCombineRate(e.target.value)}
                    />
                </Styles.Label>
                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: 10 }}>
                    <Button
                        text="Зберегти"
                        onClick={handleSave}
                        disabled={addRatesMutation.isLoading}
                    />
                </div>
            </Styles.Modal>
        </Styles.Wrapper>
    );
}