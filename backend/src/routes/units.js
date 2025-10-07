import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема та модель для "ділянок"
const unitSchema = new mongoose.Schema({
    type: { type: String },
    geometry: {
        type: { type: String },
        coordinates: Array,
    },
    id: { type: Number },
    properties: {
        name: { type: String },
        branch: { type: String },
        color: { type: String },
        opacity: { type: String },
        area: { type: String },
        mapkey: { type: String },
        radius: { type: String }, // для точкових обʼєктів
    },
}, { collection: 'units' }); // Якщо хочеш явно вказати колекцію

const Unit = mongoose.models.Unit || mongoose.model('Unit', unitSchema);

// Отримати всі ділянки
router.get('/', async (req, res) => {
    try {
        const units = await Unit.find();
        res.status(200).json(units);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні ділянок', error: error.message });
    }
});

// Додати одну або багато ділянок
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            await Unit.insertMany(data);
        } else {
            await new Unit(data).save();
        }
        res.status(201).json({ message: 'Ділянка(и) успішно збережено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при збереженні ділянок', error: error.message });
    }
});

// Оновити ділянку за ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedUnit = await Unit.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedUnit) {
            return res.status(404).json({ message: 'Ділянку не знайдено' });
        }
        res.status(200).json(updatedUnit);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні ділянки', error: error.message });
    }
});

// Видалити ділянку за ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Unit.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Ділянку не знайдено' });
        }
        res.status(200).json({ message: 'Ділянку видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
    }
});

export default router;
