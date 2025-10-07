import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема та модель для "ділянок у власності"
const propertySchema = new mongoose.Schema({
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
}, { collection: 'property' }); // Вказуємо назву колекції property

const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// GET: Отримати всі ділянки у власності
router.get('/', async (req, res) => {
    try {
        const properties = await Property.find();
        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні ділянок у власності', error: error.message });
    }
});

// POST: Додати одну або багато ділянок у власності
router.post('/', async (req, res) => {
    try {
        const data = req.body;
        if (Array.isArray(data)) {
            await Property.insertMany(data);
        } else {
            await new Property(data).save();
        }
        res.status(201).json({ message: 'Ділянку(и) у власності успішно збережено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при збереженні ділянок у власності', error: error.message });
    }
});

// PUT: Оновити ділянку у власності за ID
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!updatedProperty) {
            return res.status(404).json({ message: 'Ділянку у власності не знайдено' });
        }
        res.status(200).json(updatedProperty);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при оновленні ділянки у власності', error: error.message });
    }
});

// DELETE: Видалити ділянку у власності за ID
router.delete('/:id', async (req, res) => {
    try {
        const deleted = await Property.findByIdAndDelete(req.params.id);
        if (!deleted) {
            return res.status(404).json({ message: 'Ділянку у власності не знайдено' });
        }
        res.status(200).json({ message: 'Ділянку у власності видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
    }
});

export default router;
