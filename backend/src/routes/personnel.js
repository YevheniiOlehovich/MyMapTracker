import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

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

// Налаштування multer для завантаження фото персоналу
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '../uploads/personnel';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir, { recursive: true });
        }
        cb(null, dir);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

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
        if (!person) {
            console.warn(`Personnel not found with id: ${req.params.id}`);
            return res.status(404).json({ message: 'Personnel not found' });
        }
        res.json(person);
    } catch (error) {
        console.error(`Error getting personnel ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error getting personnel', error: error.message });
    }
});

// POST - створити нового працівника
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        console.log('POST /personnel');
        console.log('Request body:', req.body);
        if (req.file) {
            console.log('Uploaded file:', req.file.originalname, 'at', req.file.path);
        }

        const { firstName, lastName, contactNumber, note, rfid, function: personnelFunction, groupId  } = req.body;
        if (!firstName || !lastName || !contactNumber) {
            console.warn('Missing required fields in POST /personnel');
            return res.status(400).json({ message: 'First name, last name, and contact number are required' });
        }

        const photoPath = req.file ? req.file.path : null;

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
        console.log('Personnel created:', newPersonnel._id);
        res.status(201).json(newPersonnel);
    } catch (error) {
        console.error('Error creating personnel:', error);
        res.status(500).json({ message: 'Error creating personnel', error: error.message });
    }
});

// PUT - оновити працівника
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        console.log(`PUT /personnel/${req.params.id}`);
        console.log('Request body:', req.body);
        if (req.file) {
            console.log('Uploaded file:', req.file.originalname, 'at', req.file.path);
        }

        const { firstName, lastName, contactNumber, note, rfid, function: personnelFunction, groupId } = req.body;

        // Спочатку знаходимо існуючий запис
        const existingPersonnel = await Personnel.findById(req.params.id);
        if (!existingPersonnel) {
            console.warn(`Personnel not found for update with id: ${req.params.id}`);
            return res.status(404).json({ message: 'Personnel not found' });
        }

        // Якщо нове фото є і старе фото було - видаляємо старий файл
        if (req.file && existingPersonnel.photoPath) {
            try {
                await fs.promises.unlink(path.resolve(existingPersonnel.photoPath));
                console.log('Deleted old photo file:', existingPersonnel.photoPath);
            } catch (err) {
                console.warn('Old photo file deletion error:', err.message);
            }
        }

        // Формуємо дані для оновлення
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
            updateData.photoPath = req.file.path;
        }

        // Оновлюємо запис
        const updatedPersonnel = await Personnel.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        console.log('Personnel updated:', updatedPersonnel._id);
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
        if (!personnel) {
            console.warn(`Personnel not found for deletion with id: ${req.params.id}`);
            return res.status(404).json({ message: 'Personnel not found' });
        }

        if (personnel.photoPath) {
            try {
                await fs.promises.unlink(path.resolve(personnel.photoPath));
                console.log('Deleted photo file:', personnel.photoPath);
            } catch (err) {
                console.warn('Photo file deletion error:', err.message);
            }
        }

        await Personnel.findByIdAndDelete(req.params.id);
        console.log('Personnel deleted:', req.params.id);
        res.json({ message: 'Personnel deleted' });
    } catch (error) {
        console.error(`Error deleting personnel ${req.params.id}:`, error);
        res.status(500).json({ message: 'Error deleting personnel', error: error.message });
    }
});

export default router;