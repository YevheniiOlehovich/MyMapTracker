import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Створення схеми і моделі для даних полів
const fieldSchema = new mongoose.Schema({
    type: { type: String },
    geometry: {
        type: { type: String },
        coordinates: Array,
    },
    id: { type: Number },
    properties: {
        name: { type: String }, // Додано поле name
        mapkey: { type: String }, // Додано поле mapkey
        area: { type: String }, // Додано поле area
        koatuu: { type: String },
        note: { type: String },
        culture: { type: String },
        sort: { type: String },
        date: { type: String },
        crop: { type: String },
        branch: { type: String },
        region: { type: String },
        calculated_area: { type: Number }, // Додано поле calculated_area
    },
    matching_plots: [
        {
            type: { type: String },
            geometry: {
                type: { type: String },
                coordinates: Array,
            },
            id: { type: Number },
            properties: {
                uid: { type: String },
                area: { type: String },
                name: { type: String },
            },
        },
    ],
    not_processed: [
        {
            type: { type: String },
            geometry: {
                type: { type: String },
                coordinates: Array,
            },
            id: { type: Number },
            properties: {
                uid: { type: String },
                area: { type: String },
                name: { type: String },
            },
        },
    ],
});

const Field = mongoose.models.Field || mongoose.model('Field', fieldSchema);

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

const Cadastre = mongoose.models.Cadastre || mongoose.model('Cadastre', cadastreSchema);

// Створення схеми і моделі для даних геозон
const geozoneSchema = new mongoose.Schema({
    type: String,
    geometry: {
        type: { type: String },
        coordinates: Array,
    },
    id: Number,
    properties: {
        name: String,
        branch: String,
        color: String,
        opacity: String,
        area: String,
        mapkey: String,
    },
});

const Geozone = mongoose.models.Geozone || mongoose.model('Geozone', geozoneSchema);

// Маршрут для отримання всіх полів
router.get('/fields', async (req, res) => {
    try {
        const fields = await Field.find();
        res.status(200).json(fields);
    } catch (error) {
        res.status(500).send('Error fetching fields: ' + error.message);
    }
});

// Маршрут для оновлення даних про поле
router.put('/fields/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const updatedField = await Field.findByIdAndUpdate(
            id,
            req.body,
            { new: true, runValidators: true }
        );
        if (!updatedField) {
            return res.status(404).json({ message: 'Поле не знайдено' });
        }
        res.json(updatedField);
    } catch (error) {
        res.status(500).json({ message: 'Помилка сервера', error });
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

// Маршрут для збереження даних геозон
router.post('/geozone', async (req, res) => {
    try {
        const geozoneData = req.body;
        await Geozone.insertMany(geozoneData);
        res.status(201).send('Geozone data saved successfully');
    } catch (error) {
        res.status(500).send('Error saving geozone data: ' + error.message);
    }
});

// Маршрут для отримання всіх даних геозон
router.get('/geozone', async (req, res) => {
    try {
        const geozoneData = await Geozone.find();
        res.status(200).json(geozoneData);
    } catch (error) {
        res.status(500).send('Error fetching geozone data: ' + error.message);
    }
});

export default router;