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
  Switch,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Fade,
  Grow,
  LinearProgress,
  CircularProgress
} from '@mui/material';

import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import CloseIcon from '@mui/icons-material/Close';
import Select from 'react-select';
import { months } from '../../helpres';
// import { useGpsData } from '../../hooks/useGpsData';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';
// import { splitGpsSegments } from '../../helpres/splitGpsSegments';
// import { usePersonnelData } from '../../hooks/usePersonnelData';
import { vehicleTypes  } from '../../helpres';
// import { fetchGpsByImei } from '../../helpres/gpsApi';
import { calculateMileageHelper } from '../../helpres/calculateMileageHelper';
import { groupVehiclesByType } from '../../helpres/groupVehiclesByType';

export default function AddMileageModal({ onClose }) {
  const { data: vehiclesData = [] } = useVehiclesData();
  // const { data: personnel = [] } = usePersonnelData();
  // const { data: gpsData = [] } = useGpsData();
  const { data: rates = [] } = useRatesData();

  const groupedVehicles = groupVehiclesByType(vehiclesData);

  const [selectedYear, setSelectedYear] = useState(null);
  const [selectedMonth, setSelectedMonth] = useState(null);
  const [selectedVehicle, setSelectedVehicle] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [results, setResults] = useState([]);
  const [selectedVehicleType, setSelectedVehicleType] = useState(null);
  const [isGroupCalculation, setIsGroupCalculation] = useState(false);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  
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
      // ? (selectedVehicleType
      //     ? vehiclesData.filter(v => v.vehicleType === selectedVehicleType.value)
      //     : vehiclesData)
      // : [selectedVehicle]; // обов’язково масив для group-like розрахунку

      ? (selectedVehicleType
        ? groupedVehicles[selectedVehicleType.value] || []
        : vehiclesData) // або всі машини
    : [selectedVehicle];

    try {
      setLoading(true);
      setProgress(0);

      const totalVehicles = vehiclesForCalculation.length;
      const resArray = [];

      for (let i = 0; i < totalVehicles; i++) {
        const vehicle = vehiclesForCalculation[i];

        // 👇 Викликаємо helper для одиничної техніки
        const vehicleResult = await calculateMileageHelper(vehicle, selectedMonth.value, selectedYear.value, rates);

        resArray.push(vehicleResult);

        // 👇 Оновлюємо прогрес
        const currentProgress = Math.round(((i + 1) / totalVehicles) * 100);
        setProgress(currentProgress);
      }

      setResults(resArray);
    } catch (err) {
      console.error('Помилка розрахунку пробігу:', err);
      alert('Сталася помилка під час розрахунку пробігу');
    } finally {
      setLoading(false);
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

              <Button
                variant="contained"
                onClick={handleCalculate}
                fullWidth
                disabled={loading}
                sx={{ position: 'relative' }}
              >
                {loading ? (
                  <>
                    <CircularProgress size={20} sx={{ color: '#fff', mr: 1 }} />
                    Розрахунок...
                  </>
                ) : (
                  'Розрахувати'
                )}
              </Button>

            </Paper>
          </Box>

          {/* Права панель */}
          <Box sx={{ width: '60%', overflowY: 'auto', height: '100%' }}>
            <Paper elevation={1} sx={{ p: 1.5, borderRadius: 2 }}>
              <Typography variant="subtitle1" sx={{ mb: 1.5, fontWeight: 500 }}>
                Результати по днях
              </Typography>

              {/* 🔄 LOADING */}
              {loading && (
                <Fade in={loading}>
                  <Box
                    sx={{
                      height: '100%',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 2,
                      mt: 6,
                    }}
                  >
                    <CircularProgress size={48} />
                    <Typography variant="body2" color="text.secondary">
                      Розрахунок пробігу… {progress}%
                    </Typography>

                    <Box sx={{ width: '60%' }}>
                      <LinearProgress
                        variant="determinate"
                        value={progress}
                      />
                    </Box>
                  </Box>
                </Fade>
              )}

              {/* ✅ RESULTS */}
              {!loading && results.length > 0 && (
                <Fade in={!loading}>
                  <Box>
                    {results.map((vehicleResult, index) => (
                      <Grow in timeout={300 + index * 100} key={vehicleResult.vehicle._id}>
                        <Accordion sx={{ mb: 1 }}>
                          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                            <Box sx={{ width: '100%' }}>
                              <Typography sx={{ fontWeight: 600 }}>
                                {vehicleResult.vehicle.mark}{' '}
                                {vehicleResult.vehicle.regNumber}
                              </Typography>
                              <Typography variant="body2" color="text.secondary">
                                {vehicleResult.totalDistance.toFixed(2)} км •{' '}
                                {vehicleResult.totalCost.toFixed(2)} грн
                              </Typography>
                            </Box>
                          </AccordionSummary>

                          <AccordionDetails>
                            {vehicleResult.dailyResults.map((day) => (
                              <Box
                                key={day.date.toISOString()}
                                sx={{ mb: 1, p: 1, borderBottom: '1px solid #eee' }}
                              >
                                <Typography>
                                  <b>Дата:</b>{' '}
                                  {day.date.toLocaleDateString('uk-UA')}
                                </Typography>
                                <Typography>
                                  <b>Пробіг:</b> {day.distance.toFixed(2)} км
                                </Typography>
                                <Typography>
                                  <b>Вартість:</b> {day.cost.toFixed(2)} грн
                                </Typography>
                                <Typography>
                                  {/* <b>Водій:</b> {day.driver || '—'} */}
                                  <b>Водій:</b> {day.driver ? String(day.driver) : '—'}
                                </Typography>
                              </Box>
                            ))}
                          </AccordionDetails>
                        </Accordion>
                      </Grow>
                    ))}
                  </Box>
                </Fade>
              )}

              {/* 📝 EMPTY */}
              {!loading && results.length === 0 && (
                <Typography color="text.secondary">
                  Введіть параметри та натисніть «Розрахувати».
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