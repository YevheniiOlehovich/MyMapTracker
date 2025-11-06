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
import { months } from '../../helpres';
import { useGpsData } from '../../hooks/useGpsData';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { splitGpsSegments } from '../../helpres/splitGpsSegments';
import { usePersonnelData } from '../../hooks/usePersonnelData';

export default function AddMileageModal({ onClose }) {
  const { data: vehiclesData = [] } = useVehiclesData();
  const { data: personnel = [] } = usePersonnelData();
  const { data: gpsData = [] } = useGpsData();
  const { data: rates = [] } = useRatesData();

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [results, setResults] = useState([]);

  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 5 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  // ✅ Формуємо список техніки
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

  const handleCalculate = () => {
    if (!selectedMonth || !selectedVehicle || !selectedYear) {
      alert('Оберіть рік, місяць та техніку!');
      return;
    }

    // ✅ Фільтрація GPS-даних за технікою, місяцем і роком
    const filteredData = gpsData.filter((data) => {
      const gpsDate = new Date(data.date);
      return (
        data.imei === selectedVehicle.imei &&
        gpsDate.getMonth() + 1 === selectedMonth.value &&
        gpsDate.getFullYear() === selectedYear.value
      );
    });

    if (!filteredData.length) {
      alert('Немає GPS-даних для вибраного періоду!');
      return;
    }

    const dailyResults = {};

    // ✅ Розрахунок по кожному дню
    filteredData.forEach((data) => {
      const gpsDate = new Date(data.date);
      const day = gpsDate.getDate();
      const movingSegments = splitGpsSegments(data.data);

      // загальна відстань
      const totalDistance = movingSegments.reduce((acc, seg) => acc + seg.distance, 0);

      // пошук найчастішого водія
      const driverCounts = {};
      movingSegments.forEach((seg) => {
        if (seg.driverCardId) {
          driverCounts[seg.driverCardId] = (driverCounts[seg.driverCardId] || 0) + 1;
        }
      });

      const dominantDriverId =
        Object.keys(driverCounts).length > 0
          ? Object.entries(driverCounts).sort((a, b) => b[1] - a[1])[0][0]
          : null;

      const foundDriver = dominantDriverId
        ? personnel.find((p) => p.rfid === dominantDriverId)
        : null;

      const driverName = foundDriver
        ? `${foundDriver.firstName} ${foundDriver.lastName}`
        : dominantDriverId || '—';

      dailyResults[day] = {
        distance: totalDistance,
        driver: driverName,
      };
    });

    // ✅ Отримуємо останній тариф з масиву
    const latestRate = Array.isArray(rates) && rates.length > 0 ? rates[rates.length - 1] : null;

    if (!latestRate) {
      alert('Не знайдено актуальний тариф!');
      return;
    }

    // ✅ Вибираємо ставку за типом техніки
    let rate = 0;
    switch (selectedVehicle.vehicleType) {
      case 'car':
        rate = latestRate.carRate || 0;
        break;
      case 'truck':
        rate = latestRate.truckRate || 0;
        break;
      case 'tractor':
        rate = latestRate.tracktorRate || 0;
        break;
      case 'combine':
        rate = latestRate.combineRate || 0;
        break;
      default:
        rate = 0;
    }

    // ✅ Формуємо результати
    const finalResults = Object.keys(dailyResults)
      .sort((a, b) => a - b)
      .map((day) => ({
        day,
        date: new Date(selectedYear.value, selectedMonth.value - 1, day),
        distance: dailyResults[day].distance,
        cost: (dailyResults[day].distance * rate).toFixed(2),
        driver: dailyResults[day].driver,
      }));

    setResults(finalResults);
  };

  return (
    <Dialog
      open
      onClose={onClose}
      maxWidth="md"
      fullWidth
      PaperProps={{
        sx: {
          borderRadius: 3,
          p: 1,
          backgroundColor: '#fafafa',
          height: '650px',
        },
      }}
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

      <DialogContent sx={{ py: 2, overflow: 'hidden', height: 'calc(100% - 68px)' }}>
        <Box
          sx={{
            display: 'flex',
            gap: 2,
            flexWrap: 'nowrap',
            justifyContent: 'space-between',
            height: '100%',
          }}
        >
          {/* Ліва панель */}
          <Box sx={{ width: '35%', overflowY: 'auto' }}>
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
                Параметри розрахунку
              </Typography>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Рік
                </Typography>
                <Select
                  value={selectedYear}
                  onChange={setSelectedYear}
                  options={years}
                  placeholder="Оберіть рік"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Місяць
                </Typography>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  options={months.map((m) => ({
                    value: parseInt(m._id, 10),
                    label: m.name_ua,
                  }))}
                  placeholder="Оберіть місяць"
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </Box>

              <Box sx={{ mb: 1.5 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Техніка
                </Typography>
                <Select
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
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

          {/* Права панель */}
          <Box sx={{ width: '60%', overflowY: 'auto', height: '100%' }}>
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
                Результати по днях
              </Typography>

              {results.length > 0 ? (
                <>
                  {results.map((res) => (
                    <Box key={res.day} sx={{ mb: 1, p: 1, borderBottom: '1px solid #eee' }}>
                      <Typography>
                        <b>Дата:</b> {res.date.toLocaleDateString('uk-UA')}
                      </Typography>
                      <Typography>
                        <b>Пробіг:</b> {res.distance.toFixed(2)} км
                      </Typography>
                      <Typography>
                        <b>Вартість:</b> {res.cost} грн
                      </Typography>
                      <Typography>
                        <b>Водій:</b> {res.driver}
                      </Typography>
                    </Box>
                  ))}

                  <Box sx={{ mt: 2, p: 1, borderTop: '2px solid #000' }}>
                    <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                      Підсумок за місяць
                    </Typography>
                    <Typography>
                      <b>Сумарний пробіг:</b>{' '}
                      {results.reduce((acc, r) => acc + r.distance, 0).toFixed(2)} км
                    </Typography>
                    <Typography>
                      <b>Сумарна вартість:</b>{' '}
                      {results.reduce((acc, r) => acc + parseFloat(r.cost), 0).toFixed(2)} грн
                    </Typography>
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
