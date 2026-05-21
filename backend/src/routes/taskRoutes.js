import express from "express";
import mongoose from "mongoose";
import multer from "multer";

const router = express.Router();
const upload = multer();

/* =======================
   MODEL
======================= */

const TaskSchema = new mongoose.Schema(
  {
    groupId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Group",
    },

    fieldId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Field",
    },

    operationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Operation",
    },

    varietyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Variety",
    },

    cropId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Crop",
    },

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

        // 🔥 ПЛОЩА ЕКІПАЖУ
        processedArea: {
          type: Number,
          default: 0,
        },
      },
    ],

    note: {
      type: String,
      default: "",
    },

    daysToComplete: {
      type: Number,
      default: null,
    },

    startDate: {
      type: Date,
      default: null,
    },

    status: {
      type: String,
      enum: ["new", "in_progress", "done"],
      default: "new",
    },

    // 🔥 TOTAL AREA
    processedArea: {
      type: Number,
      default: 0,
    },

    order: {
      type: Number,
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

const Task = mongoose.model(
  "Task",
  TaskSchema
);

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
    .populate(
      "assignments.personnelId"
    )
    .populate(
      "assignments.vehicleId"
    )
    .populate(
      "assignments.techniqueId"
    );
}

function calculateTotalProcessedArea(
  assignments
) {
  return assignments.reduce(
    (sum, a) =>
      sum +
      (Number(a.processedArea) || 0),
    0
  );
}

function calculateTaskStatus(
  totalProcessedArea,
  fieldArea
) {
  if (totalProcessedArea <= 0) {
    return "new";
  }

  if (
    fieldArea &&
    totalProcessedArea >= fieldArea
  ) {
    return "done";
  }

  return "in_progress";
}

function buildDateRangeFilter(
  start,
  end
) {
  return {
    startDate: {
      $ne: null,
    },

    $expr: {
      $and: [
        {
          $lte: ["$startDate", end],
        },

        {
          $gte: [
            {
              $add: [
                "$startDate",

                {
                  $multiply: [
                    {
                      $max: [
                        {
                          $ifNull: [
                            "$daysToComplete",
                            1,
                          ],
                        },

                        1,
                      ],
                    },

                    86400000,
                  ],
                },
              ],
            },

            start,
          ],
        },
      ],
    },
  };
}

/* =======================
   GET ALL
======================= */

router.get("/", async (req, res) => {
  try {
    const tasks =
      await buildPopulate(
        Task.find().sort({
          order: -1,
        })
      );

    res.json(tasks);

  } catch (error) {
    console.error(
      "Error fetching tasks:",
      error
    );

    res.status(500).json({
      message:
        "Error fetching tasks",
      error: error.message,
    });
  }
});

/* =======================
   GET TASKS BY DATE
======================= */

router.get(
  "/date",
  async (req, res) => {
    try {
      const { date } = req.query;

      if (!date) {
        return res
          .status(400)
          .json({
            message:
              "date is required",
          });
      }

      const day = new Date(date);

      const tasks =
        await buildPopulate(
          Task.find(
            buildDateRangeFilter(
              day,
              day
            )
          ).sort({
            startDate: 1,
          })
        );

      res.json(tasks);

    } catch (error) {
      console.error(
        "Error fetching tasks by date:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching tasks by date",
        error: error.message,
      });
    }
  }
);

/* =======================
   GET TASKS BY RANGE
======================= */

