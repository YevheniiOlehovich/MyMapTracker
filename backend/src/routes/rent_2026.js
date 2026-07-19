import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ======================
// Schema
// ======================

const rent2026Schema = new mongoose.Schema(
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
                enum: ["Polygon", "MultiPolygon"],
                default: "Polygon",
            },

            coordinates: {
                type: Array,
                required: true,
            },
        },

        note: {
            type: String,
            default: "",
        },
    },
    {
        collection: "rent_2026",
        timestamps: true,
    }
);

// ======================
// Індекси
// ======================

rent2026Schema.index({ geometry: "2dsphere" });
rent2026Schema.index({ "plot.cadnum": 1 });

// ======================
// Model
// ======================

const Rent2026 =
    mongoose.models.Rent2026 ||
    mongoose.model("Rent2026", rent2026Schema);

// ======================
// GET ALL
// ======================

router.get("/", async (req, res) => {
    try {
        const rents = await Rent2026.find().lean();

        res.status(200).json(rents);
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
        const rent = await Rent2026.findById(req.params.id);

        if (!rent) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json(rent);
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
            const result = await Rent2026.insertMany(body);

            return res.status(201).json({
                message: "Ділянки успішно додано",
                inserted: result.length,
                data: result,
            });
        }

        const rent = await Rent2026.create(body);

        res.status(201).json({
            message: "Ділянку успішно додано",
            data: rent,
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
        const rent = await Rent2026.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!rent) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json({
            message: "Ділянку успішно оновлено",
            data: rent,
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
        const rent = await Rent2026.findByIdAndDelete(req.params.id);

        if (!rent) {
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