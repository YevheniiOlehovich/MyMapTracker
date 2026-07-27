// import express from 'express';
// import mongoose from 'mongoose';

// const router = express.Router();

// // Схема та модель для "ділянок у власності"
// const propertySchema = new mongoose.Schema({
//     type: { type: String },
//     geometry: {
//         type: { type: String },
//         coordinates: Array,
//     },
//     id: { type: Number },
//     properties: {
//         name: { type: String },
//         branch: { type: String },
//         color: { type: String },
//         opacity: { type: String },
//         area: { type: String },
//         mapkey: { type: String },
//         radius: { type: String },
//     },
// }, { collection: 'property' }); // Вказуємо назву колекції property

// const Property = mongoose.models.Property || mongoose.model('Property', propertySchema);

// // GET: Отримати всі ділянки у власності
// router.get('/', async (req, res) => {
//     try {
//         const properties = await Property.find();
//         res.status(200).json(properties);
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка при отриманні ділянок у власності', error: error.message });
//     }
// });

// // POST: Додати одну або багато ділянок у власності
// router.post('/', async (req, res) => {
//     try {
//         const data = req.body;
//         if (Array.isArray(data)) {
//             await Property.insertMany(data);
//         } else {
//             await new Property(data).save();
//         }
//         res.status(201).json({ message: 'Ділянку(и) у власності успішно збережено' });
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка при збереженні ділянок у власності', error: error.message });
//     }
// });

// // PUT: Оновити ділянку у власності за ID
// router.put('/:id', async (req, res) => {
//     try {
//         const { id } = req.params;
//         const updatedProperty = await Property.findByIdAndUpdate(id, req.body, {
//             new: true,
//             runValidators: true,
//         });
//         if (!updatedProperty) {
//             return res.status(404).json({ message: 'Ділянку у власності не знайдено' });
//         }
//         res.status(200).json(updatedProperty);
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка при оновленні ділянки у власності', error: error.message });
//     }
// });

// // DELETE: Видалити ділянку у власності за ID
// router.delete('/:id', async (req, res) => {
//     try {
//         const deleted = await Property.findByIdAndDelete(req.params.id);
//         if (!deleted) {
//             return res.status(404).json({ message: 'Ділянку у власності не знайдено' });
//         }
//         res.status(200).json({ message: 'Ділянку у власності видалено' });
//     } catch (error) {
//         res.status(500).json({ message: 'Помилка при видаленні', error: error.message });
//     }
// });

// export default router;

















import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ======================
// Schema
// ======================

const propertySchema = new mongoose.Schema(
    {
        source: {
            type: String,
            default: "",
        },

        owner: {
            name: String,
            address: String,
            phone: String,
            taxNumber: String,
            passport: String,
        },

        plot: {
            plotType: String,

            cadnum: {
                type: String,
                index: true,
            },

            area: Number,

            normativeValuation: Number,
        },

        document: {
            documentType: String,
            documentNumber: String,
            registrationNumber: String,
            registrationDate: String,
        },

        agreement: {
            contractNumber: String,
            signDate: String,
            registrationDateDZK: String,
            endDate: String,
            termYears: String,
            rentPercent: Number,
            terminationInfo: String,
        },

        geometry: {
            type: {
                type: String,
                enum: ["Polygon", "MultiPolygon", null],
                default: null,
            },

            coordinates: {
                type: Array,
                default: [],
            },
        },

        note: {
            type: String,
            default: "",
        },
    },
    {
        collection: "property",
        timestamps: true,
    }
);

// ======================
// Індекси
// ======================

// Геоіндекс тільки якщо геометрія існує
propertySchema.index(
    { geometry: "2dsphere" },
    {
        partialFilterExpression: {
            "geometry.type": {
                $in: ["Polygon", "MultiPolygon"],
            },
        },
    }
);

propertySchema.index({ "plot.cadnum": 1 });

// ======================
// Model
// ======================

const Property =
    mongoose.models.Property ||
    mongoose.model("Property", propertySchema);

// ======================
// GET ALL
// ======================

router.get("/", async (req, res) => {
    try {
        const properties = await Property.find().lean();

        res.status(200).json(properties);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання ділянок",
            error: error.message,
        });
    }
});

// ======================
// GET BY ID
// ======================

router.get("/:id", async (req, res) => {
    try {
        const property = await Property.findById(req.params.id);

        if (!property) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json(property);
    } catch (error) {
        res.status(500).json({
            message: "Помилка отримання ділянки",
            error: error.message,
        });
    }
});

// ======================
// POST
// ======================

router.post("/", async (req, res) => {
    try {
        const body = req.body;

        if (Array.isArray(body)) {
            const result = await Property.insertMany(body);

            return res.status(201).json({
                message: "Ділянки успішно додано",
                inserted: result.length,
                data: result,
            });
        }

        const property = await Property.create(body);

        res.status(201).json({
            message: "Ділянку успішно додано",
            data: property,
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка створення ділянки",
            error: error.message,
        });
    }
});

// ======================
// PUT
// ======================

router.put("/:id", async (req, res) => {
    try {
        const property = await Property.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!property) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json({
            message: "Ділянку успішно оновлено",
            data: property,
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка оновлення ділянки",
            error: error.message,
        });
    }
});

// ======================
// DELETE
// ======================

router.delete("/:id", async (req, res) => {
    try {
        const property = await Property.findByIdAndDelete(req.params.id);

        if (!property) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json({
            message: "Ділянку успішно видалено",
        });
    } catch (error) {
        res.status(500).json({
            message: "Помилка видалення ділянки",
            error: error.message,
        });
    }
});

export default router;