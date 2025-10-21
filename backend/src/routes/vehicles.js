// import express from 'express';
// import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const router = express.Router();

// // Оновлена схема транспорту згідно старої вкладеної
// const VehiclesSchema = new mongoose.Schema({
//     vehicleType: { type: String, required: true },
//     regNumber: { type: String, required: true },
//     mark: { type: String },
//     note: { type: String },
//     photoPath: { type: String },
//     imei: { type: String },
//     sim: { type: String },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
//     fuelCapacity: { type: Number },
// }, { timestamps: true });

// const Vehicle = mongoose.model('Vehicle', VehiclesSchema);

// // Налаштування multer
// const storage = multer.diskStorage({
//     destination: (req, file, cb) => {
//         const dir = '../uploads/vehicles';
//         if (!fs.existsSync(dir)) {
//             fs.mkdirSync(dir, { recursive: true });
//         }
//         cb(null, dir);
//     },
//     filename: (req, file, cb) => {
//         const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//         cb(null, uniqueSuffix + path.extname(file.originalname));
//     },
// });
// const upload = multer({ storage });

// // GET всі транспорти
// router.get('/', async (req, res) => {
//     console.log('[GET] /vehicles');
//     try {
//         const vehicles = await Vehicle.find();
//         res.json(vehicles);
//     } catch (error) {
//         console.error('[ERROR] Getting vehicles:', error.message);
//         res.status(500).json({ message: 'Error getting vehicles', error: error.message });
//     }
// });

// // GET транспорт по ID
// router.get('/:id', async (req, res) => {
//     console.log(`[GET] /vehicles/${req.params.id}`);
//     try {
//         const vehicle = await Vehicle.findById(req.params.id);
//         if (!vehicle) {
//             console.warn('[WARN] Vehicle not found');
//             return res.status(404).json({ message: 'Vehicle not found' });
//         }
//         res.json(vehicle);
//     } catch (error) {
//         console.error('[ERROR] Getting vehicle by ID:', error.message);
//         res.status(500).json({ message: 'Error getting vehicle', error: error.message });
//     }
// });

// // POST створити транспорт
// router.post('/', upload.single('photo'), async (req, res) => {
//     console.log('[POST] /vehicles');
//     console.log('[DEBUG] req.body:', req.body);
//     console.log('[DEBUG] req.file:', req.file);

//     try {
//         const { vehicleType, regNumber, mark, note, imei, sim, groupId, fuelCapacity  } = req.body;
//         if (!vehicleType || !regNumber) {
//             console.warn('[WARN] Missing vehicleType or regNumber');
//             return res.status(400).json({ message: 'vehicleType and regNumber are required' });
//         }

//         const photoPath = req.file ? req.file.path : null;
//         if (photoPath) {
//             console.log('[INFO] Photo uploaded to:', photoPath);
//         }

//         const newVehicle = new Vehicle({
//             vehicleType,
//             regNumber,
//             mark,
//             note,
//             photoPath,
//             imei,
//             sim,
//             groupId,
//             fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
//         });

//         await newVehicle.save();
//         console.log('[SUCCESS] Vehicle created:', newVehicle._id);
//         res.status(201).json(newVehicle);
//     } catch (error) {
//         console.error('[ERROR] Creating vehicle:', error.message);
//         res.status(500).json({ message: 'Error saving vehicle', error: error.message });
//     }
// });

// // PUT оновити транспорт
// router.put('/:id', upload.single('photo'), async (req, res) => {
//     console.log(`[PUT] /vehicles/${req.params.id}`);
//     console.log('[DEBUG] req.body:', req.body);
//     console.log('[DEBUG] req.file:', req.file);

//     try {
//         const { vehicleType, regNumber, mark, note, imei, sim, groupId, fuelCapacity  } = req.body;

//         const vehicle = await Vehicle.findById(req.params.id);
//         if (!vehicle) {
//             console.warn('[WARN] Vehicle not found for update');
//             return res.status(404).json({ message: 'Vehicle not found' });
//         }

//         if (req.file && vehicle.photoPath) {
//             try {
//                 await fs.promises.unlink(path.resolve(vehicle.photoPath));
//                 console.log('[INFO] Old photo deleted:', vehicle.photoPath);
//             } catch (err) {
//                 console.warn('[WARN] Error deleting old photo:', err.message);
//             }
//         }

//         const updateData = {
//             vehicleType,
//             regNumber,
//             mark,
//             note,
//             imei,
//             sim,
//             groupId,
//             fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
//         };

