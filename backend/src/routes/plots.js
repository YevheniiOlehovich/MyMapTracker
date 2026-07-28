import express from "express";
import mongoose from "mongoose";

const router = express.Router();

// ======================
// Schema
// ======================

const plotSchema = new mongoose.Schema(
    {
        ownershipType: {
            type: String,
            default: "",
        },

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
            },

            coordinates: {
                type: Array,
            },
        },

        note: {
            type: String,
            default: "",
        },
    },
    {
        collection: "plots",
        timestamps: true,
    }
);

// ======================
// Indexes
// ======================

plotSchema.index({ geometry: "2dsphere" });
plotSchema.index({ "plot.cadnum": 1 });

// ======================
// Model
// ======================

const Plot =
    mongoose.models.Plot ||
    mongoose.model("Plot", plotSchema);

// ======================
// GET ALL
// ======================

router.get("/", async (req, res) => {
    try {
        const plots = await Plot.find().lean();

        res.status(200).json(plots);
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
        const plot = await Plot.findById(req.params.id);

        if (!plot) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json(plot);
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
            const result = await Plot.insertMany(body);

            return res.status(201).json({
                message: "Ділянки успішно додано",
                inserted: result.length,
                data: result,
            });
        }

        const plot = await Plot.create(body);

        res.status(201).json({
            message: "Ділянку успішно додано",
            data: plot,
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
        const plot = await Plot.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true,
            }
        );

        if (!plot) {
            return res.status(404).json({
                message: "Ділянку не знайдено",
            });
        }

        res.status(200).json({
            message: "Ділянку успішно оновлено",
            data: plot,
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
        const plot = await Plot.findByIdAndDelete(req.params.id);

        if (!plot) {
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