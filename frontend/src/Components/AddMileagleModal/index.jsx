import { useState, useEffect } from 'react';
import {
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Button,
    IconButton,
    Typography,
    Box,
    Divider,
    Paper,
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { months, vehicleTypes } from '../../helpres';
import { haversineDistance } from '../../helpres/distance';
import { useGpsData } from '../../hooks/useGpsData';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';

export default function AddMileageModal({ onClose }) {
    const { data: vehiclesData = [] } = useVehiclesData();
    const { data: gpsData = [] } = useGpsData();
    const { data: rates = {} } = useRatesData();

    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedVehicle, setSelectedVehicle] = useState(null);
    const [vehicles, setVehicles] = useState([]);
    const [selectedGpsData, setSelectedGpsData] = useState([]);
    const [results, setResults] = useState({
        distance: 0,
        cost: 0,
        moveTime: '0 год 0 хв',
        idleTime: '0 год 0 хв',
        drivers: [],
    });

    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => ({
        value: currentYear - i,
        label: `${currentYear - i}`,
    }));

    useEffect(() => {
        if (vehiclesData.length > 0) {
            const allVehicles = vehiclesData.map((v) => ({
                value: v.regNumber,
                label: `${v.mark} (${v.regNumber})`,
                imei: v.imei,
                type: v.vehicleType,
                ...v,
            }));
            setVehicles(allVehicles);
        }
    }, [vehiclesData]);

    const filterGpsData = (month, year, vehicle) => {
        const filtered = gpsData.filter((data) => {
            const gpsDate = new Date(data.date);
            return (
                data.imei === vehicle.imei &&
                gpsDate.getMonth() + 1 === month.value &&
                gpsDate.getFullYear() === year.value
            );
        });
        setSelectedGpsData(filtered);
    };

    const handleYearChange = (opt) => {
        setSelectedYear(opt);
        if (selectedMonth && selectedVehicle) filterGpsData(selectedMonth, opt, selectedVehicle);
    };

    const handleMonthChange = (opt) => {
        setSelectedMonth(opt);
        if (selectedYear && selectedVehicle) filterGpsData(opt, selectedYear, selectedVehicle);
    };

    const handleVehicleChange = (opt) => {
        setSelectedVehicle(opt);
        if (selectedMonth && selectedYear) filterGpsData(selectedMonth, selectedYear, opt);
    };

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        return `${h} год ${m} хв`;
    };

    const isPointValid = (lat, lon) => lat !== 0 && lon !== 0 && lat >= 44 && lat <= 52 && lon >= 22 && lon <= 40;

    const handleCalculate = () => {
        if (!selectedMonth || !selectedVehicle || !selectedYear) {
            alert('Оберіть рік, місяць та техніку!');
            return;
        }

        if (!selectedGpsData.length) {
            alert('Немає GPS-даних для вибраного періоду!');
            return;
        }

        let totalDistance = 0;
        let totalMoveTime = 0;
        let totalIdleTime = 0;

        selectedGpsData.forEach((data) => {
            const validPoints = data.data.filter((p) => isPointValid(p.latitude, p.longitude));
            for (let i = 1; i < validPoints.length; i++) {
                const { latitude: lat1, longitude: lon1, speed: speed1 } = validPoints[i - 1];
                const { latitude: lat2, longitude: lon2, speed: speed2 } = validPoints[i];

                const dist = haversineDistance(lat1, lon1, lat2, lon2);
                totalDistance += dist;

                const avgSpeed = (speed1 + speed2) / 2;
                if (avgSpeed > 3) totalMoveTime += 1; // хвилини руху
                else totalIdleTime += 1; // хвилини простою
            }
        });

        const vehicleType = vehicleTypes.find((t) => t._id === selectedVehicle.type);

        let rate = 0;
        switch (vehicleType?._id) {
            case 'car': rate = rates.carRate || 0; break;
            case 'truck': rate = rates.truckRate || 0; break;
            case 'tractor': rate = rates.tracktorRate || 0; break;
            case 'combine': rate = rates.combineRate || 0; break;
            default: rate = 0;
        }

        const drivers = ['driver1', 'driver2', 'driver3']
            .map((key) => selectedVehicle[key])
            .filter((v) => v);

        setResults({
            distance: totalDistance,
            cost: (totalDistance * rate).toFixed(2),
            moveTime: formatTime(totalMoveTime),
            idleTime: formatTime(totalIdleTime),
            drivers,
        });
    };

    return (
        <Dialog
            open
            onClose={onClose}
            maxWidth="md"
            fullWidth
            PaperProps={{ sx: { borderRadius: 3, p: 1, backgroundColor: '#fafafa' } }}
        >
            <DialogTitle
                sx={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    fontWeight: 600,
                    fontSize: 18,
                }}
            >
                Розрахунок пробігу
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>
            <Divider />

            <DialogContent sx={{ py: 2, overflow: 'visible' }}>
                <Box sx={{ display: 'flex', gap: 2, flexWrap: 'nowrap', justifyContent: 'space-between' }}>
                    <Box sx={{ width: '35%' }}>
                        <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
                                Параметри розрахунку
                            </Typography>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Рік</Typography>
                                <Select
                                    value={selectedYear}
                                    onChange={handleYearChange}
                                    options={years}
                                    placeholder="Оберіть рік"
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Місяць</Typography>
                                <Select
                                    value={selectedMonth}
                                    onChange={handleMonthChange}
                                    options={months.map((m) => ({ value: parseInt(m._id, 10), label: m.name_ua }))}
                                    placeholder="Оберіть місяць"
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </Box>

                            <Box sx={{ mb: 1.5 }}>
                                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>Техніка</Typography>
                                <Select
                                    value={selectedVehicle}
                                    onChange={handleVehicleChange}
                                    options={vehicles}
                                    placeholder="Оберіть техніку"
                                    menuPortalTarget={document.body}
                                    styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                                />
                            </Box>

                            <Button variant="contained" onClick={handleCalculate} fullWidth>
                                Розрахувати
                            </Button>
                        </Paper>
                    </Box>

                    <Box sx={{ width: '60%' }}>
                        <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
                            <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
                                Результати
                            </Typography>

                            {results.distance > 0 ? (
                                <>
                                    <Typography><b>Пробіг:</b> {results.distance.toFixed(2)} км</Typography>
                                    <Typography><b>Вартість:</b> {results.cost} грн</Typography>
                                    <Typography><b>Час руху:</b> {results.moveTime}</Typography>
                                    <Typography sx={{ mb: 1 }}><b>Час простою:</b> {results.idleTime}</Typography>

                                    <Box sx={{ mt: 1 }}>
                                        <Typography sx={{ fontWeight: 600, mb: 1 }}>Водії:</Typography>
                                        {results.drivers.length > 0 ? (
                                            results.drivers.map((d, i) => (
                                                <Typography key={i}>
                                                    • {d.firstName ? `${d.firstName} ${d.lastName}` : JSON.stringify(d)}
                                                    {d.function ? ` (${d.function})` : ''}
                                                </Typography>
                                            ))
                                        ) : (
                                            <Typography sx={{ fontStyle: 'italic', color: '#888' }}>
                                                Водій не визначено
                                            </Typography>
                                        )}
                                    </Box>
                                </>
                            ) : (
                                <Typography color="text.secondary">
                                    Введіть параметри та натисніть "Розрахувати".
                                </Typography>
                            )}
                        </Paper>
                    </Box>
                </Box>
            </DialogContent>

            <DialogActions sx={{ p: 1.5 }}>
                <Button variant="outlined" size="small" onClick={onClose}>
                    Закрити
                </Button>
            </DialogActions>
        </Dialog>
    );
}
