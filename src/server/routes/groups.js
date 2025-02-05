import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';

const router = express.Router();

// Налаштування `multer` для збереження файлів в папку `uploads/personnel`
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

// Налаштування multer для збереження фотографій техніки в окрему папку
const vehicleStorage = multer.diskStorage({
    destination: (req, file, cb) => {
        const dir = '../uploads/vehicles';
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
const vehicleUpload = multer({ storage: vehicleStorage });

const upload = multer({ storage });

// Схема для групи з шляхом до фото в базі даних
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownership: { type: String, required: true },
    description: { type: String },
    personnel: [{
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        note: { type: String },
        photoPath: { type: String }, // Шлях до фото замість Buffer
    }],
    vehicles: [{
        vehicleType: { type: String, required: true },
        regNumber: { type: String, required: true },
        mark: { type: String },
        note: { type: String },
        photoPath: { type: String }, 
        imei: { type: String },
    }],
});

// Створення моделі для групи
export const Group = mongoose.model('Group', GroupSchema);

// Отримання всіх груп
router.get('/', async (req, res) => {
    try {
        const groups = await Group.find();
        res.json(groups);
    } catch (error) {
        res.status(500).json({ message: 'Error retrieving groups' });
    }
});

// Додавання нової групи
router.post('/', async (req, res) => {
    const { name, ownership, description } = req.body;

    if (!name || !ownership) {
        return res.status(400).json({ message: 'Name and ownership are required' });
    }

    const newGroup = new Group({
        name,
        ownership,
        description,
        personnel: [],
        vehicle: [],
    });

    try {
        await newGroup.save();
        res.status(201).json(newGroup);
    } catch (error) {
        res.status(400).json({ message: 'Error creating group' });
    }
});

// Оновлення групи
router.put('/:id', async (req, res) => {
    const { name, ownership, description, personnel, equipment } = req.body; // Додано всі необхідні поля

    try {
        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { name, ownership, description, personnel, equipment }, // Всі поля, які потрібно оновити
            { new: true, runValidators: true } // `runValidators` перевіряє, чи відповідають нові дані схемі
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json(group); // Відправляємо оновлену групу
    } catch (error) {
        console.error('Error updating group:', error); // Логування помилки
        res.status(400).json({ message: 'Error updating group', error: error.message }); // Відправляємо повідомлення з помилкою
    }
});


// Видалення групи
router.delete('/:id', async (req, res) => {
    try {
        const group = await Group.findByIdAndDelete(req.params.id);

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(200).json({ message: 'Group deleted' }); // Повертаємо повідомлення про успішне видалення
    } catch (error) {
        res.status(500).json({ message: 'Error deleting group' });
    }
});

// Додавання нового працівника з зображенням
router.post('/:groupId/personnel', upload.single('photo'), async (req, res) => {
    try {
        const { firstName, lastName, contactNumber, note } = req.body;

        // Перевірка, чи всі необхідні дані надані
        if (!firstName || !lastName || !contactNumber) {
            return res.status(400).json({ message: 'First name, last name, and contact number are required.' });
        }

        // Знаходимо групу за groupId
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Логування шляху до фото
        const photoPath = req.file ? req.file.path : null;
        if (photoPath) {
            console.log('Image uploaded to: ', photoPath); // Логування шляху до зображення
        }

        // Створення нового працівника
        const newPersonnel = {
            firstName,
            lastName,
            contactNumber,
            note,
            photoPath, // Зберігаємо шлях до фото
        };

        // Додавання працівника в масив personnel групи
        group.personnel.push(newPersonnel);

        // Збереження оновленої групи
        await group.save();

        // Відправка лише нового працівника в відповіді
        res.status(201).json(newPersonnel);
    } catch (error) {
        console.error('Error saving employee:', error);
        res.status(500).json({ message: 'Error saving employee', error: error.message });
    }
});

// Видалення персоналу з групи разом із зображенням
router.delete('/:groupId/personnel/:personId', async (req, res) => {
    try {
        const { groupId, personId } = req.params; // Отримуємо groupId та personId з параметрів запиту

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Знаходимо працівника за personId
        const personIndex = group.personnel.findIndex(person => person.id === personId);
        if (personIndex === -1) {
            return res.status(404).json({ message: 'Personnel not found' });
        }

        // Отримуємо шлях до фото
        const person = group.personnel[personIndex];
        const photoPath = person.photoPath;

        // Якщо фото є, видаляємо його з файлової системи
        if (photoPath) {
            const dir = path.resolve('../uploads/personnel'); // Отримуємо абсолютний шлях до директорії
            const formattedPath = path.join(dir, path.basename(photoPath)); // Отримуємо шлях до конкретного фото

            try {
                // Перевірка на існування файлу та його видалення
                await fs.promises.stat(formattedPath); // Перевіряємо, чи існує файл
                await fs.promises.unlink(formattedPath); // Видаляємо файл
                console.log('File deleted successfully:', formattedPath);
            } catch (err) {
                console.error('Error with file deletion:', err);
                return res.status(500).json({ message: 'Error deleting photo' });
            }
        }

        // Видаляємо співробітника з масиву персоналу
        group.personnel.splice(personIndex, 1);
        await group.save(); // Зберігаємо зміни в базі даних

        res.status(200).json({ message: 'Personnel deleted', group }); // Повертаємо оновлену групу
    } catch (error) {
        console.error('Error deleting personnel:', error);
        res.status(400).json({ message: 'Error deleting personnel' });
    }
});

// Додавання нового транспортного засобу до групи з фотографією
router.post('/:groupId/vehicles', vehicleUpload.single('photo'), async (req, res) => {
    try {
        const { vehicleType, regNumber, mark, note, imei } = req.body;

        // Перевірка, чи всі необхідні дані надані
        if (!vehicleType || !regNumber) {
            return res.status(400).json({ message: 'Vehicle type and registration number are required.' });
        }

        // Знаходимо групу за groupId
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Логування шляху до фото
        const photoPath = req.file ? req.file.path : null;
        if (photoPath) {
            console.log('Vehicle image uploaded to: ', photoPath); // Логування шляху до зображення
        }

        // Створення нового транспортного засобу
        const newVehicle = {
            vehicleType,
            regNumber,
            mark,
            note,
            photoPath,
            imei, // Зберігаємо шлях до фото
        };

        // Додавання техніки до масиву vehicle групи
        group.vehicles.push(newVehicle);

        // Збереження оновленої групи
        await group.save();

        // Відправка лише нового транспортного засобу в відповіді
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('Error saving vehicle:', error);
        res.status(500).json({ message: 'Error saving vehicle', error: error.message });
    }
});

// Видалення техніки з групи разом із зображенням
router.delete('/:groupId/vehicles/:vehicleId', async (req, res) => {
    try {
        const { groupId, vehicleId } = req.params;

        // Знаходимо групу
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Знаходимо техніку в групі
        const vehicleIndex = group.vehicles.findIndex(vehicle => vehicle.id === vehicleId);
        if (vehicleIndex === -1) {
            return res.status(404).json({ message: 'Vehicle not found' });
        }

        // Отримуємо шлях до фото техніки
        const vehicle = group.vehicles[vehicleIndex];
        const photoPath = vehicle.photoPath;

        // Якщо фото є, видаляємо його з файлової системи
        if (photoPath) {
            const dir = path.resolve('../uploads/vehicles'); // Отримуємо абсолютний шлях до директорії
            const formattedPath = path.join(dir, path.basename(photoPath)); // Отримуємо шлях до конкретного фото

            try {
                // Перевірка на існування файлу та його видалення
                await fs.promises.stat(formattedPath); // Перевіряємо, чи існує файл
                await fs.promises.unlink(formattedPath); // Видаляємо файл
                console.log('Vehicle photo deleted successfully:', formattedPath);
            } catch (err) {
                console.error('Error with vehicle photo deletion:', err);
                return res.status(500).json({ message: 'Error deleting vehicle photo' });
            }
        }

        // Видаляємо техніку з масиву vehicle
        group.vehicles.splice(vehicleIndex, 1);
        await group.save(); // Зберігаємо зміни в базі даних

        res.status(200).json({ message: 'Vehicle deleted', group }); // Повертаємо оновлену групу
    } catch (error) {
        console.error('Error deleting vehicle:', error);
        res.status(400).json({ message: 'Error deleting vehicle' });
    }
});



export default router;
