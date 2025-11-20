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

// Шлях до зовнішньої папки uploads (з Docker volume)
const UPLOADS_DIR = '/app/uploads/personnel';

// Створюємо папку, якщо не існує
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Налаштування multer для завантаження фото персоналу
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// Схема персоналу
const PersonnelSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: true },
    contactNumber: { type: String, required: true },
    note: { type: String },
    photoPath: { type: String },
    rfid: { type: String },
    function: { type: String },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
}, { timestamps: true });

const Personnel = mongoose.model('Personnel', PersonnelSchema);

// GET всі працівники
router.get('/', async (req, res) => {
    try {
        console.log('GET /personnel');
        const personnel = await Personnel.find();
        res.json(personnel);
    } catch (error) {
        console.error('Error getting personnel:', error);
        res.status(500).json({ message: 'Error getting personnel', error: error.message });
    }
});

// GET працівника по ID
router.get('/:id', async (req, res) => {
    try {
        console.log(`GET /personnel/${req.params.id}`);
        const person = await Personnel.findById(req.params.id);
        if (!person) return res.status(404).json({ message: 'Personnel not found' });
        res.json(person);
    } catch (error) {
        console.error(`Error getting personnel ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error getting personnel', error: error.message });
    }
});

// POST - створити нового працівника
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /personnel', req.body);

        const { firstName, lastName, contactNumber, note, rfid, function: personnelFunction, groupId } = req.body;
        if (!firstName || !lastName || !contactNumber) {
            return res.status(400).json({ message: 'First name, last name, and contact number are required' });
        }

        const photoPath = req.file ? path.join('uploads/personnel', req.file.filename) : null;

        const newPersonnel = new Personnel({
            firstName,
            lastName,
            contactNumber,
            note,
            rfid,
            function: personnelFunction,
            photoPath,
            groupId,
        });

        await newPersonnel.save();
        res.status(201).json(newPersonnel);
    } catch (error) {
        console.error('Error creating personnel:', error);
        res.status(500).json({ message: 'Error creating personnel', error: error.message });
    }
});

// PUT - оновити працівника
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        console.log(`PUT /personnel/${req.params.id}`, req.body);

        const { firstName, lastName, contactNumber, note, rfid, function: personnelFunction, groupId } = req.body;

        const existingPersonnel = await Personnel.findById(req.params.id);
        if (!existingPersonnel) return res.status(404).json({ message: 'Personnel not found' });

        // Видалення старого фото, якщо є нове
        if (req.file && existingPersonnel.photoPath) {
            const oldPath = path.join(__dirname, '../../../', existingPersonnel.photoPath);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const updateData = {
            firstName,
            lastName,
            contactNumber,
            note,
            rfid,
            function: personnelFunction,
            groupId,
        };

        if (req.file) {
            updateData.photoPath = path.join('uploads/personnel', req.file.filename);
        }

        const updatedPersonnel = await Personnel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedPersonnel);
    } catch (error) {
        console.error(`Error updating personnel ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error updating personnel', error: error.message });
    }
});

// DELETE - видалити працівника і файл фото
router.delete('/:id', async (req, res) => {
    try {
        console.log(`DELETE /personnel/${req.params.id}`);

        const personnel = await Personnel.findById(req.params.id);
        if (!personnel) return res.status(404).json({ message: 'Personnel not found' });

        if (personnel.photoPath) {
            const filePath = path.join(__dirname, '../../../', personnel.photoPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Personnel.findByIdAndDelete(req.params.id);
        res.json({ message: 'Personnel deleted' });
    } catch (error) {
        console.error(`Error deleting personnel ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting personnel', error: error.message });
    }
});

export default router;
