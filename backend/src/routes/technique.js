
// import express from 'express';
// import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';
// import { fileURLToPath } from 'url';

// const router = express.Router();

// // Отримуємо __dirname для ESM
// const __filename = fileURLToPath(import.meta.url);
// const __dirname = path.dirname(__filename);

// // 📦 Схема техніки
// const TechniqueSchema = new mongoose.Schema({
//     name: { type: String, required: true },
//     rfid: { type: String, required: true },
//     uniqNum: { type: String },
//     width: { type: Number },
//     speed: { type: Number },
//     note: { type: String },
//     fieldOperation: { type: String },
//     photoPath: { type: String },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
// }, { timestamps: true });

// const Technique = mongoose.model('Technique', TechniqueSchema);

// // 📁 Multer для фото
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = path.join(__dirname, '../../uploads/techniques');
//         if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
// });
// const upload = multer({ storage });

// /* -------------------------------------------------------------------------- */
// /*                              📍 GET всі техніки                              */
// /* -------------------------------------------------------------------------- */
// router.get('/', async (req, res) => {
//     try {
//         const filter = req.query.groupId ? { groupId: req.query.groupId } : {};
//         const techniques = await Technique.find(filter);
//         res.json(techniques);
//     } catch (error) {
//         console.error('[ERROR] Getting techniques:', error.message);
//         res.status(500).json({ message: 'Error getting techniques', error: error.message });
//     }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 GET по ID                                     */
// /* -------------------------------------------------------------------------- */
// router.get('/:id', async (req, res) => {
//     try {
//         const technique = await Technique.findById(req.params.id);
//         if (!technique) return res.status(404).json({ message: 'Technique not found' });
//         res.json(technique);
//     } catch (error) {
//         console.error('[ERROR] Getting technique by ID:', error.message);
//         res.status(500).json({ message: 'Error getting technique', error: error.message });
//     }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 POST створення                               */
// /* -------------------------------------------------------------------------- */
// router.post('/', upload.single('photo'), async (req, res) => {
//     try {
//         const { name, rfid, uniqNum, width, speed, note, fieldOperation, groupId } = req.body;
//         if (!name || !rfid || !groupId) {
//             return res.status(400).json({ message: 'Name, RFID, and groupId are required.' });
//         }

//         const photoPath = req.file ? req.file.path : null;
//         const newTechnique = new Technique({ name, rfid, uniqNum, width, speed, note, fieldOperation, photoPath, groupId });

//         await newTechnique.save();
//         res.status(201).json(newTechnique);
//     } catch (error) {
//         console.error('[ERROR] Creating technique:', error.message);
//         res.status(500).json({ message: 'Error creating technique', error: error.message });
//     }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 PUT оновлення                                 */
// /* -------------------------------------------------------------------------- */
// router.put('/:id', upload.single('photo'), async (req, res) => {
//     try {
//         const technique = await Technique.findById(req.params.id);
//         if (!technique) return res.status(404).json({ message: 'Technique not found' });

//         // 🧹 Видалити старе фото, якщо нове завантажено
//         if (req.file && technique.photoPath) {
//             try {
//                 await fs.promises.unlink(path.resolve(technique.photoPath));
//             } catch (err) {
//                 console.warn('[WARN] Error deleting old photo:', err.message);
//             }
//         }

//         // Оновлюємо поля
//         const fields = ['name', 'rfid', 'uniqNum', 'width', 'speed', 'note', 'fieldOperation', 'groupId'];
//         fields.forEach(field => {
//             if (req.body[field] !== undefined) technique[field] = req.body[field];
//         });

//         if (req.file) technique.photoPath = req.file.path;

//         await technique.save();
//         res.json(technique);
//     } catch (error) {
//         console.error('[ERROR] Updating technique:', error.message);
//         res.status(500).json({ message: 'Error updating technique', error: error.message });
//     }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 DELETE                                         */
// /* -------------------------------------------------------------------------- */
// router.delete('/:id', async (req, res) => {
//     try {
//         const technique = await Technique.findById(req.params.id);
//         if (!technique) return res.status(404).json({ message: 'Technique not found' });

