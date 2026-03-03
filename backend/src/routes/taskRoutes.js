import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const router = express.Router();
const upload = multer(); // для multipart/form-data без файлів

/* =======================
   MODEL
======================= */

const TaskSchema = new mongoose.Schema(
  {
    groupId: { type: mongoose.Schema.Types.ObjectId, ref: "Group" },
    fieldId: { type: mongoose.Schema.Types.ObjectId, ref: "Field" },
    operationId: { type: mongoose.Schema.Types.ObjectId, ref: "Operation" },
    varietyId: { type: mongoose.Schema.Types.ObjectId, ref: "Variety" },
    cropId: { type: mongoose.Schema.Types.ObjectId, ref: "Crop" },

    assignments: [
      {
        personnelId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Personnel",
        },
        vehicleId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Vehicle",
        },
        techniqueId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Technique",
        },
      },
    ],

    note: { type: String, default: "" },
    daysToComplete: { type: Number, default: null },
    startDate: { type: Date, default: null },

    status: {
      type: String,
      enum: ["new", "in_progress", "done"],
      default: "new",
    },

    processedArea: { type: Number, default: 0 },
    order: { type: Number, required: true },
  },
  { timestamps: true }
);

const Task = mongoose.model("Task", TaskSchema);

/* =======================
   HELPERS
======================= */

function extractId(val) {
  if (!val) return null;
  if (typeof val === "object") {
    return val.value || val._id || null;
  }
  return val;
}

function buildPopulate(query) {
  return query
    .populate("groupId")
    .populate("fieldId")
    .populate("operationId")
    .populate("varietyId")
    .populate("cropId")
    .populate("assignments.personnelId")
    .populate("assignments.vehicleId")
    .populate("assignments.techniqueId");
}

/* =======================
   GET ALL (with date filter)
======================= */

router.get("/", async (req, res) => {
  try {
    const { date } = req.query;
    let filter = {};

    if (date) {
      const day = new Date(date);

      filter = {
        $expr: {
          $and: [
            { $lte: ["$startDate", day] },
            {
              $gt: [
                {
                  $add: [
                    "$startDate",
                    { $multiply: ["$daysToComplete", 86400000] },
                  ],
                },
                day,
              ],
            },
          ],
        },
      };
    }

    const tasks = await buildPopulate(
      Task.find(filter).sort({ order: -1 })
    );

    res.json(tasks);
  } catch (error) {
    console.error("Error fetching tasks:", error);
    res.status(500).json({
      message: "Error fetching tasks",
      error: error.message,
    });
  }
});

/* =======================
   GET BY ID
======================= */

router.get("/:id", async (req, res) => {
  try {
    const task = await buildPopulate(Task.findById(req.params.id));

    if (!task) return res.status(404).json({ message: "Task not found" });

    res.json(task);
  } catch (error) {
    console.error("Error fetching task:", error);
    res.status(500).json({
      message: "Error fetching task",
      error: error.message,
    });
  }
});

/* =======================
   CREATE
======================= */

router.post("/", upload.none(), async (req, res) => {
  try {
    const daysVal = Number(req.body.daysToComplete);
    const parsedDays = isNaN(daysVal) ? null : daysVal;

    const parsedAssignments = req.body.assignments
      ? JSON.parse(req.body.assignments)
      : [];

    const lastTask = await Task.findOne()
      .sort({ order: -1 })
      .select("order");

    const nextOrder = lastTask?.order ? lastTask.order + 1 : 1;

    const taskData = {
      groupId: extractId(req.body.group),
      fieldId: extractId(req.body.field),
      operationId: extractId(req.body.operation),
      varietyId: extractId(req.body.variety),
      cropId: extractId(req.body.crop),

      assignments: parsedAssignments.map((a) => ({
        personnelId: extractId(a.personnel),
        vehicleId: extractId(a.vehicle),
        techniqueId: extractId(a.technique),
      })),

      note:
        typeof req.body.note === "string"
          ? req.body.note.trim()
          : "",

      daysToComplete: parsedDays,
      startDate: req.body.startDate
        ? new Date(req.body.startDate)
        : null,

      status: "new",
      order: nextOrder,
    };

    const newTask = new Task(taskData);
    await newTask.save();

    const populated = await buildPopulate(
      Task.findById(newTask._id)
    );

    res.status(201).json(populated);
  } catch (error) {
    console.error("Error creating task:", error);
    res.status(500).json({
      message: "Error creating task",
      error: error.message,
    });
  }
});

