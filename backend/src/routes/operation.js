import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема технологічної операції
const OperationSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

export const Operation = mongoose.model('Operation', OperationSchema);

// Отримання всіх операцій
router.get('/', async (req, res) => {
    try {
        const operations = await Operation.find();
        res.json(operations);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні операцій' });
    }
});

// Створення нової операції
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Назва операції обовʼязкова' });
    }

    const newOperation = new Operation({ name, description });

    try {
        await newOperation.save();
        res.status(201).json(newOperation);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при створенні операції' });
    }
});

// Оновлення операції
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const operation = await Operation.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!operation) {
            return res.status(404).json({ message: 'Операцію не знайдено' });
        }

        res.status(200).json(operation);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при оновленні операції', error: error.message });
    }
});

// Видалення операції
router.delete('/:id', async (req, res) => {
    try {
        const operation = await Operation.findByIdAndDelete(req.params.id);

        if (!operation) {
            return res.status(404).json({ message: 'Операцію не знайдено' });
        }

        res.status(200).json({ message: 'Операцію успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні операції' });
    }
});

export default router;