//         if (req.file) {
//             updateData.photoPath = req.file.path;
//             console.log('[INFO] New photo uploaded:', updateData.photoPath);
//         }

//         const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
//         console.log('[SUCCESS] Vehicle updated:', updatedVehicle._id);
//         res.json(updatedVehicle);
//     } catch (error) {
//         console.error('[ERROR] Updating vehicle:', error.message);
//         res.status(500).json({ message: 'Error updating vehicle', error: error.message });
//     }
// });

// // DELETE транспорт
// router.delete('/:id', async (req, res) => {
//     console.log(`[DELETE] /vehicles/${req.params.id}`);
//     try {
//         const vehicle = await Vehicle.findById(req.params.id);
//         if (!vehicle) {
//             console.warn('[WARN] Vehicle not found for deletion');
//             return res.status(404).json({ message: 'Vehicle not found' });
//         }

//         if (vehicle.photoPath) {
//             try {
//                 await fs.promises.unlink(path.resolve(vehicle.photoPath));
//                 console.log('[INFO] Photo file deleted:', vehicle.photoPath);
//             } catch (err) {
//                 console.warn('[WARN] Error deleting photo file:', err.message);
//             }
//         }

//         await Vehicle.findByIdAndDelete(req.params.id);
//         console.log('[SUCCESS] Vehicle deleted:', req.params.id);
//         res.json({ message: 'Vehicle deleted' });
//     } catch (error) {
//         console.error('[ERROR] Deleting vehicle:', error.message);
//         res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
//     }
// });

// export default router;





// import express from 'express';
// import mongoose from 'mongoose';
// import multer from 'multer';
// import path from 'path';
// import fs from 'fs';

// const router = express.Router();

// // 📦 Схема транспорту з дефолтними водіями
// const VehiclesSchema = new mongoose.Schema(
//   {
//     vehicleType: { type: String, required: true },
//     regNumber: { type: String, required: true },
//     mark: { type: String },
//     note: { type: String },
//     photoPath: { type: String },
//     imei: { type: String },
//     sim: { type: String },
//     groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
//     fuelCapacity: { type: Number },

//     // 🆕 Нові поля — дефолтні водії
//     driver1: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
//     driver2: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
//     driver3: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
//   },
//   { timestamps: true }
// );

// const Vehicle = mongoose.model('Vehicle', VehiclesSchema);

// // 📁 Налаштування multer
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     const dir = '../uploads/vehicles';
//     if (!fs.existsSync(dir)) {
//       fs.mkdirSync(dir, { recursive: true });
//     }
//     cb(null, dir);
//   },
//   filename: (req, file, cb) => {
//     const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
//     cb(null, uniqueSuffix + path.extname(file.originalname));
//   },
// });
// const upload = multer({ storage });

// /* -------------------------------------------------------------------------- */
// /*                              📍 GET всі                                   */
// /* -------------------------------------------------------------------------- */
// router.get('/', async (req, res) => {
//   console.log('[GET] /vehicles');
//   try {
//     const vehicles = await Vehicle.find()
//       .populate('driver1', 'firstName lastName function')
//       .populate('driver2', 'firstName lastName function')
//       .populate('driver3', 'firstName lastName function');
//     res.json(vehicles);
//   } catch (error) {
//     console.error('[ERROR] Getting vehicles:', error.message);
//     res.status(500).json({ message: 'Error getting vehicles', error: error.message });
//   }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 GET by ID                                 */
// /* -------------------------------------------------------------------------- */
// router.get('/:id', async (req, res) => {
//   console.log(`[GET] /vehicles/${req.params.id}`);
//   try {
//     const vehicle = await Vehicle.findById(req.params.id)
//       .populate('driver1', 'firstName lastName function')
//       .populate('driver2', 'firstName lastName function')
//       .populate('driver3', 'firstName lastName function');
//     if (!vehicle) {
//       return res.status(404).json({ message: 'Vehicle not found' });
//     }
//     res.json(vehicle);
//   } catch (error) {
//     console.error('[ERROR] Getting vehicle by ID:', error.message);
//     res.status(500).json({ message: 'Error getting vehicle', error: error.message });
//   }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 POST create                               */
// /* -------------------------------------------------------------------------- */
// router.post('/', upload.single('photo'), async (req, res) => {
//   console.log('[POST] /vehicles');
//   console.log('[DEBUG] req.body:', req.body);
//   console.log('[DEBUG] req.file:', req.file);

