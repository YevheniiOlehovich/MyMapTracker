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

    // Перевірка наявності обов'язкових полів
    if (!name || !ownership) {
        return res.status(400).json({ message: 'Name and ownership are required' });
    }

    const newGroup = new Group({
        name,
        ownership,
        description,
        personnel: [], // Створюємо порожній масив для персоналу
        equipment: []  // Створюємо порожній масив для техніки
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
    const { personnel, equipment } = req.body;

    try {
        const group = await Group.findByIdAndUpdate(
            req.params.id,
            { personnel, equipment },
            { new: true }
        );

        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        res.status(204).json(group); // або res.json(group);
    } catch (error) {
        res.status(400).json({ message: 'Error updating group' });
    }
});

// Маршрут для додавання персоналу до конкретної групи
router.post('/:id/personnel', async (req, res) => {
    console.log('Request Body:', req.body); // Логування тіла запиту

    const { name, ownership, contactNumber, description } = req.body;

    if (!name || !ownership || !contactNumber) {
        return res.status(400).json({ message: 'Name, ownership, and contact number are required' });
    }

    try {
        const group = await Group.findById(req.params.id);
        if (!group) {
            return res.status(404).json({ message: 'Group not found' });
        }

        const newPersonnel = {
            name,
            ownership,
            contactNumber,
            description,
        };

        group.personnel.push(newPersonnel);

        await group.save(); // Додайте логування після збереження
        console.log('Updated Group:', group); // Логування оновленої групи
        res.status(201).json(group);
    } catch (error) {
        console.error('Error adding personnel to group:', error);
        res.status(400).json({ message: 'Error adding personnel to group' });
    }
});


export default router;

