import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема та модель для "орендованих ділянок"
const rentSchema = new mongoose.Schema({
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
        radius: { type: String },
    },
}, { collection: 'rent' }); // Вказуємо назву колекції rent

const Rent = mongoose.models.Rent || mongoose.model('Rent', rentSchema);

// GET: Отримати всі орендовані ділянки
router.get('/', async (req, res) => {
    try {
        const rents = await Rent.find();
        res.status(200).json(rents);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні орендованих ділянок', error: error.message });
    }
});

// POST: Додати одну або багато орендованих ділянок
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            await Rent.insertMany(data);
        } else {
            await new Rent(data).save();
        }
        res.status(201).json({ message: 'Орендовану ділянку(и) успішно збережено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при збереженні орендованих ділянок', error: error.message });
    }
});

// PUT: Оновити орендовану ділянку за ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedRent = await Rent.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedRent) {
            return res.status(404).json({ message: 'Орендовану ділянку не знайдено' });
        }
        res.status(200).json(updatedRent);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні орендованої ділянки', error: error.message });
    }
});

// DELETE: Видалити орендовану ділянку за ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Rent.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Орендовану ділянку не знайдено' });
        }
        res.status(200).json({ message: 'Орендовану ділянку видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
    }
});

export default router;