//   try {
//     const {
//       vehicleType,
//       regNumber,
//       mark,
//       note,
//       imei,
//       sim,
//       groupId,
//       fuelCapacity,
//       driver1,
//       driver2,
//       driver3,
//     } = req.body;

//     if (!vehicleType || !regNumber) {
//       return res.status(400).json({ message: 'vehicleType and regNumber are required' });
//     }

//     const photoPath = req.file ? req.file.path : null;

//     const newVehicle = new Vehicle({
//       vehicleType,
//       regNumber,
//       mark,
//       note,
//       photoPath,
//       imei,
//       sim,
//       groupId,
//       fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
//       driver1: driver1 || null,
//       driver2: driver2 || null,
//       driver3: driver3 || null,
//     });

//     await newVehicle.save();
//     console.log('[SUCCESS] Vehicle created:', newVehicle._id);
//     res.status(201).json(newVehicle);
//   } catch (error) {
//     console.error('[ERROR] Creating vehicle:', error.message);
//     res.status(500).json({ message: 'Error saving vehicle', error: error.message });
//   }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 PUT update                                */
// /* -------------------------------------------------------------------------- */
// router.put('/:id', upload.single('photo'), async (req, res) => {
//   console.log(`[PUT] /vehicles/${req.params.id}`);
//   console.log('[DEBUG] req.body:', req.body);

//   try {
//     const {
//       vehicleType,
//       regNumber,
//       mark,
//       note,
//       imei,
//       sim,
//       groupId,
//       fuelCapacity,
//       driver1,
//       driver2,
//       driver3,
//     } = req.body;

//     const vehicle = await Vehicle.findById(req.params.id);
//     if (!vehicle) {
//       return res.status(404).json({ message: 'Vehicle not found' });
//     }

//     // 🧹 Видалити старе фото, якщо нове завантажено
//     if (req.file && vehicle.photoPath) {
//       try {
//         await fs.promises.unlink(path.resolve(vehicle.photoPath));
//         console.log('[INFO] Old photo deleted:', vehicle.photoPath);
//       } catch (err) {
//         console.warn('[WARN] Error deleting old photo:', err.message);
//       }
//     }

//     const updateData = {
//       vehicleType,
//       regNumber,
//       mark,
//       note,
//       imei,
//       sim,
//       groupId,
//       fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
//       driver1: driver1 || null,
//       driver2: driver2 || null,
//       driver3: driver3 || null,
//     };

//     if (req.file) updateData.photoPath = req.file.path;

//     const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, {
//       new: true,
//       runValidators: true,
//     });
//     console.log('[SUCCESS] Vehicle updated:', updatedVehicle._id);
//     res.json(updatedVehicle);
//   } catch (error) {
//     console.error('[ERROR] Updating vehicle:', error.message);
//     res.status(500).json({ message: 'Error updating vehicle', error: error.message });
//   }
// });

// /* -------------------------------------------------------------------------- */
// /*                              📍 DELETE                                     */
// /* -------------------------------------------------------------------------- */
// router.delete('/:id', async (req, res) => {
//   console.log(`[DELETE] /vehicles/${req.params.id}`);
//   try {
//     const vehicle = await Vehicle.findById(req.params.id);
//     if (!vehicle) {
//       return res.status(404).json({ message: 'Vehicle not found' });
//     }

//     // 🧹 Видаляємо фото, якщо існує
//     if (vehicle.photoPath) {
//       try {
//         await fs.promises.unlink(path.resolve(vehicle.photoPath));
//         console.log('[INFO] Photo file deleted:', vehicle.photoPath);
//       } catch (err) {
//         console.warn('[WARN] Error deleting photo file:', err.message);
//       }
//     }

//     await Vehicle.findByIdAndDelete(req.params.id);
//     console.log('[SUCCESS] Vehicle deleted:', req.params.id);
//     res.json({ message: 'Vehicle deleted' });
//   } catch (error) {
//     console.error('[ERROR] Deleting vehicle:', error.message);
//     res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
//   }
// });

// export default router;







import express from 'express';
import mongoose from 'mongoose';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const router = express.Router();

// ESM спосіб визначення __dirname
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Шлях до зовнішньої папки uploads/vehicles
const UPLOADS_DIR = path.join(__dirname, '../../../uploads/vehicles');
if (!fs.existsSync(UPLOADS_DIR)) {
    fs.mkdirSync(UPLOADS_DIR, { recursive: true });
}

