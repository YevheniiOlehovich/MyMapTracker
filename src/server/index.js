import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import groupsRoutes from './routes/groups.js';
import personnelRoutes from './routes/personnel.js'; // Додано маршрут для персоналу
import vehiclesRoutes from './routes/vehicles.js'; // Додано маршрут для техніки
import techniquesRoutes from './routes/technique.js'
import avlRecordsRoutes from './routes/gpsRoutes.js'; // Замість avlRecord
import ratesRoutes from './routes/rates.js'
import geoDataRoutes from './routes/geoDataRoutes.js'; 
import operationRoutes from './routes/operation.js'; // Додано маршрут для технологічних операцій
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Підключення до MongoDB
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Підключено до MongoDB'))
    .catch((err) => console.error('❌ Помилка підключення до MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Використання роутів
app.use('/groups', groupsRoutes);
app.use('/personnel', personnelRoutes); // Додано маршрут для персоналу
app.use('/vehicles', vehiclesRoutes); // Додано маршрут для техніки
app.use('/techniques', techniquesRoutes); // Додано маршрут для техніки
app.use('/avl_records', avlRecordsRoutes);  // Додано маршрут для avl_records
app.use('/rates', ratesRoutes);  // Додано маршрут для avl_records
app.use('/geo_data', geoDataRoutes); // Додано маршрут для полів
app.use('/auth', authRoutes); // Додано маршрут для автентифікації
app.use('/operations', operationRoutes); // Додано маршрут для технологічних операцій

// Головний маршрут
app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущено на порті ${port}`);
});
