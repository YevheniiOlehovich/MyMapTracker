import { useDispatch, useSelector } from 'react-redux';
import Styles from './styled';
import Button from '../Button';
import closeModal from "../../helpres/closeModal";
import { months, vehicleTypes } from '../../helpres';
import Select from 'react-select';
import { useEffect, useState } from 'react';
import { fetchGroups, selectAllGroups } from '../../store/groupSlice';
import { fetchGpsData } from '../../store/locationSlice';
import { haversineDistance } from '../../helpres/distance';
import { fetchRates, selectRates } from '../../store/ratesSlice';

export default function AddMileagleModal({ onClose }) {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups);
    const gpsData = useSelector((state) => state.gps.data);
    const rates = useSelector(selectRates);
    const handleWrapperClick = closeModal(onClose);

    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedGpsData, setSelectedGpsData] = useState([]);

    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchGpsData());
        dispatch(fetchRates());
    }, [dispatch]);

    useEffect(() => {
        if (groups.length > 0) {
            const allVehicles = groups.flatMap(group =>
                group.vehicles.map(vehicle => ({
                    value: vehicle.regNumber,
                    label: `${vehicle.mark} (${vehicle.regNumber})`,
                    imei: vehicle.imei,
                    type: vehicle.vehicleType,
                }))
            );
            setVehicles(allVehicles);
        }
    }, [groups]);

    const filterGpsData = (month, vehicle) => {
        const selectedMonthValue = month.value;

        const filteredData = gpsData.filter(data => {
            const gpsDate = new Date(data.date);
            return (
                data.imei === vehicle.imei &&
                gpsDate.getMonth() + 1 === selectedMonthValue
            );
        }).map(data => ({
            ...data,
            data: data.data.filter(coord => coord.latitude !== 0 && coord.longitude !== 0) // Фільтруємо координати
        }));

        setSelectedGpsData(filteredData);
    };

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);

        if (selectedVehicle) {
            filterGpsData(selectedOption, selectedVehicle);
        }
    };

    const handleVehicleChange = (selectedOption) => {
        setSelectedVehicle(selectedOption);

        if (selectedMonth) {
            filterGpsData(selectedMonth, selectedOption);
        }
    };

    const handleCalculate = () => {
        if (!selectedMonth || !selectedVehicle || selectedGpsData.length === 0) {
            alert("Оберіть місяць та техніку!");
            return;
        }
    
        let totalDistance = 0;
        const dailyDistances = {}; // Об'єкт для збереження пробігу по днях
    
        selectedGpsData.forEach((data) => {
            if (!data.data || !Array.isArray(data.data)) {
                console.error(`Помилка у data.data:`, data);
                return;
            }
    
            const gpsDate = new Date(data.date).toISOString().split('T')[0]; // Отримуємо лише дату (РРРР-ММ-ДД)
            dailyDistances[gpsDate] = 0; // Ініціалізуємо запис для дня
    
            const coordinates = data.data.map(coord => [coord.latitude, coord.longitude]);
    
            for (let i = 1; i < coordinates.length; i++) {
                const [lat1, lon1] = coordinates[i - 1];
                const [lat2, lon2] = coordinates[i];
    
                if (lat1 == null || lon1 == null || lat2 == null || lon2 == null) {
                    console.error(`Некоректні координати:`, coordinates[i - 1], coordinates[i]);
                    continue;
                }
    
                const distance = haversineDistance(lat1, lon1, lat2, lon2);
                totalDistance += distance;
                dailyDistances[gpsDate] += distance;
            }
        });
    
        // Розрахунок вартості пробігу
        const vehicleType = vehicleTypes.find(type => type._id === selectedVehicle.type);
        if (!vehicleType) {
            console.error('Тип транспортного засобу не знайдено:', selectedVehicle.type);
            alert("Невідомий тип транспортного засобу!");
            return;
        }
    
        let rate = 0;
        switch (vehicleType._id) {
            case 'car':
                rate = rates.carRate;
                break;
            case 'vintage_car':
                rate = rates.vintageCarRate;
                break;
            case 'tractor':
                rate = rates.tractorRate;
                break;
            case 'combine':
                rate = rates.combineRate;
                break;
            case 'truck':
                rate = rates.truckRate;
                break;
            default:
                console.error('Невідомий тип транспортного засобу:', vehicleType._id);
                alert("Невідомий тип транспортного засобу!");
                return;
        }
    
        const totalCost = (totalDistance * rate).toFixed(2);
    
        setTotalDistance(totalDistance);
        setTotalCost(totalCost);
    };

    return (
        <Styles.Wrapper onClick={handleWrapperClick}>
            <Styles.Modal>
                <Styles.CloseButton onClick={onClose} />

                <div style={{ width: '300px', margin: '0 auto' }}>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={months.map((month) => ({
                            value: parseInt(month._id, 10),
                            label: month.name_ua,
                        }))}
                        placeholder="Оберіть місяць"
                    />
                </div>

                <div style={{ width: '300px', margin: '10px auto' }}>
                    <Select
                        value={selectedVehicle}
                        onChange={handleVehicleChange}
                        options={vehicles}
                        placeholder="Оберіть техніку"
                        isLoading={groups.length === 0}
                    />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
                    <Button text="Розрахувати" onClick={handleCalculate} />
                </div>

                {totalDistance > 0 && (
                    <Styles.Text>
                        Пробіг: {totalDistance.toFixed(2)} км
                    </Styles.Text>
                )}

                {totalCost > 0 && (
                    <Styles.Text>
                        Вартість пробігу: {totalCost} грн
                    </Styles.Text>
                )}
            </Styles.Modal>
        </Styles.Wrapper>
    );
}