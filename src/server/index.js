// import express from 'express';
// import mongoose from 'mongoose';
// import cors from 'cors';
// import bodyParser from 'body-parser';
// // import fieldsRoutes from './fields.js';
// import groupsRoutes from './groups.js';
// import {userName, userPass} from '../helpres/index.js'

// // Створюємо новий додаток Express
// const app = express();
// const port = process.env.PORT || 5000;

// // Підключення до MongoDB
// const mongoURI = `mongodb+srv://${userName}:${userPass}@cluster0.k4l1p.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`;

// mongoose.connect(mongoURI)
//     .then(() => {
//         console.log('Connected to MongoDB');
//     })
//     .catch((err) => {
//         console.error('Error connecting to MongoDB:', err);
//     });

// // Middlewares
// app.use(cors());
// app.use(bodyParser.json());

// // Використання маршрутов для полів та груп
// // app.use('/fields', fieldsRoutes);
// app.use('/groups', groupsRoutes);

// // Запуск сервера
// app.listen(port, () => {
//     console.log(`Server is running on port ${port}`);
// });


import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv'; // Для зручної роботи з конфігураціями
import groupsRoutes from './routes/groups.js';
// import personalRoutes from './routes/personnel.js'

// Завантаження конфігурацій з .env
dotenv.config();

// Створюємо новий додаток Express
const app = express();
const port = process.env.PORT || 5000;

// Підключення до MongoDB
const mongoURI = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@${process.env.DB_CLUSTER}/?retryWrites=true&w=majority&appName=Cluster0`;

mongoose.connect(mongoURI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch((err) => console.error('Error connecting to MongoDB:', err));

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Використання роутів
app.use('/groups', groupsRoutes);
// app.use('/groups', personalRoutes);

// Головний маршрут для перевірки сервера
app.get('/', (req, res) => {
    res.send('Сервер працює!');
});

// Обробка помилок
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send('Щось пішло не так!');
});

// Запуск сервера
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
