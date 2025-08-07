// import express from 'express';
// import mongoose from 'mongoose';

// const router = express.Router();

// // Функція для витягування ID з { value, label } або _id
// function extractId(val) {
//   if (!val) return null;
//   if (typeof val === 'object') {
//     return val.value || val._id || null;
//   }
//   return val;
// }

// // Схема таски з новими полями width та note
// const TaskSchema = new mongoose.Schema({
//   groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
//   personnelId: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel' },
//   techniqueId: { type: mongoose.Schema.Types.ObjectId, ref: 'Technique' },
//   vehicleId: { type: mongoose.Schema.Types.ObjectId, ref: 'Vehicle' },
//   fieldId: { type: mongoose.Schema.Types.ObjectId, ref: 'Field' },
//   operationId: { type: mongoose.Schema.Types.ObjectId, ref: 'Operation' },
//   varietyId: { type: mongoose.Schema.Types.ObjectId, ref: 'Variety' },
//   cropId: { type: mongoose.Schema.Types.ObjectId, ref: 'Crop' },
//   width: { type: Number, default: null },
//   note: { type: String, default: '' },
//   status: {
//     type: String,
//     enum: ['new', 'in_progress', 'done'],
//     default: 'new'
//   }
// }, { timestamps: true });

// const Task = mongoose.model('Task', TaskSchema);

// // ================= ROUTES =================

// // GET всі таски
// router.get('/', async (req, res) => {
//   try {
//     const tasks = await Task.find()
//       .populate('groupId')
//       .populate('personnelId')
//       .populate('techniqueId')
//       .populate('vehicleId')
//       .populate('fieldId')
//       .populate('operationId')
//       .populate('varietyId')
//       .populate('cropId');
//     res.json(tasks);
//   } catch (error) {
//     console.error('Error fetching tasks:', error);
//     res.status(500).json({ message: 'Error fetching tasks', error: error.message });
//   }
// });

// // GET таску по ID
// router.get('/:id', async (req, res) => {
//   try {
//     const task = await Task.findById(req.params.id)
//       .populate('groupId')
//       .populate('personnelId')
//       .populate('techniqueId')
//       .populate('vehicleId')
//       .populate('fieldId')
//       .populate('operationId')
//       .populate('varietyId')
//       .populate('cropId');

//     if (!task) return res.status(404).json({ message: 'Task not found' });

//     res.json(task);
//   } catch (error) {
//     console.error(`Error fetching task ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Error fetching task', error: error.message });
//   }
// });

// // POST - створити таску
// router.post('/', async (req, res) => {
//   try {
//     console.log('POST /tasks', req.body);

//     let widthVal = Number(req.body.width);
//     if (isNaN(widthVal)) widthVal = null;

//     const taskData = {
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
//       status: 'new' // нові таски завжди починаються як "new"
//     };

//     const newTask = new Task(taskData);
//     await newTask.save();

//     const populated = await Task.findById(newTask._id)
//       .populate('groupId')
//       .populate('personnelId')
//       .populate('techniqueId')
//       .populate('vehicleId')
//       .populate('fieldId')
//       .populate('operationId')
//       .populate('varietyId')
//       .populate('cropId');

//     res.status(201).json(populated);
//   } catch (error) {
//     console.error('Error creating task:', error);
//     res.status(500).json({ message: 'Error creating task', error: error.message });
//   }
// });

// // PUT - оновити таску
// router.put('/:id', async (req, res) => {
//   try {
//     console.log(`PUT /tasks/${req.params.id}`, req.body);

//     let widthVal = Number(req.body.width);
//     if (isNaN(widthVal)) widthVal = null;

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
//       status: req.body.status || 'new'
//     };

//     const updated = await Task.findByIdAndUpdate(
//       req.params.id,
//       updateData,
//       { new: true, runValidators: true }
//     )
//       .populate('groupId')
//       .populate('personnelId')
//       .populate('techniqueId')
//       .populate('vehicleId')
//       .populate('fieldId')
//       .populate('operationId')
//       .populate('varietyId')
//       .populate('cropId');

//     if (!updated) return res.status(404).json({ message: 'Task not found' });

//     res.json(updated);
//   } catch (error) {
//     console.error(`Error updating task ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Error updating task', error: error.message });
//   }
// });

// // PATCH - змінити лише статус
// router.patch('/:id/status', async (req, res) => {
//   try {
//     const { status } = req.body;
//     if (!['new', 'in_progress', 'done'].includes(status)) {
//       return res.status(400).json({ message: 'Invalid status' });
//     }

//     const updated = await Task.findByIdAndUpdate(
//       req.params.id,
//       { status },
//       { new: true, runValidators: true }
//     )
//       .populate('groupId')
//       .populate('personnelId')
//       .populate('techniqueId')
//       .populate('vehicleId')
//       .populate('fieldId')
//       .populate('operationId')
//       .populate('varietyId')
//       .populate('cropId');

