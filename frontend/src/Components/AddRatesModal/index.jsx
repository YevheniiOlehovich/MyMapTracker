import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  IconButton,
  Box,
  Typography,
  Tooltip,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRatesData, useAddRates } from "../../hooks/useRatesData";

export default function AddRatesModal({ onClose }) {
  const { data: rates, isLoading, isError } = useRatesData();
  const addRatesMutation = useAddRates();

  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const [carRate, setCarRate] = useState("");
  const [truckRate, setTruckRate] = useState("");
  const [tracktorRate, setTracktorRate] = useState("");
  const [combineRate, setCombineRate] = useState("");

  useEffect(() => {
    if (rates) {
      const latestRate = Array.isArray(rates)
        ? rates[rates.length - 1]
        : rates;

      setCarRate(latestRate?.carRate ?? "");
      setTruckRate(latestRate?.truckRate ?? "");
      setTracktorRate(latestRate?.tracktorRate ?? "");
      setCombineRate(latestRate?.combineRate ?? "");
    }
  }, [rates]);

  const handleSave = () => {
    if (isGuest) return;

    const parsedRates = {
      carRate: parseFloat(carRate) || 0,
      truckRate: parseFloat(truckRate) || 0,
      tracktorRate: parseFloat(tracktorRate) || 0,
      combineRate: parseFloat(combineRate) || 0,
    };

    addRatesMutation.mutate(parsedRates, {
      onSuccess: onClose,
      onError: (error) => {
        console.error("Помилка при збереженні тарифів:", error);
      },
    });
  };

  if (isLoading)
    return <Typography sx={{ p: 2 }}>Завантаження тарифів...</Typography>;
  if (isError)
    return <Typography sx={{ p: 2 }}>Помилка при завантаженні тарифів</Typography>;

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          fontSize: 16,
        }}
      >
        Поточна тарифна сітка
        <IconButton onClick={onClose} size="small">
          <CloseIcon fontSize="small" />
        </IconButton>
      </DialogTitle>

      <DialogContent dividers sx={{ px: 2, py: 1.5 }}>
        <Box display="flex" flexDirection="column" gap={1.5}>
          <TextField
            label="Тариф для легкового автомобілю, грн/км"
            type="number"
            fullWidth
            size="small"
            value={carRate}
            onChange={(e) => setCarRate(e.target.value)}
            disabled={isGuest}
          />
          <TextField
            label="Тариф для вантажівки, грн/км"
            type="number"
            fullWidth
            size="small"
            value={truckRate}
            onChange={(e) => setTruckRate(e.target.value)}
            disabled={isGuest}
          />
          <TextField
            label="Тариф для трактора, грн/км"
            type="number"
            fullWidth
            size="small"
            value={tracktorRate}
            onChange={(e) => setTracktorRate(e.target.value)}
            disabled={isGuest}
          />
          <TextField
            label="Тариф для комбайна, грн/км"
            type="number"
            fullWidth
            size="small"
            value={combineRate}
            onChange={(e) => setCombineRate(e.target.value)}
            disabled={isGuest}
          />
        </Box>

        {isGuest && (
          <Typography
            variant="caption"
            color="error"
            sx={{ mt: 1, display: "block" }}
          >
            Ви не маєте прав для редагування тарифів.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
        {isGuest ? (
          <Tooltip title="У вас немає прав на цю дію">
            <span>
              <Button
                variant="contained"
                size="small"
                disabled
                sx={{ textTransform: "none", px: 2, py: 0.7 }}
              >
                Зберегти
              </Button>
            </span>
          </Tooltip>
        ) : (
          <Button
            variant="contained"
            size="small"
            onClick={handleSave}
            sx={{ textTransform: "none", px: 2, py: 0.7 }}
            disabled={addRatesMutation.isLoading}
          >
            Зберегти
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
}
