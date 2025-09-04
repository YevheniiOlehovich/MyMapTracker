import { useState, useEffect } from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { months, vehicleTypes } from '../../helpres';
import { haversineDistance } from '../../helpres/distance';
import { useGpsData } from '../../hooks/useGpsData';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';

export default function AddMileagleModal({ onClose }) {
    const { data: vehiclesData = [], isLoading: isVehiclesLoading, isError: isVehiclesError, error: vehiclesError } = useVehiclesData();
    const { data: gpsData = [], isLoading: isGpsLoading, isError: isGpsError, error: gpsError } = useGpsData();
    const { data: rates = {}, isLoading: isRatesLoading, isError: isRatesError, error: ratesError } = useRatesData();

    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalCost, setTotalCost] = useState(0);
    const [selectedGpsData, setSelectedGpsData] = useState([]);

    useEffect(() => {
        if (vehiclesData.length > 0) {
            const allVehicles = vehiclesData.map(vehicle => ({
                value: vehicle.regNumber,
                label: `${vehicle.mark} (${vehicle.regNumber})`,
                imei: vehicle.imei,
                type: vehicle.vehicleType,
            }));
            setVehicles(allVehicles);
        }
    }, [vehiclesData]);

    const filterGpsData = (month, vehicle) => {
        const filteredData = gpsData.filter(data => {
            const gpsDate = new Date(data.date);
            return data.imei === vehicle.imei && gpsDate.getMonth() + 1 === month.value;
        }).map(data => ({
            ...data,
            data: data.data.filter(coord => coord.latitude !== 0 && coord.longitude !== 0)
        }));
        setSelectedGpsData(filteredData);
    };

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
        if (selectedVehicle) filterGpsData(selectedOption, selectedVehicle);
    };

    const handleVehicleChange = (selectedOption) => {
        setSelectedVehicle(selectedOption);
        if (selectedMonth) filterGpsData(selectedMonth, selectedOption);
    };

    const handleCalculate = () => {
        if (!selectedMonth || !selectedVehicle || selectedGpsData.length === 0) {
            alert("Оберіть місяць та техніку!");
            return;
        }

        let distanceSum = 0;

        selectedGpsData.forEach((data) => {
            const coordinates = data.data.map(coord => [coord.latitude, coord.longitude]);
            for (let i = 1; i < coordinates.length; i++) {
                const [lat1, lon1] = coordinates[i - 1];
                const [lat2, lon2] = coordinates[i];
                distanceSum += haversineDistance(lat1, lon1, lat2, lon2);
            }
        });

        const vehicleType = vehicleTypes.find(type => type._id === selectedVehicle.type);
        if (!vehicleType) {
            alert("Невідомий тип транспортного засобу!");
            return;
        }

        let rate = 0;
        switch (vehicleType._id) {
            case 'car': rate = rates.carRate; break;
            case 'vintage_car': rate = rates.vintageCarRate; break;
            case 'tractor': rate = rates.tractorRate; break;
            case 'combine': rate = rates.combineRate; break;
            case 'truck': rate = rates.truckRate; break;
            default: alert("Невідомий тип транспортного засобу!"); return;
        }

        setTotalDistance(distanceSum);
        setTotalCost((distanceSum * rate).toFixed(2));
    };

    if (isVehiclesLoading || isGpsLoading || isRatesLoading)
        return <Typography sx={{ p: 2 }}>Завантаження даних...</Typography>;
    if (isVehiclesError || isGpsError || isRatesError)
        return <Typography sx={{ p: 2 }}>Помилка завантаження даних: {vehiclesError?.message || gpsError?.message || ratesError?.message}</Typography>;

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
                Розрахунок пробігу
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent 
                dividers 
                sx={{ display: 'flex', flexDirection: 'column', gap: 2, height: '30vh', overflowY: 'auto' }}
            >
                <div>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={months.map(month => ({ value: parseInt(month._id, 10), label: month.name_ua }))}
                        placeholder="Оберіть місяць"
                    />
                </div>
                <div>
                    <Select
                        value={selectedVehicle}
                        onChange={handleVehicleChange}
                        options={vehicles}
                        placeholder="Оберіть техніку"
                        isLoading={isVehiclesLoading}
                    />
                </div>

                {totalDistance > 0 && (
                    <Typography>Пробіг: {totalDistance.toFixed(2)} км</Typography>
                )}
                {totalCost > 0 && (
                    <Typography>Вартість пробігу: {totalCost} грн</Typography>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" size="small" onClick={handleCalculate}>Розрахувати</Button>
            </DialogActions>
        </Dialog>

    );
}