//         if (technique.photoPath) {
//             try {
//                 await fs.promises.unlink(path.resolve(technique.photoPath));
//             } catch (err) {
//                 console.warn('[WARN] Error deleting photo:', err.message);
//             }
//         }

//         await Technique.findByIdAndDelete(req.params.id);
//         res.json({ message: 'Technique deleted' });
//     } catch (error) {
//         console.error('[ERROR] Deleting technique:', error.message);
//         res.status(500).json({ message: 'Error deleting technique', error: error.message });
//     }
// });

// export default router;




import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// В ESM потрібно визначити __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до зовнішньої папки uploads для техніки
const UPLOADS_DIR = '/app/uploads/techniques';

// Створюємо папку, якщо не існує
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Налаштування multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Схема техніки
const TechniqueSchema = new mongoose.Schema({
    name: { type: String, required: true },
    rfid: { type: String, required: true },
    uniqNum: { type: String },
    width: { type: Number },
    speed: { type: Number },
    note: { type: String },
    fieldOperation: { type: String },
    photoPath: { type: String },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
}, { timestamps: true });

const Technique = mongoose.model('Technique', TechniqueSchema);

// GET всі техніки
router.get('/', async (req, res) => {
    try {
        console.log('GET /techniques');
        const filter = req.query.groupId ? { groupId: req.query.groupId } : {};
        const techniques = await Technique.find(filter);
        res.json(techniques);
    } catch (error) {
        console.error('Error getting techniques:', error);
        res.status(500).json({ message: 'Error getting techniques', error: error.message });
    }
});

// GET техніки по ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`GET /techniques/${req.params.id}`);
        const technique = await Technique.findById(req.params.id);
        if (!technique) return res.status(404).json({ message: 'Technique not found' });
        res.json(technique);
    } catch (error) {
        console.error(`Error getting technique ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error getting technique', error: error.message });
    }
});

// POST створення
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /techniques', req.body);

        const { name, rfid, uniqNum, width, speed, note, fieldOperation, groupId } = req.body;
        if (!name || !rfid || !groupId) {
            return res.status(400).json({ message: 'Name, RFID, and groupId are required' });
        }

        const photoPath = req.file ? path.join('uploads/techniques', req.file.filename) : null;

        const newTechnique = new Technique({
            name,
            rfid,
            uniqNum,
            width,
            speed,
            note,
            fieldOperation,
            photoPath,
            groupId,
        });

        await newTechnique.save();
        res.status(201).json(newTechnique);
    } catch (error) {
        console.error('Error creating technique:', error);
        res.status(500).json({ message: 'Error creating technique', error: error.message });
    }
});

// PUT оновлення
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        console.log(`PUT /techniques/${req.params.id}`, req.body);

        const { name, rfid, uniqNum, width, speed, note, fieldOperation, groupId } = req.body;

        const existingTechnique = await Technique.findById(req.params.id);
        if (!existingTechnique) return res.status(404).json({ message: 'Technique not found' });

        // Видалення старого фото, якщо є нове
        if (req.file && existingTechnique.photoPath) {
            const oldPath = path.join(__dirname, '../../../', existingTechnique.photoPath);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const updateData = { name, rfid, uniqNum, width, speed, note, fieldOperation, groupId };
        if (req.file) updateData.photoPath = path.join('uploads/techniques', req.file.filename);

        const updatedTechnique = await Technique.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedTechnique);
    } catch (error) {
        console.error(`Error updating technique ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error updating technique', error: error.message });
    }
});

// DELETE видалення
router.delete('/:id', async (req, res) => {
    try {
        console.log(`DELETE /techniques/${req.params.id}`);

        const technique = await Technique.findById(req.params.id);
        if (!technique) return res.status(404).json({ message: 'Technique not found' });

        if (technique.photoPath) {
            const filePath = path.join(__dirname, '../../../', technique.photoPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Technique.findByIdAndDelete(req.params.id);
        res.json({ message: 'Technique deleted' });
    } catch (error) {
        console.error(`Error deleting technique ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting technique', error: error.message });
    }
});

export default router;
