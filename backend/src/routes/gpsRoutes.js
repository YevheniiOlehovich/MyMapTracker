// import express from 'express';
// import mongoose from 'mongoose';

// const router = express.Router();

// // Базова схема GPS даних
// const AvlRecordSchema = new mongoose.Schema({
//   imei: String,
//   timestamp: Date,
//   longitude: Number,
//   latitude: Number,
//   altitude: Number,
//   angle: Number,
//   satellites: Number,
//   speed: Number
// }, { strict: false });

// // Отримуємо модель з динамічною колекцією
// const getCollectionModel = (collectionName) => {
//   return mongoose.models[collectionName] 
//     || mongoose.model(collectionName, AvlRecordSchema, collectionName);
// };

// router.get('/:collection', async (req, res) => {
//   try {
//     const { collection } = req.params;
//     const Model = getCollectionModel(collection);

//     // Перевіримо наявність колекції в БД
//     const collections = await mongoose.connection.db.listCollections().toArray();
//     const data = await Model.find().sort({ timestamp: 1 });

//     res.json(data);

//   } catch (error) {
//     console.error('❌ Помилка отримання GPS даних:', error);
//     res.status(500).json({ message: 'Error retrieving GPS data' });
//   }
// });

// export default router;


import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Схема GPS документів
const AvlRecordSchema = new mongoose.Schema({}, { strict: false });

// Функція для отримання моделі динамічної колекції
const getCollectionModel = (collectionName) => {
  return mongoose.models[collectionName] 
    || mongoose.model(collectionName, AvlRecordSchema, collectionName);
};

// Динамічний маршрут: /trek_2025?date=YYYY-MM-DD
router.get('/trek_:year', async (req, res) => {
  try {
    const { year } = req.params;
    const { date } = req.query;

    if (!date) return res.status(400).json({ message: 'Date query parameter is required' });

    const collectionName = `trek_${year}`;
    const Model = getCollectionModel(collectionName);

    // Перевірка наявності колекції
    const collections = await mongoose.connection.db.listCollections({ name: collectionName }).toArray();
    if (collections.length === 0) return res.status(404).json({ message: `Collection ${collectionName} not found` });

    // Знаходимо всі документи за date
    const docs = await Model.find({ date });
    if (!docs || docs.length === 0) return res.status(404).json({ message: `No data for date ${date}` });

    // Повертаємо масив документів
    res.json(docs);

  } catch (error) {
    console.error('❌ Помилка отримання GPS даних:', error);
    res.status(500).json({ message: 'Error retrieving GPS data' });
  }
});

export default router;
