import { useFieldsData } from '../../hooks/useFieldsData';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, IconButton, Typography } from '@mui/material';
import CloseIcon from '@mui/icons-material/Close';

export default function LandBankModal({ onClose }) {
    const { data: fieldsData, isLoading, error } = useFieldsData();

    // Рахуємо загальну площу та розраховану площу
    const totalArea = fieldsData?.reduce((total, field) => total + parseFloat(field.properties.area || 0), 0) || 0;
    const totalCalculatedArea = fieldsData?.reduce((total, field) => total + parseFloat(field.properties.calculated_area || 0), 0) || 0;

    if (isLoading) return <p>Завантаження даних...</p>;
    if (error) return <p>Помилка завантаження даних: {error.message}</p>;

    return (
        <Dialog open onClose={onClose} maxWidth="sm" fullWidth>
            <DialogTitle sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: 16 }}>
                Список полів
                <IconButton onClick={onClose} size="small">
                    <CloseIcon fontSize="small" />
                </IconButton>
            </DialogTitle>

            <DialogContent dividers>
                {fieldsData?.length > 0 ? (
                    fieldsData.map((field, index) => (
                        <div key={index} style={{ marginBottom: 12 }}>
                            <Typography variant="body2"><strong>Назва:</strong> {field.properties.name}</Typography>
                            <Typography variant="body2"><strong>Площа:</strong> {field.properties.area} га</Typography>
                            <Typography variant="body2"><strong>Розрахована площа:</strong> {field.properties.calculated_area} га</Typography>
                            <hr />
                        </div>
                    ))
                ) : (
                    <Typography variant="body2">Немає даних</Typography>
                )}

                {fieldsData?.length > 0 && (
                    <div style={{ marginTop: '16px', fontWeight: 'bold' }}>
                        <Typography variant="body2"><strong>Загальна площа:</strong> {totalArea.toFixed(2)} га</Typography>
                        <Typography variant="body2"><strong>Загальна розрахована площа:</strong> {totalCalculatedArea.toFixed(2)} га</Typography>
                    </div>
                )}
            </DialogContent>

            <DialogActions>
                <Button variant="contained" size="small" onClick={onClose}>Закрити</Button>
            </DialogActions>
        </Dialog>
    );
}
