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
  FormControlLabel,
  Switch
} from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { months } from '../../helpres';
import { useGpsData } from '../../hooks/useGpsData';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { splitGpsSegments } from '../../helpres/splitGpsSegments';
import { usePersonnelData } from '../../hooks/usePersonnelData';
import { vehicleTypes  } from '../../helpres';
import { fetchGpsByImei } from '../../helpres/gpsApi';
import { calculateMileageHelper } from '../../helpres/calculateMileageHelper';

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
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isGroupCalculation, setIsGroupCalculation] = useState(false);

  const currentYear = new Date().getFullYear();
  
  const years = Array.from({ length: 3 }, (_, i) => ({
    value: currentYear - i,
    label: `${currentYear - i}`,
  }));

  const vehicleTypeOptions = vehicleTypes.map(t => ({
    value: t._id,
    label: t.name,
  }));

  // ✅ Формуємо список техніки
  useEffect(() => {
    if (!vehiclesData.length) return;

    const filtered = selectedVehicleType
      ? vehiclesData.filter(v => v.vehicleType === selectedVehicleType.value)
      : vehiclesData;

    const mapped = filtered.map(v => ({
      value: v.regNumber,
      label: `${v.mark} (${v.regNumber})`,
      imei: v.imei,
      vehicleType: v.vehicleType,
      ...v,
    }));

    setVehicles(mapped);

    // якщо обраної техніки більше нема — скидаємо
    if (
      selectedVehicle &&
      !mapped.some(v => v.imei === selectedVehicle.imei)
    ) {
      setSelectedVehicle(null);
    }
  }, [vehiclesData, selectedVehicleType]);

  const handleCalculate = async () => {
    if (!selectedMonth || !selectedYear || (!selectedVehicle && !isGroupCalculation)) {
      alert('Оберіть рік, місяць та техніку / тип техніки!');
      return;
    }

    const vehiclesForCalculation = isGroupCalculation
      ? (selectedVehicleType
          ? vehiclesData.filter(v => v.vehicleType === selectedVehicleType.value)
          : vehiclesData)
      : selectedVehicle;

    try {
      const res = await calculateMileageHelper(
        vehiclesForCalculation,
        selectedMonth.value,
        selectedYear.value,
        rates
      );

      // Якщо одинична машина, res — об'єкт, інакше масив
      setResults(Array.isArray(res) ? res.flatMap(v => v.dailyResults) : res.dailyResults);
    } catch (err) {
      console.error('Помилка розрахунку пробігу:', err);
      alert('Сталася помилка під час розрахунку пробігу');
    }
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

              <FormControlLabel
                control={
                  <Switch
                    checked={isGroupCalculation}
                    onChange={() => setIsGroupCalculation(v => !v)}
                  />
                }
                label={isGroupCalculation ? "Груповий розрахунок" : "Індивідуальний розрахунок"}
              />


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
                  Тип техніки
                </Typography>
                <Select
                  value={selectedVehicleType}
                  onChange={setSelectedVehicleType}
                  options={vehicleTypeOptions}
                  placeholder="Оберіть тип техніки"
                  isClearable
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                />
              </Box>

              <Box sx={{ mb: 1.5, opacity: isGroupCalculation ? 0.5 : 1 }}>
                <Typography variant="subtitle2" sx={{ mb: 0.5 }}>
                  Техніка
                </Typography>
                <Select
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
                  options={vehicles}
                  placeholder={isGroupCalculation ? "Вибір недоступний у груповому режимі" : "Оберіть техніку"}
                  menuPortalTarget={document.body}
                  styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
                  isDisabled={isGroupCalculation}
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
                    <Box key={res.date.toISOString()} sx={{ mb: 1, p: 1, borderBottom: '1px solid #eee' }}>
                      <Typography>
                        <b>Дата:</b> {res.date.toLocaleDateString('uk-UA')}
                      </Typography>
                      <Typography>
                        <b>Пробіг:</b> {res.distance.toFixed(2)} км
                      </Typography>
                      <Typography>
                        <b>Вартість:</b> {res.cost.toFixed(2)} грн
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