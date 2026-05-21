import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogActions,
    Typography,
    Button,
    IconButton,
    Box,
    TextField,
    Divider,
    Paper,
    Chip,
    Grid,
} from "@mui/material";

import CloseIcon from "@mui/icons-material/Close";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

import dayjs from "dayjs";

import { closeExportTasksModal } from "../../store/modalSlice";
import { fetchTasksByRangeApi } from "../../api/tasksApi";
import { exportTasksToExcel } from "../../helpres/exportTasksToExcel";

const AddTaskExportModal = () => {
    const dispatch = useDispatch();

    const isVisible = useSelector(
        (state) => state.modals.isExportTasksModalVisible
    );

    const [fromDate, setFromDate] = useState("");
    const [toDate, setToDate] = useState("");

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(false);

    const today = dayjs().format("YYYY-MM-DD");

    /* ---------- RESET ---------- */

    useEffect(() => {
        if (isVisible) {
            setFromDate("");
            setToDate("");
            setTasks([]);
        }
    }, [isVisible]);

    /* ---------- CLOSE ---------- */

    const handleClose = () => {
        dispatch(closeExportTasksModal());
    };

    /* ---------- LOAD TASKS ---------- */

    const handleLoadTasks = async () => {
        if (!fromDate || !toDate) {
            alert("Оберіть період");
            return;
        }

        try {
            setLoading(true);

            const from = dayjs(fromDate).format("YYYY-MM-DD");
            const to = dayjs(toDate).format("YYYY-MM-DD");

            const response = await fetchTasksByRangeApi(
                from,
                to
            );

            console.log("TASKS:", response);

            setTasks(response);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Dialog
            open={isVisible}
            onClose={handleClose}
            maxWidth="lg"
            fullWidth
        >
            {/* HEADER */}

            <DialogTitle
                sx={{
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "space-between",
                    pr: 1,
                }}
            >
                <Typography variant="h6">
                    Експорт тасок
                </Typography>

                <IconButton onClick={handleClose}>
                    <CloseIcon />
                </IconButton>
            </DialogTitle>

            {/* CONTENT */}

            <DialogContent
                dividers
                sx={{
                    height: "70vh",
                    display: "flex",
                    gap: 2,
                    overflow: "hidden",
                }}
            >
                {/* LEFT SIDE */}

                <Paper
                    elevation={2}
                    sx={{
                        width: 320,
                        p: 2,
                        display: "flex",
                        flexDirection: "column",
                        gap: 3,
                        flexShrink: 0,
                    }}
                >
                    <Typography variant="subtitle1">
                        Параметри експорту
                    </Typography>

                    <Divider />

                    <TextField
                        label="Дата від"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: today,
                        }}
                        value={fromDate}
                        onChange={(e) =>
                            setFromDate(e.target.value)
                        }
                    />

                    <TextField
                        label="Дата до"
                        type="date"
                        fullWidth
                        InputLabelProps={{
                            shrink: true,
                        }}
                        inputProps={{
                            max: today,
                        }}
                        value={toDate}
                        onChange={(e) =>
                            setToDate(e.target.value)
                        }
                    />

                    <Button
                        variant="contained"
                        onClick={handleLoadTasks}
                        disabled={
                            !fromDate ||
                            !toDate ||
                            loading
                        }
                    >
                        {loading
                            ? "Завантаження..."
                            : "Отримати таски"}
                    </Button>

                    {/* 🔥 ПОКИ ЛОЧИМО */}

                    <Button
                        variant="outlined"
                        onClick={() =>
                            exportTasksToExcel(
                                tasks,
                                fromDate,
                                toDate
                            )
                        }
                        disabled={!tasks.length}
                    >
                        Експортувати Excel
                    </Button>
                </Paper>

                {/* RIGHT SIDE */}

                <Paper
                    elevation={2}
                    sx={{
                        flex: 1,
                        display: "flex",
                        flexDirection: "column",
                        overflow: "hidden",
                    }}
                >
                    <Box
                        sx={{
                            p: 2,
                            borderBottom:
                                "1px solid #ddd",
                        }}
                    >
                        <Typography variant="subtitle1">
                            Отримані таски ({tasks.length})
                        </Typography>
                    </Box>

                    <Box
                        sx={{
                            flex: 1,
                            overflowY: "auto",
                        }}
                    >
                        {tasks.length === 0 ? (
                            <Box
                                sx={{
                                    height: "100%",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                }}
                            >
                                <Typography
                                    color="text.secondary"
                                >
                                    Немає даних
                                </Typography>
                            </Box>
                        ) : (
                            <Box
                                sx={{
                                    p: 2,
                                    display: "flex",
                                    flexDirection: "column",
                                    gap: 2,
                                }}
                            >
                                {tasks.map((task) => (
                                    <Accordion key={task._id}>

                                        {/* HEADER */}

                                        <AccordionSummary
                                            expandIcon={<ExpandMoreIcon />}
                                        >
                                            <Box
                                                sx={{
                                                    width: "100%",
                                                    display: "flex",
                                                    justifyContent:
                                                        "space-between",
                                                    alignItems: "center",
                                                    gap: 2,
                                                }}
                                            >
                                                <Box>
                                                    <Typography
                                                        fontWeight={700}
                                                    >
                                                        #{task.order}
                                                    </Typography>

                                                    <Typography variant="body2">
                                                        Поле: {task.fieldId?.properties?.name ?? "—"}
                                                    </Typography>
                                                </Box>

                                                <Box textAlign="right">
                                                    <Typography>
                                                        {
                                                            task.operationId
                                                                ?.name
                                                        }
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        {dayjs(
                                                            task.startDate
                                                        ).format(
                                                            "DD.MM.YYYY"
                                                        )}
                                                    </Typography>
                                                </Box>
                                            </Box>
                                        </AccordionSummary>

                                        {/* DETAILS */}

                                        <AccordionDetails>

                                            <Grid
                                                container
                                                spacing={2}
                                            >

                                                <Grid item xs={12} md={6}>
                                                    <Typography>
                                                        <strong>
                                                            Площа поля:
                                                        </strong>{" "}
                                                        {task.fieldId?.properties?.area ?? "—"} га
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography>
                                                        <strong>
                                                            Оброблено:
                                                        </strong>{" "}
                                                        {Number(
                                                            task.processedArea ||
                                                            0
                                                        ).toFixed(2)} га
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography>
                                                        <strong>
                                                            Статус:
                                                        </strong>
                                                    </Typography>

                                                    <Chip
                                                        size="small"
                                                        label={task.status}
                                                        sx={{ mt: 1 }}
                                                    />
                                                </Grid>

                                                <Grid item xs={12} md={6}>
                                                    <Typography>
                                                        <strong>
                                                            Культура:
                                                        </strong>{" "}
                                                        {task.cropId?.name ||
                                                            "—"}
                                                    </Typography>

                                                    <Typography
                                                        sx={{ mt: 1 }}
                                                    >
                                                        <strong>
                                                            Сорт:
                                                        </strong>{" "}
                                                        {task.varietyId
                                                            ?.name || "—"}
                                                    </Typography>
                                                </Grid>

                                                <Grid item xs={12}>
                                                    <Typography>
                                                        <strong>
                                                            Примітка:
                                                        </strong>
                                                    </Typography>

                                                    <Typography
                                                        variant="body2"
                                                    >
                                                        {task.note || "—"}
                                                    </Typography>
                                                </Grid>

                                            </Grid>

                                            <Divider sx={{ my: 2 }} />

                                            {/* ASSIGNMENTS */}

                                            <Typography
                                                variant="subtitle1"
                                                fontWeight={700}
                                                sx={{ mb: 2 }}
                                            >
                                                Екіпажі
                                            </Typography>

                                            <Box
                                                sx={{
                                                    display: "flex",
                                                    flexDirection: "column",
                                                    gap: 2,
                                                }}
                                            >
                                                {task.assignments?.map(
                                                    (
                                                        assignment,
                                                        index
                                                    ) => (
                                                        <Paper
                                                            key={
                                                                assignment._id ||
                                                                index
                                                            }
                                                            variant="outlined"
                                                            sx={{
                                                                p: 2,
                                                                borderRadius: 2,
                                                            }}
                                                        >
                                                            <Typography
                                                                fontWeight={700}
                                                            >
                                                                Екіпаж #
                                                                {index + 1}
                                                            </Typography>

                                                            <Typography
                                                                sx={{ mt: 1 }}
                                                            >
                                                                <strong>
                                                                    Працівник:
                                                                </strong>{" "}
                                                                {/* {
                                                                    assignment
                                                                        .personnelId
                                                                        ?.lastName
                                                                }{" "}
                                                                {
                                                                    assignment
                                                                        .personnelId
                                                                        ?.firstName
                                                                } */}
                                                                {assignment.personnelId
                                                                    ? `${assignment.personnelId.lastName} ${assignment.personnelId.firstName}`
                                                                    : "—"}
                                                            </Typography>

                                                            <Typography
                                                                sx={{ mt: 1 }}
                                                            >
                                                                <strong>
                                                                    Транспорт:
                                                                </strong>{" "}
                                                                {assignment
                                                                    .vehicleId
                                                                    ?.mark ||
                                                                    "—"}
                                                            </Typography>

                                                            <Typography sx={{ mt: 1 }}>
                                                                <strong>
                                                                    Техніка:
                                                                </strong>{" "}
                                                                {assignment.techniqueId?.name ||
                                                                    assignment.vehicleId?.mark ||
                                                                    "—"}
                                                            </Typography>

                                                            <Typography sx={{ mt: 1 }}>
                                                                <strong>
                                                                    Ширина:
                                                                </strong>{" "}
                                                                {
                                                                    assignment.techniqueId?.width ??
                                                                    assignment.vehicleId?.headerWidth ??
                                                                    "—"
                                                                }
                                                            </Typography>

                                                            <Typography>
                                                                <strong>
                                                                    Оброблено:
                                                                </strong>{" "}
                                                                {
                                                                    Number(
                                                                        assignment.processedArea > 0
                                                                            ? assignment.processedArea
                                                                            : task.assignments?.length === 1
                                                                                ? task.processedArea
                                                                                : 0
                                                                    ).toFixed(2)
                                                                } га
                                                            </Typography>
                                                        </Paper>
                                                    )
                                                )}
                                            </Box>

                                        </AccordionDetails>
                                    </Accordion>
                                ))}
                            </Box>
                        )}
                    </Box>
                </Paper>
            </DialogContent>

            {/* FOOTER */}

            <DialogActions
                sx={{
                    px: 3,
                    py: 2,
                }}
            >
                <Button
                    variant="outlined"
                    onClick={handleClose}
                >
                    Закрити
                </Button>
            </DialogActions>
        </Dialog>
    );
};

export default AddTaskExportModal;