// src/server/routes/rates.js
import express from 'express';
import mongoose from 'mongoose';

// Опис схеми для тарифів
const rateSchema = new mongoose.Schema({
    carRate: { type: Number, required: true },
    truckRate: { type: Number, required: true },
    tracktorRate: { type: Number, required: true },
    combineRate: { type: Number, required: true },
}, { timestamps: true }); // додано timestamps для зручності відстеження часу

// Створення моделі на основі схеми
const Rates = mongoose.model('Rates', rateSchema);

const router = express.Router();

/**
 * @route   POST /api/rates
 * @desc    Додати нові тарифи
 * @access  Public
 */
router.post('/', async (req, res) => {
    try {
        const { carRate, truckRate, tracktorRate, combineRate } = req.body;

        if (!carRate || !truckRate || !tracktorRate || !combineRate) {
            return res.status(400).json({ message: 'Всі поля обов’язкові' });
        }

        const newRates = new Rates({ carRate, truckRate, tracktorRate, combineRate });
        await newRates.save();

        res.status(201).json(newRates);
    } catch (error) {
        console.error('Помилка при збереженні тарифів:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

/**
 * @route   GET /api/rates
 * @desc    Отримати останні тарифи
 * @access  Public
 */
router.get('/', async (req, res) => {
    try {
        const rates = await Rates.find().sort({ createdAt: -1 }).limit(1); // Отримуємо останній запис
        res.status(200).json(rates[0] || {}); // Якщо немає записів, повертаємо пустий об'єкт
    } catch (error) {
        console.error('Помилка при отриманні тарифів:', error);
        res.status(500).json({ message: 'Помилка сервера' });
    }
});

export default router;