router.get(
  "/range",
  async (req, res) => {
    try {
      const {
        startDate,
        endDate,
      } = req.query;

      if (
        !startDate ||
        !endDate
      ) {
        return res
          .status(400)
          .json({
            message:
              "startDate and endDate are required",
          });
      }

      const start = new Date(
        `${startDate}T00:00:00.000Z`
      );

      const end = new Date(
        `${endDate}T23:59:59.999Z`
      );

      const tasks =
        await Task.find({
          startDate: {
            $gte: start,
            $lte: end,
          },
        })

          .select(`
            order
            startDate
            status
            processedArea
            note
            assignments
            fieldId
            operationId
            cropId
            varietyId
          `)

          .populate(
            "fieldId",
            "properties.name properties.area"
          )

          .populate(
            "operationId",
            "name"
          )

          .populate(
            "cropId",
            "name"
          )

          .populate(
            "varietyId",
            "name"
          )

          .populate(
            "assignments.personnelId",
            "firstName lastName"
          )

          .populate(
            "assignments.vehicleId",
            "mark headerWidth"
          )

          .populate(
            "assignments.techniqueId",
            "name width"
          )

          .sort({
            startDate: 1,
          });

      res.json(tasks);

    } catch (error) {
      console.error(
        "Error fetching tasks by range:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching tasks by range",
        error: error.message,
      });
    }
  }
);

/* =======================
   GET BY ID
======================= */

router.get(
  "/:id",
  async (req, res) => {
    try {
      const task =
        await buildPopulate(
          Task.findById(
            req.params.id
          )
        );

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      res.json(task);

    } catch (error) {
      console.error(
        "Error fetching task:",
        error
      );

      res.status(500).json({
        message:
          "Error fetching task",
        error: error.message,
      });
    }
  }
);

/* =======================
   CREATE
======================= */

router.post(
  "/",
  upload.none(),
  async (req, res) => {
    try {
      const daysVal = Number(
        req.body.daysToComplete
      );

      const parsedDays =
        isNaN(daysVal)
          ? null
          : daysVal;

      const parsedAssignments =
        req.body.assignments
          ? JSON.parse(
              req.body.assignments
            )
          : [];

      const totalProcessedArea =
        calculateTotalProcessedArea(
          parsedAssignments
        );

      const field =
        await mongoose
          .model("Field")
          .findById(
            extractId(
              req.body.field
            )
          );

      const fieldArea =
        Number(
          field?.properties
            ?.area
        ) || 0;

      const status =
        calculateTaskStatus(
          totalProcessedArea,
          fieldArea
        );

      const lastTask =
        await Task.findOne()
          .sort({
            order: -1,
          })
          .select("order");

      const nextOrder =
        lastTask?.order
          ? lastTask.order + 1
          : 1;

      const taskData = {
        groupId: extractId(
          req.body.group
        ),

        fieldId: extractId(
          req.body.field
        ),

        operationId:
          extractId(
            req.body.operation
          ),

        varietyId: extractId(
          req.body.variety
        ),

        cropId: extractId(
          req.body.crop
        ),

        assignments:
          parsedAssignments.map(
            (a) => ({
              personnelId:
                extractId(
                  a.personnel
                ),

              vehicleId:
                extractId(
                  a.vehicle
                ),

              techniqueId:
                extractId(
                  a.technique
                ),

              processedArea:
                Number(
                  a.processedArea
                ) || 0,
            })
          ),

        note:
          typeof req.body
            .note === "string"
            ? req.body.note.trim()
            : "",

        daysToComplete:
          parsedDays,

        startDate:
          req.body.startDate
            ? new Date(
                req.body.startDate
              )
            : null,

        processedArea:
          totalProcessedArea,

        status,

        order: nextOrder,
      };

      const newTask =
        new Task(taskData);

      await newTask.save();

      const populated =
        await buildPopulate(
          Task.findById(
            newTask._id
          )
        );

      res
        .status(201)
        .json(populated);

    } catch (error) {
      console.error(
        "Error creating task:",
        error
      );

      res.status(500).json({
        message:
          "Error creating task",
        error: error.message,
      });
    }
  }
);

/* =======================
   UPDATE
======================= */

