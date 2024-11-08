import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

const storage = multer.memoryStorage();
const upload = multer();  // Використовуємо multer без збереження файлів на сервері (зберігаємо в пам'яті)
const router = express.Router();

// Схема для групи з вбудованими даними про персонал
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownership: { type: String, required: true },
    description: { type: String },
    personnel: [{ 
        firstName: { type: String, required: true },
        lastName: { type: String, required: true },
        contactNumber: { type: String, required: true },
        note: { type: String },
        photo: { type: Buffer }, // Збереження фото як Buffer
    }],
    equipment: { type: [String], default: [] },
});

// Створення моделі для групи
const Group = mongoose.model('Group', GroupSchema);

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
        equipment: [],
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



router.post('/:groupId/personnel', upload.single('photo'), async (req, res) => {
    try {
        // Отримуємо дані з запиту
        const { firstName, lastName, contactNumber, note, groupId } = req.body;

        // Шукаємо групу за ID
        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Створюємо новий об'єкт персоналу
        const newPersonnel = {
            firstName,
            lastName,
            contactNumber,
            note,
            photo: req.file ? req.file.buffer : null, // Зберігаємо фото в Buffer, якщо воно є
        };

        // Додаємо персонал до групи
        group.personnel.push(newPersonnel);

        // Зберігаємо оновлену групу
        await group.save();

        // Повертаємо групу з доданим персоналом
        res.status(201).json(group);
    } catch (error) {
        console.error('Error saving employee:', error);
        res.status(500).json({ message: 'Error saving employee', error: error.message });
    }
});


// Оновлення інформації про персонал
router.put('/:groupId/personnel/:personId', upload.single('photo'), async (req, res) => {
    console.log('Request body:', req.body);  // Логування даних, що надходять в тілі запиту
    console.log('Request file:', req.file);  // Логування файлу, якщо він є

    const { firstName, lastName, contactNumber, note } = req.body; // Дані, які можна оновити
    
    try {
        // Шукаємо групу за ID
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Шукаємо персонала в групі за ID
        const person = group.personnel.id(req.params.personId);
        if (!person) {
            return res.status(404).json({ message: 'Personnel not found' });
        }

        // Оновлюємо дані персонала
        person.firstName = firstName || person.firstName;
        person.lastName = lastName || person.lastName;
        person.contactNumber = contactNumber || person.contactNumber;
        person.note = note || person.note;

        // Якщо є нове фото, оновлюємо його
        if (req.file) {
            console.log('New photo received');
            person.photo = req.file.buffer; // Оновлюємо фото на нове з buffer
        }

        // Зберігаємо оновлену групу
        await group.save();

        // Повертаємо оновлену групу
        res.status(200).json(group);
    } catch (error) {
        console.error('Error updating personnel:', error);
        res.status(400).json({ message: 'Error updating personnel', error: error.message });
    }
});



// Видалення персоналу з групи
router.delete('/:groupId/personnel/:personId', async (req, res) => {
    try {
        const { groupId, personId } = req.params; // Отримуємо groupId та personId з параметрів запиту

        const group = await Group.findById(groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        // Знаходимо індекс персоналу
        const personIndex = group.personnel.findIndex(person => person.id === personId);
        if (personIndex === -1) {
            return res.status(404).json({ message: 'Personnel not found' });
        }

        group.personnel.splice(personIndex, 1); // Видаляємо конкретного співробітника з масиву
        await group.save();
        res.status(200).json(group); // Повертаємо оновлену групу
    } catch (error) {
        res.status(400).json({ message: 'Error deleting personnel' });
    }
});

export default router;

