import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема сорту культури
const VarietySchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

export const Variety = mongoose.model('Variety', VarietySchema);

// Отримання всіх сортів
router.get('/', async (req, res) => {
    try {
        const varieties = await Variety.find();
        res.json(varieties);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні сортів культур' });
    }
});

// Створення нового сорту
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Назва сорту культури обовʼязкова' });
    }

    const newVariety = new Variety({ name, description });

    try {
        await newVariety.save();
        res.status(201).json(newVariety);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при створенні сорту культури' });
    }
});

// Оновлення сорту
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const variety = await Variety.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!variety) {
            return res.status(404).json({ message: 'Сорт культури не знайдено' });
        }

        res.status(200).json(variety);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при оновленні сорту культури', error: error.message });
    }
});

// Видалення сорту
router.delete('/:id', async (req, res) => {
    try {
        const variety = await Variety.findByIdAndDelete(req.params.id);

        if (!variety) {
            return res.status(404).json({ message: 'Сорт культури не знайдено' });
        }

        res.status(200).json({ message: 'Сорт культури успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні сорту культури' });
    }
});

export default router;
