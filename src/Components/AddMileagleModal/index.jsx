// import { StyledWrapper, StyledModal, StyledCloseButton } from './styled';
// import Button from '../Button';
// import closeModal from "../../helpres/closeModal";
// import { months } from '../../helpres';
// import Select from 'react-select';
// import { useEffect, useState, useMemo } from 'react';
// import { useDispatch, useSelector } from 'react-redux';

// import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
// import { fetchGpsData } from '../../store/locationSlice';
// import { haversineDistance } from '../../helpres/distance';
// import { fetchRates, selectRates } from '../../store/ratesSlice'; // Імпорт селектора та thunk

// export default function AddMileagleModal({ onClose }) {
//     const dispatch = useDispatch();
//     const groups = useSelector(selectAllGroups);
//     const gpsData = useSelector((state) => state.gps.data);
//     const rates = useSelector(selectRates); // Використання селектора для отримання тарифів
//     const handleWrapperClick = closeModal(onClose);

//     const [selectedMonth, setSelectedMonth] = useState(null);
//     const [selectedVehicle, setSelectedVehicle] = useState(null);
//     const [vehicles, setVehicles] = useState([]);
//     const [totalDistance, setTotalDistance] = useState(0);
//     const [totalCost, setTotalCost] = useState(0); // Додаємо стан для вартості пробігу
//     const [selectedGpsData, setSelectedGpsData] = useState([]);

//     useEffect(() => {
//         dispatch(fetchGroups());
//         dispatch(fetchGpsData()); // Отримуємо всі GPS-дані
//         dispatch(fetchRates()); // Отримуємо тарифи
//     }, [dispatch]);

//     useEffect(() => {
//         if (groups.length > 0) {
//             const allVehicles = groups.flatMap(group =>
//                 group.vehicles.map(vehicle => ({
//                     value: vehicle.regNumber, 
//                     label: `${vehicle.mark} (${vehicle.regNumber})`,
//                     imei: vehicle.imei,
//                     type: vehicle.vehicleType
//                 }))
//             );
//             setVehicles(allVehicles);
//         }
//     }, [groups]);

//     const handleMonthChange = (selectedOption) => {
//         setSelectedMonth(selectedOption);
//     };

//     const handleVehicleChange = (selectedOption) => {
//         setSelectedVehicle(selectedOption);
        
//         // Фільтруємо GPS-дані по IMEI
//         const vehicleGpsData = gpsData.filter(data => data.imei === selectedOption.imei);
//         setSelectedGpsData(vehicleGpsData); // Зберігаємо GPS-дані для вибраної техніки
//     };

//     const routeCoordinates = useMemo(() => {
//         if (!selectedGpsData || selectedGpsData.length === 0) return [];
//         const filteredData = selectedGpsData.filter((entry) => {
//             const entryDate = new Date(entry.date);
//             return entryDate.getMonth() === selectedMonth.value;
//         });

//         return filteredData.flatMap(entry =>
//             entry.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0)
//                 .map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude])
//         );
//     }, [selectedGpsData, selectedMonth]);

//     const handleCalculate = () => { 
//         console.log(selectedVehicle)
        
//         if (!selectedMonth || !selectedVehicle || selectedGpsData.length === 0) {
//             alert("Оберіть місяць та техніку!");
//             return;
//         }
//         if (routeCoordinates.length < 2) {
//             alert("Недостатньо даних для розрахунку пробігу.");
//             return;
//         }

//         const calculatedDistance = routeCoordinates.reduce((sum, coord, index, array) => {
//             if (index === 0) return sum;
//             const [lat1, lon1] = array[index - 1];
//             const [lat2, lon2] = coord;
//             return sum + haversineDistance(lat1, lon1, lat2, lon2);
//         }, 0).toFixed(2);

//         setTotalDistance(calculatedDistance);  // Оновлюємо пробіг

//         // Обчислюємо вартість пробігу
//         const rate = rates[selectedVehicle.type] || 0;
//         const cost = (calculatedDistance * rate).toFixed(2);

//         console.log('cost', cost)
//         setTotalCost(cost);  // Оновлюємо вартість пробігу
//     };

//     return (
//         <StyledWrapper onClick={handleWrapperClick}>
//             <StyledModal>
//                 <StyledCloseButton onClick={onClose} />

//                 <div style={{ width: '300px', margin: '0 auto' }}>
//                     <Select
//                         value={selectedMonth}
//                         onChange={handleMonthChange}
//                         options={months.map((month, index) => ({
//                             value: index,
//                             label: month.name_ua
//                         }))}
//                         placeholder="Оберіть місяць"
//                     />
//                 </div>

//                 <div style={{ width: '300px', margin: '10px auto' }}>
//                     <Select
//                         value={selectedVehicle}
//                         onChange={handleVehicleChange}
//                         options={vehicles}
//                         placeholder="Оберіть техніку"
//                         isLoading={groups.length === 0}
//                     />
//                 </div>

//                 <div style={{ display: 'flex', justifyContent: 'flex-end', marginTop: '10px' }}>
//                     <Button text={'Розрахувати'} onClick={handleCalculate} />
//                 </div>

//                 {totalDistance > 0 && (
//                     <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '18px' }}>
//                         Пробіг: {totalDistance} км
//                     </div>
//                 )}

//                 {totalCost > 0 && (
//                     <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '18px' }}>
//                         Вартість пробігу: {totalCost} грн
//                     </div>
//                 )}
//             </StyledModal>
//         </StyledWrapper>
//     );
// }


