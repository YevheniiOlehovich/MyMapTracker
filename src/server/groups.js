import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Створюємо схему та модель для груп
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownership: { type: String, required: true },
    description: { type: String },
});

const Group = mongoose.model('Group', GroupSchema);

// Отримання всіх груп
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving groups' });
    }
});

// Додавання нової групи
router.post('/', async (req, res) => {
    const { name, ownership, description } = req.body;

    // Перевірка наявності обов'язкових полів
    if (!name || !ownership) {
        return res.status(400).json({ message: 'Name and ownership are required' });
    }

    const newGroup = new Group({ name, ownership, description });

    try {
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: 'Error creating group' });
    }
});

export default router;