/* =======================
   UPDATE
======================= */

router.put("/:id", upload.none(), async (req, res) => {
  try {
    const daysVal = Number(req.body.daysToComplete);
    const parsedDays = isNaN(daysVal) ? null : daysVal;

    const parsedAssignments = req.body.assignments
      ? JSON.parse(req.body.assignments)
      : [];

    const processedAreaVal = Number(req.body.processedArea);
    const parsedProcessedArea = isNaN(processedAreaVal)
      ? 0
      : processedAreaVal;

    const startDate = req.body.startDate
      ? new Date(req.body.startDate)
      : null;

    // Автоматичний статус
    let status = "new";
    const today = new Date();

    if (parsedProcessedArea > 0 && startDate && parsedDays) {
      const endDate = new Date(startDate);
      endDate.setDate(endDate.getDate() + parsedDays);

      if (today < endDate) status = "in_progress";
      else status = "done";
    }

    const updateData = {
      groupId: extractId(req.body.group),
      fieldId: extractId(req.body.field),
      operationId: extractId(req.body.operation),
      varietyId: extractId(req.body.variety),
      cropId: extractId(req.body.crop),

      assignments: parsedAssignments.map((a) => ({
        personnelId: extractId(a.personnel),
        vehicleId: extractId(a.vehicle),
        techniqueId: extractId(a.technique),
      })),

      note:
        typeof req.body.note === "string"
          ? req.body.note.trim()
          : "",

      daysToComplete: parsedDays,
      startDate,
      processedArea: parsedProcessedArea,
      status,
    };

    const updated = await buildPopulate(
      Task.findByIdAndUpdate(req.params.id, updateData, {
        new: true,
        runValidators: true,
      })
    );

    if (!updated)
      return res.status(404).json({ message: "Task not found" });

    res.json(updated);
  } catch (error) {
    console.error("Error updating task:", error);
    res.status(500).json({
      message: "Error updating task",
      error: error.message,
    });
  }
});

/* =======================
   PATCH STATUS
======================= */

// router.patch("/:id/status", upload.none(), async (req, res) => {
//   try {
//     const { status } = req.body;

//     if (!["new", "in_progress", "done"].includes(status)) {
//       return res.status(400).json({ message: "Invalid status" });
//     }

//     const updated = await buildPopulate(
//       Task.findByIdAndUpdate(
//         req.params.id,
//         { status },
//         { new: true, runValidators: true }
//       )
//     );

//     if (!updated)
//       return res.status(404).json({ message: "Task not found" });

//     res.json(updated);
//   } catch (error) {
//     console.error("Error updating status:", error);
//     res.status(500).json({
//       message: "Error updating status",
//       error: error.message,
//     });
//   }
// });

router.patch("/:id/report", upload.none(), async (req, res) => {
  try {
    const processedAreaVal = Number(req.body.processedArea);

    if (isNaN(processedAreaVal)) {
      return res.status(400).json({ message: "Invalid processed area" });
    }

    const task = await Task.findById(req.params.id)
      .populate("fieldId");

    if (!task)
      return res.status(404).json({ message: "Task not found" });

    task.processedArea = processedAreaVal;

    const fieldArea = task.fieldId?.properties?.area || 0;

    // логіка статусу
    if (processedAreaVal <= 0) {
      task.status = "new";
    } else if (fieldArea && processedAreaVal >= fieldArea) {
      task.status = "done";
    } else {
      task.status = "in_progress";
    }

    await task.save();

    const populated = await buildPopulate(
      Task.findById(task._id)
    );

    res.json(populated);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({
      message: "Error updating report",
      error: error.message,
    });
  }
});

/* =======================
   DELETE
======================= */

router.delete("/:id", async (req, res) => {
  try {
    const deleted = await Task.findByIdAndDelete(req.params.id);

    if (!deleted)
      return res.status(404).json({ message: "Task not found" });

    res.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    res.status(500).json({
      message: "Error deleting task",
      error: error.message,
    });
  }
});

export default router;
