import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import fieldsRoutes from './fields.js';
import groupsRoutes from './groups.js';
import {userName, userPass} from '../helpres/index.js'

// Створюємо новий додаток Express
const app = express();
const port = process.env.PORT || 5000;

// Підключення до MongoDB
const mongoURI = `mongodb+srv://${userName}:${userPass}@cluster0.k4l1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI)
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB:', err);
    });

// Middlewares
app.use(cors());
app.use(bodyParser.json());

// Використання маршрутов для полів та груп
app.use('/fields', fieldsRoutes);
app.use('/groups', groupsRoutes);

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
