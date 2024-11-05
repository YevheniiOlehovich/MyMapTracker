import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// Створюємо схему та модель для груп
const GroupSchema = new mongoose.Schema({
    name: { type: String, required: true },
    ownership: { type: String, required: true },
    description: { type: String },
    personnel: [{
        name: { type: String, required: true },
        ownership: { type: String, required: true },
        contactNumber: { type: String, required: true },
        description: { type: String },
    }],
    equipment: { type: [String], default: [] }, // Масив для техніки, за замовчуванням порожній
});

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

// Додавання персоналу до конкретної групи
router.post('/:id/personnel', async (req, res) => {
    console.log('Request Body:', req.body);

    const { name, ownership, contactNumber, description } = req.body;

    if (!name || !ownership || !contactNumber) {
        return res.status(400).json({ message: 'Name, ownership, and contact number are required' });
    }

    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const newPersonnel = { name, ownership, contactNumber, description };
        group.personnel.push(newPersonnel);

        await group.save();
        console.log('Updated Group:', group);
        res.status(201).json(group);
    } catch (error) {
        console.error('Error adding personnel to group:', error);
        res.status(400).json({ message: 'Error adding personnel to group' });
    }
});

// Оновлення інформації про персонал
router.put('/:groupId/personnel/:personId', async (req, res) => {
    const { name, ownership, contactNumber, description } = req.body;

    try {
        const group = await Group.findById(req.params.groupId);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const person = group.personnel.id(req.params.personId);
        if (!person) {
            return res.status(404).json({ message: 'Personnel not found' });
        }

        person.name = name || person.name;
        person.ownership = ownership || person.ownership;
        person.contactNumber = contactNumber || person.contactNumber;
        person.description = description || person.description;

        await group.save();
        res.status(200).json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error updating personnel' });
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