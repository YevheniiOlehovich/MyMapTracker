import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Спрощена схема групи без вкладених даних
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownership: { type: String, required: true },
    description: { type: String },
});

export const Group = mongoose.model('Group', GroupSchema);

// Отримання всіх груп
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Помилка при отриманні груп' });
    }
});

// Створення нової групи
router.post('/', async (req, res) => {
    const { name, ownership, description } = req.body;

    if (!name || !ownership) {
        return res.status(400).json({ message: 'Назва і тип власності обовʼязкові' });
    }

    const newGroup = new Group({ name, ownership, description });

    try {
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при створенні групи' });
    }
});

// Оновлення групи
router.put('/:id', async (req, res) => {
    const { name, ownership, description } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { name, ownership, description },
            { new: true, runValidators: true }
        );

        if (!group) {
            return res.status(404).json({ message: 'Групу не знайдено' });
        }

        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ message: 'Помилка при оновленні групи', error: error.message });
    }
});

// Видалення групи
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Групу не знайдено' });
        }

        res.status(200).json({ message: 'Групу успішно видалено' });
    } catch (error) {
        res.status(500).json({ message: 'Помилка при видаленні групи' });
    }
});

export default router;
