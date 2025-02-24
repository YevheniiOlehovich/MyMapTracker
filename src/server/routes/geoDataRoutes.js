import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Створення схеми і моделі для даних полів
const fieldSchema = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String },
        coordinates: Array,
    },
    id: Number,
    properties: {
        name: String,
        mapkey: String,
        area: String,
        koatuu: String,
        note: String,
        culture: String,
        sort: String,
        date: String,
        crop: String,
        branch: String,
        region: String,
    },
});

const Field = mongoose.model('Field', fieldSchema);

// Створення схеми і моделі для даних кадастру
const cadastreSchema = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String },
        coordinates: Array,
    },
    id: Number,
    properties: {
        cadnum: String,
        right: String,
        use: String,
        purpose: String,
        area: String,
    },
});

const Cadastre = mongoose.model('Cadastre', cadastreSchema);

// Маршрут для збереження даних полів
router.post('/fields', async (req, res) => {
    try {
        const fields = req.body;
        await Field.insertMany(fields);
        res.status(201).send('Fields saved successfully');
    } catch (error) {
        res.status(500).send('Error saving fields: ' + error.message);
    }
});

// Маршрут для отримання всіх полів
router.get('/fields', async (req, res) => {
    try {
        const fields = await Field.find();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).send('Error fetching fields: ' + error.message);
    }
});

// Маршрут для збереження даних кадастру
router.post('/cadastre', async (req, res) => {
    try {
        const cadastreData = req.body;
        await Cadastre.insertMany(cadastreData);
        res.status(201).send('Cadastre data saved successfully');
    } catch (error) {
        res.status(500).send('Error saving cadastre data: ' + error.message);
    }
});

// Маршрут для отримання всіх кадастрових даних
router.get('/cadastre', async (req, res) => {
    try {
        const cadastreData = await Cadastre.find();
        res.status(200).json(cadastreData);
    } catch (error) {
        res.status(500).send('Error fetching cadastre data: ' + error.message);
    }
});

export default router;