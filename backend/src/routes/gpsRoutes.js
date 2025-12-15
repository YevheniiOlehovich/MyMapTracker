import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

/**
 * Схема без strict — бо AVL пакети різні
 */
const AvlRecordSchema = new mongoose.Schema({}, { strict: false });

/**
 * Отримання моделі динамічної колекції
 */
const getCollectionModel = (collectionName) => {
  return (
    mongoose.models[collectionName] ||
    mongoose.model(collectionName, AvlRecordSchema, collectionName)
  );
};

/**
 * ============================================
 * GET /trek_2025/last?date=YYYY-MM-DD
 * → остання валідна GPS точка по кожному IMEI
 * ============================================
 */
router.get('/trek_:year/last', async (req, res) => {
  try {
    const { year } = req.params;
    const { date } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }

    const collectionName = `trek_${year}`;
    const Model = getCollectionModel(collectionName);

    const collections = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (!collections.length) {
      return res.status(404).json({ message: `Collection ${collectionName} not found` });
    }

    const docs = await Model.find(
      { date },
      { imei: 1, date: 1, data: { $slice: -1 } }
    ).lean();

    const result = docs
      .filter(
        d =>
          d.data &&
          d.data.length &&
          d.data[0].latitude !== 0 &&
          d.data[0].longitude !== 0
      )
      .map(d => ({
        imei: d.imei,
        date: d.date,
        ...d.data[0],
      }));

    res.json(result);
  } catch (error) {
    console.error('❌ Error retrieving last GPS points:', error);
    res.status(500).json({ message: 'Error retrieving last GPS points' });
  }
});

/**
 * =========================================================
 * GET /trek_2025?date=YYYY-MM-DD
 * GET /trek_2025?date=YYYY-MM-DD&imei=XXX
 * → всі точки за день або по конкретному IMEI
 * =========================================================
 */
router.get('/trek_:year', async (req, res) => {
  try {
    const { year } = req.params;
    const { date, imei } = req.query;

    if (!date) {
      return res.status(400).json({ message: 'Date query parameter is required' });
    }

    const collectionName = `trek_${year}`;
    const Model = getCollectionModel(collectionName);

    const collections = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (!collections.length) {
      return res.status(404).json({ message: `Collection ${collectionName} not found` });
    }

    const query = { date };
    if (imei) query.imei = imei;

    const docs = await Model.find(query);

    if (!docs.length) {
      return res.status(404).json({ message: 'No GPS data found' });
    }

    res.json(docs);
  } catch (error) {
    console.error('❌ Error retrieving GPS data:', error);
    res.status(500).json({ message: 'Error retrieving GPS data' });
  }
});




/**
 * =========================================================
 * GET /trek_2025/month?month=YYYY-MM&imei=XXX
 * → всі GPS точки за місяць (опційно по IMEI)
 * =========================================================
 */
router.get('/trek_:year/month', async (req, res) => {
  try {
    const { year } = req.params;
    const { month, imei } = req.query;

    if (!month) {
      return res.status(400).json({ message: 'month query parameter is required (YYYY-MM)' });
    }

    const collectionName = `trek_${year}`;
    const Model = getCollectionModel(collectionName);

    const collections = await mongoose.connection.db
      .listCollections({ name: collectionName })
      .toArray();

    if (!collections.length) {
      return res.status(404).json({ message: `Collection ${collectionName} not found` });
    }

    const startDate = `${month}-01`;
    const endDate = `${month}-31`; // ок для строкового порівняння YYYY-MM-DD

    const query = {
      date: { $gte: startDate, $lte: endDate },
    };

    if (imei) query.imei = imei;

    const docs = await Model.find(query).lean();

    if (!docs.length) {
      return res.status(404).json({ message: 'No GPS data found for this month' });
    }

    res.json(docs);
  } catch (error) {
    console.error('❌ Error retrieving monthly GPS data:', error);
    res.status(500).json({ message: 'Error retrieving monthly GPS data' });
  }
});



export default router;