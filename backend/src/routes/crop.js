import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема культури
const CropSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
});

export const Crop = mongoose.model('Crop', CropSchema);

// Отримання всіх культур
router.get('/', async (req, res) => {
    try {
        const crops = await Crop.find();
        res.json(crops);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні культур' });
    }
});

// Створення нової культури
router.post('/', async (req, res) => {
    const { name, description } = req.body;

    if (!name) {
        return res.status(400).json({ message: 'Назва культури обовʼязкова' });
    }

    const newCrop = new Crop({ name, description });

    try {
        await newCrop.save();
        res.status(201).json(newCrop);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при створенні культури' });
    }
});

// Оновлення культури
router.put('/:id', async (req, res) => {
    const { name, description } = req.body;

    try {
        const crop = await Crop.findByIdAndUpdate(
            req.params.id,
            { name, description },
            { new: true, runValidators: true }
        );

        if (!crop) {
            return res.status(404).json({ message: 'Культуру не знайдено' });
        }

        res.status(200).json(crop);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при оновленні культури', error: error.message });
    }
});

// Видалення культури
router.delete('/:id', async (req, res) => {
    try {
        const crop = await Crop.findByIdAndDelete(req.params.id);

        if (!crop) {
            return res.status(404).json({ message: 'Культуру не знайдено' });
        }

        res.status(200).json({ message: 'Культуру успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні культури' });
    }
});

export default router;
