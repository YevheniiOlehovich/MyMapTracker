// import { useState, useEffect } from 'react';
// import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Typography } from '@mui/material';
// import CloseIcon from '@mui/icons-material/Close';
// import { useRatesData, useAddRates } from '../../hooks/useRatesData';

// export default function AddRatesModal({ onClose }) {
//     const { data: rates, isLoading, isError } = useRatesData();
//     const addRatesMutation = useAddRates();

//     const [carRate, setCarRate] = useState('');
//     const [truckRate, setTruckRate] = useState('');
//     const [tracktorRate, setTracktorRate] = useState('');
//     const [combineRate, setCombineRate] = useState('');

//     useEffect(() => {
//         if (rates) {
//             setCarRate(rates.carRate ?? '');
//             setTruckRate(rates.truckRate ?? '');
//             setTracktorRate(rates.tracktorRate ?? '');
//             setCombineRate(rates.combineRate ?? '');
//         }
//     }, [rates]);

//     const handleSave = () => {
//         const ratesData = {
//             carRate: Number(carRate),
//             truckRate: Number(truckRate),
//             tracktorRate: Number(tracktorRate),
//             combineRate: Number(combineRate),
//         };

//         addRatesMutation.mutate(ratesData, {
//             onSuccess: () => onClose(),
//             onError: (error) => console.error('Помилка при збереженні тарифів:', error),
//         });
//     };

//     if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження тарифів...</Typography>;
//     if (isError) return <Typography sx={{ p: 2 }}>Помилка при завантаженні тарифів</Typography>;

//     return (
//         <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
//             <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
//                 Поточна тарифна сітка
//                 <IconButton onClick={onClose} size="small">
//                     <CloseIcon fontSize="small" />
//                 </IconButton>
//             </DialogTitle>

//             <DialogContent dividers>
//                 <TextField
//                     label="Тариф для легкового автомобілю, грн/км"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="number"
//                     value={carRate}
//                     onChange={(e) => setCarRate(e.target.value)}
//                 />
//                 <TextField
//                     label="Тариф для вантажівки, грн/км"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="number"
//                     value={truckRate}
//                     onChange={(e) => setTruckRate(e.target.value)}
//                 />
//                 <TextField
//                     label="Тариф для трактора, грн/км"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="number"
//                     value={tracktorRate}
//                     onChange={(e) => setTracktorRate(e.target.value)}
//                 />
//                 <TextField
//                     label="Тариф для комбайна, грн/км"
//                     fullWidth
//                     margin="dense"
//                     size="small"
//                     type="number"
//                     value={combineRate}
//                     onChange={(e) => setCombineRate(e.target.value)}
//                 />
//             </DialogContent>

//             <DialogActions>
//                 <Button
//                     variant="contained"
//                     size="small"
//                     onClick={handleSave}
//                     disabled={addRatesMutation.isLoading}
//                 >
//                     Зберегти
//                 </Button>
//             </DialogActions>
//         </Dialog>
//     );
// }








import React, { useState, useEffect } from "react";
import { useSelector } from "react-redux";
import { Dialog, DialogTitle, DialogContent, DialogActions, TextField, Button, IconButton, Box, Tooltip, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { useRatesData, useAddRates } from "../../hooks/useRatesData";

export default function AddRatesModal({ onClose }) {
  const { data: rates, isLoading, isError } = useRatesData();
  const addRatesMutation = useAddRates();

  // ✅ слухаємо роль з Redux
  const role = useSelector((state) => state.user.role);
  const isGuest = role === "guest";

  const [carRate, setCarRate] = useState("");
  const [truckRate, setTruckRate] = useState("");
  const [tracktorRate, setTracktorRate] = useState("");
  const [combineRate, setCombineRate] = useState("");

  useEffect(() => {
    if (rates) {
      setCarRate(rates.carRate ?? "");
      setTruckRate(rates.truckRate ?? "");
      setTracktorRate(rates.tracktorRate ?? "");
      setCombineRate(rates.combineRate ?? "");
    }
  }, [rates]);

  const handleSave = () => {
    if (isGuest) return; // блокування для гостя

    const ratesData = {
      carRate: Number(carRate),
      truckRate: Number(truckRate),
      tracktorRate: Number(tracktorRate),
      combineRate: Number(combineRate),
    };

    addRatesMutation.mutate(ratesData, {
      onSuccess: onClose,
      onError: (error) => console.error("Помилка при збереженні тарифів:", error),
    });
  };

  if (isLoading) return <Typography sx={{ p: 2 }}>Завантаження тарифів...</Typography>;
  if (isError) return <Typography sx={{ p: 2 }}>Помилка при завантаженні тарифів</Typography>;

  return (
    <Dialog open onClose={onClose} maxWidth="xs" fullWidth>
      <DialogTitle sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontSize: 16 }}>
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
          <Typography variant="caption" color="error" sx={{ mt: 1, display: "block" }}>
            Ви не маєте прав для редагування тарифів.
          </Typography>
        )}
      </DialogContent>

      <DialogActions sx={{ justifyContent: "flex-end", px: 2, py: 1 }}>
        <Tooltip title={isGuest ? "У вас немає прав на цю дію" : ""}>
          <span>
            <Button
              variant="contained"
              size="small"
              onClick={handleSave}
              sx={{ textTransform: "none", px: 2, py: 0.7 }}
              disabled={isGuest || addRatesMutation.isLoading}
            >
              Зберегти
            </Button>
          </span>
        </Tooltip>
      </DialogActions>
    </Dialog>
  );
}