// Multer налаштування
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, UPLOADS_DIR),
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
        cb(null, uniqueSuffix + path.extname(file.originalname));
    },
});
const upload = multer({ storage });

// 📦 Схема транспорту
const VehiclesSchema = new mongoose.Schema({
    vehicleType: { type: String, required: true },
    regNumber: { type: String, required: true },
    mark: { type: String },
    note: { type: String },
    photoPath: { type: String },
    imei: { type: String },
    sim: { type: String },
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: 'Group' },
    fuelCapacity: { type: Number },
    driver1: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
    driver2: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
    driver3: { type: mongoose.Schema.Types.ObjectId, ref: 'Personnel', default: null },
}, { timestamps: true });

const Vehicle = mongoose.model('Vehicle', VehiclesSchema);

// GET всі транспортні засоби
router.get('/', async (req, res) => {
    try {
        const vehicles = await Vehicle.find()
            .populate('driver1', 'firstName lastName function')
            .populate('driver2', 'firstName lastName function')
            .populate('driver3', 'firstName lastName function');
        res.json(vehicles);
    } catch (error) {
        console.error('[ERROR] Getting vehicles:', error.message);
        res.status(500).json({ message: 'Error getting vehicles', error: error.message });
    }
});

// GET by ID
router.get('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id)
            .populate('driver1', 'firstName lastName function')
            .populate('driver2', 'firstName lastName function')
            .populate('driver3', 'firstName lastName function');
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });
        res.json(vehicle);
    } catch (error) {
        console.error('[ERROR] Getting vehicle by ID:', error.message);
        res.status(500).json({ message: 'Error getting vehicle', error: error.message });
    }
});

// POST create
router.post('/', upload.single('photo'), async (req, res) => {
    try {
        const {
            vehicleType, regNumber, mark, note, imei, sim,
            groupId, fuelCapacity, driver1, driver2, driver3
        } = req.body;

        if (!vehicleType || !regNumber) {
            return res.status(400).json({ message: 'vehicleType and regNumber are required' });
        }

        const photoPath = req.file ? path.join('uploads/vehicles', req.file.filename) : null;

        const newVehicle = new Vehicle({
            vehicleType,
            regNumber,
            mark,
            note,
            photoPath,
            imei,
            sim,
            groupId,
            fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
            driver1: driver1 || null,
            driver2: driver2 || null,
            driver3: driver3 || null,
        });

        await newVehicle.save();
        res.status(201).json(newVehicle);
    } catch (error) {
        console.error('[ERROR] Creating vehicle:', error.message);
        res.status(500).json({ message: 'Error saving vehicle', error: error.message });
    }
});

// PUT update
router.put('/:id', upload.single('photo'), async (req, res) => {
    try {
        const {
            vehicleType, regNumber, mark, note, imei, sim,
            groupId, fuelCapacity, driver1, driver2, driver3
        } = req.body;

        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        // Видалення старого фото
        if (req.file && vehicle.photoPath) {
            const oldPath = path.join(__dirname, '../../../', vehicle.photoPath);
            if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
        }

        const updateData = {
            vehicleType,
            regNumber,
            mark,
            note,
            imei,
            sim,
            groupId,
            fuelCapacity: fuelCapacity ? Number(fuelCapacity) : undefined,
            driver1: driver1 || null,
            driver2: driver2 || null,
            driver3: driver3 || null,
        };

        if (req.file) updateData.photoPath = path.join('uploads/vehicles', req.file.filename);

        const updatedVehicle = await Vehicle.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        res.json(updatedVehicle);
    } catch (error) {
        console.error('[ERROR] Updating vehicle:', error.message);
        res.status(500).json({ message: 'Error updating vehicle', error: error.message });
    }
});

// DELETE
router.delete('/:id', async (req, res) => {
    try {
        const vehicle = await Vehicle.findById(req.params.id);
        if (!vehicle) return res.status(404).json({ message: 'Vehicle not found' });

        if (vehicle.photoPath) {
            const filePath = path.join(__dirname, '../../../', vehicle.photoPath);
            if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
        }

        await Vehicle.findByIdAndDelete(req.params.id);
        res.json({ message: 'Vehicle deleted' });
    } catch (error) {
        console.error('[ERROR] Deleting vehicle:', error.message);
        res.status(500).json({ message: 'Error deleting vehicle', error: error.message });
    }
});

export default router;
