import express from 'express';
import mongoose from 'mongoose';

const router = express.Router(); // Створюємо екземпляр маршруту

// Схема для GPS даних (AVL записи)
const AvlRecordSchema = new mongoose.Schema({
    imei: { type: String },
    timestamp: { type: Date },
    longitude: { type: Number },
    latitude: { type: Number },
    altitude: { type: Number },
    angle: { type: Number },
    satellites: { type: Number },
    speed: { type: Number }
});

// Створення моделі для авл записів
export const AvlRecord = mongoose.model('avl_records', AvlRecordSchema); // Змінили назву колекції

// Маршрут для отримання всіх AVL записів
router.get('/', async (req, res) => {
    try {
        const all_avl_records = await AvlRecord.find();  // Використовуємо правильну модель
        res.json(all_avl_records);  // Відправляємо дані клієнту
    } catch (error) {
        console.error('Помилка при отриманні AVL записів:', error);  // Логування помилки
        res.status(500).json({ message: 'Error retrieving AVL records' });
    }
});

export default router;