import { StyledWrapper, StyledModal, StyledCloseButton } from './styled';
import Button from '../Button';
import closeModal from "../../helpres/closeModal";
import { months, vehicleTypes } from '../../helpres'; // Імпорт vehicleTypes
import Select from 'react-select';
import { useEffect, useState, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { fetchGroups, selectAllGroups } from '../../store/groupSlice'; 
import { fetchGpsData } from '../../store/locationSlice';
import { haversineDistance } from '../../helpres/distance';
import { fetchRates, selectRates } from '../../store/ratesSlice'; // Імпорт селектора та thunk

export default function AddMileagleModal({ onClose }) {
    const dispatch = useDispatch();
    const groups = useSelector(selectAllGroups);
    const gpsData = useSelector((state) => state.gps.data);
    const rates = useSelector(selectRates); // Використання селектора для отримання тарифів
    const handleWrapperClick = closeModal(onClose);

    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [totalDistance, setTotalDistance] = useState(0);
    const [totalCost, setTotalCost] = useState(0); // Додаємо стан для вартості пробігу
    const [selectedGpsData, setSelectedGpsData] = useState([]);

    useEffect(() => {
        dispatch(fetchGroups());
        dispatch(fetchGpsData()); // Отримуємо всі GPS-дані
        dispatch(fetchRates()); // Отримуємо тарифи
    }, [dispatch]);

    useEffect(() => {
        if (groups.length > 0) {
            const allVehicles = groups.flatMap(group =>
                group.vehicles.map(vehicle => ({
                    value: vehicle.regNumber, 
                    label: `${vehicle.mark} (${vehicle.regNumber})`,
                    imei: vehicle.imei,
                    type: vehicle.vehicleType
                }))
            );
            setVehicles(allVehicles);
        }
    }, [groups]);

    const handleMonthChange = (selectedOption) => {
        setSelectedMonth(selectedOption);
    };

    const handleVehicleChange = (selectedOption) => {
        setSelectedVehicle(selectedOption);
        
        // Фільтруємо GPS-дані по IMEI
        const vehicleGpsData = gpsData.filter(data => data.imei === selectedOption.imei);
        setSelectedGpsData(vehicleGpsData); // Зберігаємо GPS-дані для вибраної техніки
    };

    const routeCoordinates = useMemo(() => {
        if (!selectedGpsData || selectedGpsData.length === 0) return [];
        const filteredData = selectedGpsData.filter((entry) => {
            const entryDate = new Date(entry.date);
            return entryDate.getMonth() === selectedMonth.value;
        });

        return filteredData.flatMap(entry =>
            entry.data.filter(gpsPoint => gpsPoint.latitude !== 0 && gpsPoint.longitude !== 0)
                .map(gpsPoint => [gpsPoint.latitude, gpsPoint.longitude])
        );
    }, [selectedGpsData, selectedMonth]);

    const handleCalculate = () => {
        console.log('Поточні тарифи:', rates); // Виведення тарифів в консоль
        console.log(selectedVehicle)
        
        if (!selectedMonth || !selectedVehicle || selectedGpsData.length === 0) {
            alert("Оберіть місяць та техніку!");
            return;
        }
        if (routeCoordinates.length < 2) {
            alert("Недостатньо даних для розрахунку пробігу.");
            return;
        }

        const calculatedDistance = routeCoordinates.reduce((sum, coord, index, array) => {
            if (index === 0) return sum;
            const [lat1, lon1] = array[index - 1];
            const [lat2, lon2] = coord;
            return sum + haversineDistance(lat1, lon1, lat2, lon2);
        }, 0).toFixed(2);

        setTotalDistance(calculatedDistance);  // Оновлюємо пробіг

        // Обчислюємо вартість пробігу
        const vehicleType = vehicleTypes.find(type => type._id === selectedVehicle.type);
        let rate = 0;
        if (vehicleType) {
            switch (vehicleType._id) {
                case 'car':
                    rate = rates.carRate;
                    break;
                case 'vintage_car':
                    rate = rates.truckRate;
                    break;
                case 'tractor':
                    rate = rates.tracktorRate;
                    break;
                case 'combine':
                    rate = rates.combineRate;
                    break;
                case 'truck':
                    rate = rates.truckRate;
                    break;
                default:
                    rate = 0;
            }
        }
        console.log(rate)
        const cost = (calculatedDistance * rate).toFixed(2);
        console.log(cost)
        setTotalCost(cost);  // Оновлюємо вартість пробігу
    };

    return (
        <StyledWrapper onClick={handleWrapperClick}>
            <StyledModal>
                <StyledCloseButton onClick={onClose} />

                <div style={{ width: '300px', margin: '0 auto' }}>
                    <Select
                        value={selectedMonth}
                        onChange={handleMonthChange}
                        options={months.map((month, index) => ({
                            value: index,
                            label: month.name_ua
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
                    <Button text={'Розрахувати'} onClick={handleCalculate} />
                </div>

                {totalDistance > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '18px' }}>
                        Пробіг: {totalDistance} км
                    </div>
                )}

                {totalCost > 0 && (
                    <div style={{ textAlign: 'center', marginTop: '15px', fontSize: '18px' }}>
                        Вартість пробігу: {totalCost} грн
                    </div>
                )}
            </StyledModal>
        </StyledWrapper>
    );
}