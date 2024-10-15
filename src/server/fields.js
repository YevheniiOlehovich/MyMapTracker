import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Створюємо схему та модель для полів
const FieldSchema = new mongoose.Schema({
    name: String,
    location: String,
    size: Number,
});

const Field = mongoose.model('Field', FieldSchema);

// Отримання всіх полів
router.get('/', async (req, res) => {
    try {
        const fields = await Field.find();
        res.json(fields);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving fields' });
    }
});

// Додавання нового поля
router.post('/', async (req, res) => {
    try {
        const newField = new Field(req.body);
        await newField.save();
        res.status(201).json(newField);
    } catch (error) {
        res.status(400).json({ message: 'Error creating field' });
    }
});

export default router;
