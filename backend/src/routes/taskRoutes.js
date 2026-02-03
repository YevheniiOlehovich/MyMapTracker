import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';

const router = express.Router();

// Модель таски з новим полем startDate
const TaskSchema = new mongoose.Schema({
  groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
  personnelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' },
  techniqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technique' },
  vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
  fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
  operationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Operation' },
  varietyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variety' },
  cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
  width: { type: Number, default: null },
  note: { type: String, default: '' },
  daysToComplete: { type: Number, default: null },
  startDate: { type: Date, default: null }, // <-- нове поле
  status: {
    type: String,
    enum: ['new', 'in_progress', 'done'],
    default: 'new',
  },
  processedArea: { type: Number, default: 0 },
  order: { type: Number, required: true },
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

const upload = multer(); // multer без дискового зберігання — для парсингу multipart/form-data без файлів

function extractId(val) {
  if (!val) return null;
  if (typeof val === 'object') {
    return val.value || val._id || null;
  }
  return val;
}

// GET всі таски
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ order: -1 })
      .populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');
    res.json(tasks);
  } catch (error) {
    console.error('Error fetching tasks:', error);
    res.status(500).json({ message: 'Error fetching tasks', error: error.message });
  }
});

// GET таску по ID
router.get('/:id', async (req, res) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error(`Error fetching task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// POST - створити таску
router.post('/', upload.none(), async (req, res) => {
  try {
    let widthVal = Number(req.body.width);
    if (isNaN(widthVal)) widthVal = null;

    let daysVal = Number(req.body.daysToComplete);
    if (isNaN(daysVal)) daysVal = null;

    const lastTask = await Task.findOne().sort({ order: -1 }).select('order');
    const nextOrder = lastTask?.order ? lastTask.order + 1 : 1;

    const taskData = {
      groupId: extractId(req.body.group),
      personnelId: extractId(req.body.personnel),
      techniqueId: extractId(req.body.technique),
      vehicleId: extractId(req.body.vehicle),
      fieldId: extractId(req.body.field),
      operationId: extractId(req.body.operation),
      varietyId: extractId(req.body.variety),
      cropId: extractId(req.body.crop),
      width: widthVal,
      note: typeof req.body.note === 'string' ? req.body.note.trim() : '',
      daysToComplete: daysVal,
      startDate: req.body.startDate ? new Date(req.body.startDate) : null, // <-- нове поле
      status: 'new',
      order: nextOrder,
    };

    const newTask = new Task(taskData);
    await newTask.save();

    const populated = await Task.findById(newTask._id)
      .populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT - оновити таску
// router.put('/:id', upload.none(), async (req, res) => {
//   try {
//     let widthVal = Number(req.body.width);
//     if (isNaN(widthVal)) widthVal = null;

//     let daysVal = Number(req.body.daysToComplete);
//     if (isNaN(daysVal)) daysVal = null;

//     const updateData = {
//       groupId: extractId(req.body.group),
//       personnelId: extractId(req.body.personnel),
//       techniqueId: extractId(req.body.technique),
//       vehicleId: extractId(req.body.vehicle),
//       fieldId: extractId(req.body.field),
//       operationId: extractId(req.body.operation),
//       varietyId: extractId(req.body.variety),
//       cropId: extractId(req.body.crop),
//       width: widthVal,
//       note: typeof req.body.note === 'string' ? req.body.note.trim() : '',
//       daysToComplete: daysVal,
//       startDate: req.body.startDate ? new Date(req.body.startDate) : null, // <-- нове поле
//       status: req.body.status || 'new',
//     };

//     const updated = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
//       .populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');

//     if (!updated) return res.status(404).json({ message: 'Task not found' });

//     res.json(updated);
//   } catch (error) {
//     console.error(`Error updating task ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Error updating task', error: error.message });
//   }
// });
router.put('/:id', upload.none(), async (req, res) => {
  try {
    let widthVal = Number(req.body.width);
    if (isNaN(widthVal)) widthVal = null;

    let daysVal = Number(req.body.daysToComplete);
    if (isNaN(daysVal)) daysVal = null;

    let processedArea = Number(req.body.processedArea);
    if (isNaN(processedArea)) processedArea = 0;

    // Визначаємо статус автоматично
    let status = 'new';
    const startDate = req.body.startDate ? new Date(req.body.startDate) : null;
    const today = new Date();

    if (processedArea > 0 && startDate) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + daysVal);

      if (today < endDate) {
        status = 'in_progress';
      } else {
        status = 'done';
      }
    }

    const updateData = {
      groupId: extractId(req.body.group),
      personnelId: extractId(req.body.personnel),
      techniqueId: extractId(req.body.technique),
      vehicleId: extractId(req.body.vehicle),
      fieldId: extractId(req.body.field),
      operationId: extractId(req.body.operation),
      varietyId: extractId(req.body.variety),
      cropId: extractId(req.body.crop),
      width: widthVal,
      note: typeof req.body.note === 'string' ? req.body.note.trim() : '',
      daysToComplete: daysVal,
      startDate: startDate,
      processedArea: processedArea, // <-- нове поле
      status, // <-- автоматичний статус
    };

    const updated = await Task.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true })
      .populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');

    if (!updated) return res.status(404).json({ message: 'Task not found' });

    res.json(updated);
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});


// PATCH - оновити лише статус таски
router.patch('/:id/status', upload.none(), async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    ).populate('groupId personnelId techniqueId vehicleId fieldId operationId varietyId cropId');

    if (!updated) return res.status(404).json({ message: 'Task not found' });

    res.json(updated);
  } catch (error) {
    console.error(`Error updating status for task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating status', error: error.message });
  }
});

// DELETE - видалити таску
router.delete('/:id', async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });
    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

export default router;