//     if (!updated) return res.status(404).json({ message: 'Task not found' });

//     res.json(updated);
//   } catch (error) {
//     console.error(`Error updating status for task ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Error updating status', error: error.message });
//   }
// });

// // DELETE - видалити таску
// router.delete('/:id', async (req, res) => {
//   try {
//     console.log(`DELETE /tasks/${req.params.id}`);
//     const deleted = await Task.findByIdAndDelete(req.params.id);
//     if (!deleted) return res.status(404).json({ message: 'Task not found' });
//     res.json({ message: 'Task deleted' });
//   } catch (error) {
//     console.error(`Error deleting task ${req.params.id}:`, error);
//     res.status(500).json({ message: 'Error deleting task', error: error.message });
//   }
// });

// export default router;









import express from 'express';
import mongoose from 'mongoose';

const router = express.Router();

// ===================== Модель =====================

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
  status: {
    type: String,
    enum: ['new', 'in_progress', 'done'],
    default: 'new'
  },
  order: { type: Number, required: true }, // ✅ порядковий номер
}, { timestamps: true });

const Task = mongoose.model('Task', TaskSchema);

// ===================== Utils =====================

function extractId(val) {
  if (!val) return null;
  if (typeof val === 'object') {
    return val.value || val._id || null;
  }
  return val;
}

// ===================== ROUTES =====================

// GET всі таски
router.get('/', async (req, res) => {
  try {
    const tasks = await Task.find()
      .sort({ order: -1 }) // нові — зверху
      .populate('groupId')
      .populate('personnelId')
      .populate('techniqueId')
      .populate('vehicleId')
      .populate('fieldId')
      .populate('operationId')
      .populate('varietyId')
      .populate('cropId');

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
      .populate('groupId')
      .populate('personnelId')
      .populate('techniqueId')
      .populate('vehicleId')
      .populate('fieldId')
      .populate('operationId')
      .populate('varietyId')
      .populate('cropId');

    if (!task) return res.status(404).json({ message: 'Task not found' });

    res.json(task);
  } catch (error) {
    console.error(`Error fetching task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error fetching task', error: error.message });
  }
});

// POST - створити таску з порядковим номером
router.post('/', async (req, res) => {
  try {
    console.log('POST /tasks', req.body);

    let widthVal = Number(req.body.width);
    if (isNaN(widthVal)) widthVal = null;

    // отримати останнє значення порядкового номера
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
      status: 'new',
      order: nextOrder,
    };

    const newTask = new Task(taskData);
    await newTask.save();

    const populated = await Task.findById(newTask._id)
      .populate('groupId')
      .populate('personnelId')
      .populate('techniqueId')
      .populate('vehicleId')
      .populate('fieldId')
      .populate('operationId')
      .populate('varietyId')
      .populate('cropId');

    res.status(201).json(populated);
  } catch (error) {
    console.error('Error creating task:', error);
    res.status(500).json({ message: 'Error creating task', error: error.message });
  }
});

// PUT - оновити таску
router.put('/:id', async (req, res) => {
  try {
    console.log(`PUT /tasks/${req.params.id}`, req.body);

    let widthVal = Number(req.body.width);
    if (isNaN(widthVal)) widthVal = null;

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
      status: req.body.status || 'new'
    };

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      updateData,
      { new: true, runValidators: true }
    )
      .populate('groupId')
      .populate('personnelId')
      .populate('techniqueId')
      .populate('vehicleId')
      .populate('fieldId')
      .populate('operationId')
      .populate('varietyId')
      .populate('cropId');

    if (!updated) return res.status(404).json({ message: 'Task not found' });

    res.json(updated);
  } catch (error) {
    console.error(`Error updating task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error updating task', error: error.message });
  }
});

// PATCH - змінити лише статус
router.patch('/:id/status', async (req, res) => {
  try {
    const { status } = req.body;
    if (!['new', 'in_progress', 'done'].includes(status)) {
      return res.status(400).json({ message: 'Invalid status' });
    }

    const updated = await Task.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    )
      .populate('groupId')
      .populate('personnelId')
      .populate('techniqueId')
      .populate('vehicleId')
      .populate('fieldId')
      .populate('operationId')
      .populate('varietyId')
      .populate('cropId');

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
    console.log(`DELETE /tasks/${req.params.id}`);
    const deleted = await Task.findByIdAndDelete(req.params.id);
    if (!deleted) return res.status(404).json({ message: 'Task not found' });

    res.json({ message: 'Task deleted' });
  } catch (error) {
    console.error(`Error deleting task ${req.params.id}:`, error);
    res.status(500).json({ message: 'Error deleting task', error: error.message });
  }
});

export default router;
