import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Імпорти роутів
import groupsRoutes from './routes/groups.js';
import personnelRoutes from './routes/personnel.js';
import vehiclesRoutes from './routes/vehicles.js';
import techniquesRoutes from './routes/technique.js';
import gpsRoutes from './routes/gpsRoutes.js';
import ratesRoutes from './routes/rates.js';
import geoDataRoutes from './routes/geoDataRoutes.js';
import operationRoutes from './routes/operation.js';
import cropsRoutes from './routes/crop.js';
import varietyRoutes from './routes/variety.js';
import unitsRoutes from './routes/units.js';
import rentRoutes from './routes/rent.js';
import propertyRoutes from './routes/property.js';
import taskRoutes from './routes/taskRoutes.js';
import authRoutes from './routes/auth.js';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

// Підключення до MongoDB
// const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

// const mongoURI = 'mongodb://localhost:27018/test' //Локал

const mongoURI = `mongodb://mongo:27017/test` //Прод

mongoose.connect(mongoURI)
    .then(() => console.log('✅ Підключено до MongoDB'))
    .catch((err) => console.error('❌ Помилка підключення до MongoDB:', err));

// Middleware
app.use(cors());
app.use(express.json());
app.use(bodyParser.json());

// Для роздачі статичних файлів з папки uploads
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
app.use('/uploads', express.static(path.join(__dirname, '../../uploads')));


// Використання роутів
app.use('/groups', groupsRoutes);
app.use('/personnel', personnelRoutes);
app.use('/vehicles', vehiclesRoutes);
app.use('/techniques', techniquesRoutes);
app.use('/', gpsRoutes);
app.use('/rates', ratesRoutes);
app.use('/geo_data', geoDataRoutes);
app.use('/auth', authRoutes);
app.use('/operations', operationRoutes);
app.use('/crops', cropsRoutes);
app.use('/varieties', varietyRoutes);
app.use('/units', unitsRoutes);
app.use('/rent', rentRoutes);
app.use('/property', propertyRoutes);
app.use('/tasks', taskRoutes);

// Головний маршрут
app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`🚀 Сервер запущено на порті ${port}`);
});
