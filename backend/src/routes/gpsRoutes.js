import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Базова схема GPS даних
const AvlRecordSchema = new mongoose.Schema({
  imei: String,
  timestamp: Date,
  longitude: Number,
  latitude: Number,
  altitude: Number,
  angle: Number,
  satellites: Number,
  speed: Number
}, { strict: false });

// Отримуємо модель з динамічною колекцією
const getCollectionModel = (collectionName) => {
  return mongoose.models[collectionName] 
    || mongoose.model(collectionName, AvlRecordSchema, collectionName);
};

router.get('/:collection', async (req, res) => {
  try {
    const { collection } = req.params;
    const Model = getCollectionModel(collection);

    // Перевіримо наявність колекції в БД
    const collections = await mongoose.connection.db.listCollections().toArray();
    const data = await Model.find().sort({ timestamp: 1 });

    res.json(data);

  } catch (error) {
    console.error('❌ Помилка отримання GPS даних:', error);
    res.status(500).json({ message: 'Error retrieving GPS data' });
  }
});

export default router;
