import { useState, useEffect, useMemo } from 'react';
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

import { months, vehicleTypes } from '../../helpres';
import { useRatesData } from '../../hooks/useRatesData';
import { useVehiclesData } from '../../hooks/useVehiclesData';
import { calculateMileageHelper } from '../../helpres/calculateMileageHelper';
import { groupVehiclesByType } from '../../helpres/groupVehiclesByType';

import * as XLSX from 'xlsx';

export default function AddMileageModal({ onClose }) {
  const { data: vehiclesData = [] } = useVehiclesData();
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

  const formatDuration = (seconds = 0) => {
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);

    return `${h}г ${m}хв`;
  };

  const vehicleTypeOptions = vehicleTypes.map(t => ({
    value: t._id,
    label: t.name,
  }));

  // 🔹 ОБОВ'ЯЗКОВО для Dialog + react-select
  const selectPortalStyles = {
    menuPortal: base => ({ ...base, zIndex: 9999 }),
  };

  // 🔹 Формування списку техніки
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

    if (
      selectedVehicle &&
      !mapped.some(v => v.imei === selectedVehicle.imei)
    ) {
      setSelectedVehicle(null);
    }
  }, [vehiclesData, selectedVehicleType]);

  // 🔥 РОЗРАХУНОК
  const handleCalculate = async () => {
    if (!selectedMonth || !selectedYear || (!selectedVehicle && !isGroupCalculation)) {
      alert('Оберіть рік, місяць та техніку / тип техніки!');
      return;
    }

    const vehiclesForCalculation = isGroupCalculation
      ? (selectedVehicleType
          ? groupedVehicles[selectedVehicleType.value] || []
          : vehiclesData)
      : [selectedVehicle];

    try {
      setLoading(true);
      setProgress(0);

      const totalVehicles = vehiclesForCalculation.length;
      const resArray = [];

      for (let i = 0; i < totalVehicles; i++) {
        const vehicle = vehiclesForCalculation[i];

        const vehicleResult = await calculateMileageHelper(
          vehicle,
          selectedMonth.value,
          selectedYear.value,
          rates
        );

        resArray.push(vehicleResult);

        setProgress(Math.round(((i + 1) / totalVehicles) * 100));
      }

      setResults(resArray);
    } catch (err) {
      console.error(err);
      alert('Помилка розрахунку');
    } finally {
      setLoading(false);
    }
  };

  // 🔥 ПІДГОТОВКА ДАНИХ
  const preparedResults = useMemo(() => {
    return results
      .filter(r =>
        r &&
        r.totalDistance > 0 &&
        r.dailyResults &&
        r.dailyResults.length > 0
      )
      .map(r => ({
        ...r,
        dailyResults: r.dailyResults
          .map(day => ({
            ...day,
            date: new Date(day.date),
          }))
          .sort((a, b) => a.date - b.date),
      }))
      .sort((a, b) => b.totalDistance - a.totalDistance);
  }, [results]);

  const handleExportExcel = () => {
    if (!preparedResults.length) return;

    const rows = [];

    preparedResults.forEach(vehicleResult => {
      const vehicleName = `${vehicleResult.vehicle.mark} ${vehicleResult.vehicle.regNumber}`;

      // 🔹 Заголовок техніки
      rows.push({
        'Техніка': vehicleName,
        'Дата': '',
        'Пробіг (км)': '',
        'Вартість (грн)': '',
        'Час роботи': '',
        'Водій': '',
      });

      // 🔹 Дані по днях
      vehicleResult.dailyResults.forEach(day => {
        rows.push({
          'Техніка': '',
          'Дата': day.date.toLocaleDateString('uk-UA'),
          'Пробіг (км)': day.distance.toFixed(2),
          'Вартість (грн)': (day.cost ?? 0).toFixed(2),
          'Час роботи': formatDuration(day.duration),
          'Водій': day.driver || '—',
        });
      });

      // 🔹 Підсумок по техніці
      rows.push({
        'Техніка': 'Разом:',
        'Дата': '',
        'Пробіг (км)': vehicleResult.totalDistance.toFixed(2),
        'Вартість (грн)': (vehicleResult.totalCost ?? 0).toFixed(2),
        'Час роботи': formatDuration(vehicleResult.totalDuration),
        'Водій': '',
      });

      // 🔹 Порожній рядок (відбивка)
      rows.push({});
    });

    const worksheet = XLSX.utils.json_to_sheet(rows);
    const workbook = XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(workbook, worksheet, 'Пробіг');

    const fileName = `mileage_${selectedMonth?.value}_${selectedYear?.value}.xlsx`;

    XLSX.writeFile(workbook, fileName);
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
          height: '650px',      // 👈 ФІКСОВАНА ВИСОТА
          width: '900px',       // 👈 опційно фіксована ширина
          maxWidth: '900px',    // щоб MUI не обмежував
        },
      }}
      >
      <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between' }}>
        Розрахунок пробігу
        <IconButton onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>

      <Divider />

      <DialogContent>

        <Box sx={{ display: 'flex', gap: 2 }}>

          {/* 🔹 ЛІВА ПАНЕЛЬ */}
          <Box sx={{ width: '35%' }}>
            <Paper sx={{ p: 2 }}>

              <FormControlLabel
                control={
                  <Switch
                    checked={isGroupCalculation}
                    onChange={() => setIsGroupCalculation(v => !v)}
                  />
                }
                label={isGroupCalculation ? "Груповий" : "Індивідуальний"}
              />

              {/* Рік */}
              <Select
                value={selectedYear}
                onChange={setSelectedYear}
                options={years}
                placeholder="Оберіть рік"
                menuPortalTarget={document.body}
                styles={selectPortalStyles}
              />

              {/* Місяць */}
              <Box sx={{ mt: 1 }}>
                <Select
                  value={selectedMonth}
                  onChange={setSelectedMonth}
                  options={months.map(m => ({
                    value: parseInt(m._id, 10),
                    label: m.name_ua,
                  }))}
                  placeholder="Оберіть місяць"
                  menuPortalTarget={document.body}
                  styles={selectPortalStyles}
                />
              </Box>

              {/* Тип техніки */}
              <Box sx={{ mt: 1 }}>
                <Select
                  value={selectedVehicleType}
                  onChange={setSelectedVehicleType}
                  options={vehicleTypeOptions}
                  placeholder="Оберіть тип техніки"
                  isClearable
                  menuPortalTarget={document.body}
                  styles={selectPortalStyles}
                />
              </Box>

              {/* Техніка */}
              <Box sx={{ mt: 1, opacity: isGroupCalculation ? 0.5 : 1 }}>
                <Select
                  value={selectedVehicle}
                  onChange={setSelectedVehicle}
                  options={vehicles}
                  placeholder={
                    isGroupCalculation
                      ? "Недоступно у груповому режимі"
                      : "Оберіть техніку"
                  }
                  isDisabled={isGroupCalculation}
                  menuPortalTarget={document.body}
                  styles={selectPortalStyles}
                />
              </Box>

              <Button
                variant="contained"
                onClick={handleCalculate}
                fullWidth
                disabled={loading}
                sx={{ mt: 2 }}
              >
                {loading ? "Розрахунок..." : "Розрахувати"}
              </Button>

            </Paper>
          </Box>

          {/* 🔹 ПРАВА ПАНЕЛЬ */}
          <Box sx={{ width: '65%' }}>
            <Paper sx={{ p: 2 }}>

              {loading && (
                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <CircularProgress />
                  <Typography sx={{ mt: 1 }}>
                    Розрахунок… {progress}%
                  </Typography>
                  <LinearProgress value={progress} variant="determinate" />
                </Box>
              )}

              {!loading && preparedResults.length > 0 &&
                preparedResults.map(vehicleResult => (
                  <Accordion key={vehicleResult.vehicle._id}>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                      <Box sx={{ width: '100%' }}>
                        <Typography sx={{ fontWeight: 600 }}>
                          {vehicleResult.vehicle.mark} {vehicleResult.vehicle.regNumber}
                        </Typography>

                        <Typography variant="body2" color="text.secondary">
                          {vehicleResult.totalDistance.toFixed(2)} км •{' '}
                          {vehicleResult.totalCost.toFixed(2)} грн •
                          {formatDuration(vehicleResult.totalDuration)}
                        </Typography>
                      </Box>
                    </AccordionSummary>

                    <AccordionDetails>
                      {vehicleResult.dailyResults.map(day => (
                        <Box
                          key={day.date.toISOString()}
                          sx={{ mb: 1, p: 1, borderBottom: '1px solid #eee' }}
                        >
                          <Typography>
                            <b>Дата:</b> {day.date.toLocaleDateString('uk-UA')}
                          </Typography>

                          <Typography>
                            <b>Пробіг:</b> {day.distance.toFixed(2)} км
                          </Typography>

                          <Typography>
                            <b>Вартість:</b> {day.cost.toFixed(2)} грн
                          </Typography>

                          <Typography>
                            <b>Час роботи:</b> {formatDuration(day.duration)}
                          </Typography>

                          {/* <Typography>
                            <b>Водій:</b> {day.driver || '—'}
                          </Typography> */}

                          <Typography>
                            <b>Водій:</b>{' '}
                            {day.driver
                              ? `${day.driver.firstName} ${day.driver.lastName}`
                              : '—'}
                          </Typography>
                        </Box>
                      ))}
                    </AccordionDetails>

                  </Accordion>
                ))}

              {!loading && preparedResults.length === 0 && (
                <Typography>
                  Немає даних для вибраних параметрів.
                </Typography>
              )}

            </Paper>
          </Box>

        </Box>
      </DialogContent>

      {/* <DialogActions>
        <Button onClick={onClose}>Закрити</Button>
      </DialogActions> */}

      <DialogActions sx={{ p: 1.5 }}>

        <Button
          variant="contained"
          onClick={handleExportExcel}
          disabled={loading || preparedResults.length === 0}
        >
          Експорт в Excel
        </Button>

        <Button
          variant="outlined"
          onClick={onClose}
        >
          Закрити
        </Button>

      </DialogActions>

    </Dialog>
  );
}