router.put(
  "/:id",
  upload.none(),
  async (req, res) => {
    try {
      const daysVal = Number(
        req.body.daysToComplete
      );

      const parsedDays =
        isNaN(daysVal)
          ? null
          : daysVal;

      const parsedAssignments =
        req.body.assignments
          ? JSON.parse(
              req.body.assignments
            )
          : [];

      const totalProcessedArea =
        calculateTotalProcessedArea(
          parsedAssignments
        );

      const field =
        await mongoose
          .model("Field")
          .findById(
            extractId(
              req.body.field
            )
          );

      const fieldArea =
        Number(
          field?.properties
            ?.area
        ) || 0;

      const status =
        calculateTaskStatus(
          totalProcessedArea,
          fieldArea
        );

      const updateData = {
        groupId: extractId(
          req.body.group
        ),

        fieldId: extractId(
          req.body.field
        ),

        operationId:
          extractId(
            req.body.operation
          ),

        varietyId: extractId(
          req.body.variety
        ),

        cropId: extractId(
          req.body.crop
        ),

        assignments:
          parsedAssignments.map(
            (a) => ({
              personnelId:
                extractId(
                  a.personnel
                ),

              vehicleId:
                extractId(
                  a.vehicle
                ),

              techniqueId:
                extractId(
                  a.technique
                ),

              processedArea:
                Number(
                  a.processedArea
                ) || 0,
            })
          ),

        note:
          typeof req.body
            .note === "string"
            ? req.body.note.trim()
            : "",

        daysToComplete:
          parsedDays,

        startDate:
          req.body.startDate
            ? new Date(
                req.body.startDate
              )
            : null,

        processedArea:
          totalProcessedArea,

        status,
      };

      const updated =
        await buildPopulate(
          Task.findByIdAndUpdate(
            req.params.id,
            updateData,
            {
              new: true,
              runValidators: true,
            }
          )
        );

      if (!updated) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      res.json(updated);

    } catch (error) {
      console.error(
        "Error updating task:",
        error
      );

      res.status(500).json({
        message:
          "Error updating task",
        error: error.message,
      });
    }
  }
);

/* =======================
   UPDATE REPORT
======================= */

router.patch(
  "/:id/report",
  upload.none(),
  async (req, res) => {
    try {
      const parsedAssignments =
        req.body.assignments
          ? JSON.parse(
              req.body.assignments
            )
          : [];

      const task =
        await Task.findById(
          req.params.id
        ).populate("fieldId");

      if (!task) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      // 🔥 UPDATE CREW AREAS

      task.assignments.forEach(
        (
          assignment,
          index
        ) => {
          assignment.processedArea =
            Number(
              parsedAssignments[
                index
              ]?.processedArea
            ) || 0;
        }
      );

      // 🔥 TOTAL

      const totalProcessedArea =
        calculateTotalProcessedArea(
          task.assignments
        );

      task.processedArea =
        totalProcessedArea;

      const fieldArea =
        Number(
          task.fieldId
            ?.properties?.area
        ) || 0;

      // 🔥 STATUS

      task.status =
        calculateTaskStatus(
          totalProcessedArea,
          fieldArea
        );

      await task.save();

      const populated =
        await buildPopulate(
          Task.findById(
            task._id
          )
        );

      res.json(populated);

    } catch (error) {
      console.error(
        "Error updating report:",
        error
      );

      res.status(500).json({
        message:
          "Error updating report",
        error: error.message,
      });
    }
  }
);

/* =======================
   DELETE
======================= */

router.delete(
  "/:id",
  async (req, res) => {
    try {
      const deleted =
        await Task.findByIdAndDelete(
          req.params.id
        );

      if (!deleted) {
        return res
          .status(404)
          .json({
            message:
              "Task not found",
          });
      }

      res.json({
        message:
          "Task deleted",
      });

    } catch (error) {
      console.error(
        "Error deleting task:",
        error
      );

      res.status(500).json({
        message:
          "Error deleting task",
        error: error.message,
      });
    }
  }
);

export default router;