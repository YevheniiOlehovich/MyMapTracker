import * as XLSX from "xlsx";
import dayjs from "dayjs";

export const exportTasksToExcel = (
    tasks = [],
    fromDate,
    toDate
) => {

    if (!tasks.length) {
        alert("Немає даних для експорту");
        return;
    }

    const rows = [];

    tasks.forEach((task) => {

        const assignments =
            task.assignments || [];

        assignments.forEach((assignment, index) => {

            const operator =
                assignment.personnelId
                    ? `${assignment.personnelId.lastName} ${assignment.personnelId.firstName}`
                    : "—";

            const processedArea =
                Number(
                    assignment.processedArea > 0
                        ? assignment.processedArea
                        : assignments.length === 1
                            ? task.processedArea || 0
                            : 0
                ).toFixed(2);

            rows.push({

                "№ Таски":
                    task.order || "—",

                "Дата":
                    task.startDate
                        ? dayjs(task.startDate)
                            .format("DD.MM.YYYY")
                        : "—",

                "Операція":
                    task.operationId?.name || "—",

                "Поле":
                    task.fieldId?.properties?.name || "—",

                "Площа поля (га)":
                    task.fieldId?.properties?.area || 0,

                "Статус":
                    task.status || "—",

                "Культура":
                    task.cropId?.name || "—",

                "Сорт":
                    task.varietyId?.name || "—",

                "Екіпаж":
                    `#${index + 1}`,

                "Працівник":
                    operator,

                "Транспорт":
                    assignment.vehicleId?.mark || "—",

                "Техніка":
                    assignment.techniqueId?.name ||
                    assignment.vehicleId?.mark ||
                    "—",

                "Ширина":
                    assignment.techniqueId?.width ??
                    assignment.vehicleId?.headerWidth ??
                    "—",

                "Оброблено (га)":
                    processedArea,

                "Примітка":
                    task.note || "",
            });
        });

        if (!assignments.length) {

            rows.push({

                "№ Таски":
                    task.order || "—",

                "Дата":
                    task.startDate
                        ? dayjs(task.startDate)
                            .format("DD.MM.YYYY")
                        : "—",

                "Операція":
                    task.operationId?.name || "—",

                "Поле":
                    task.fieldId?.properties?.name || "—",

                "Площа поля (га)":
                    task.fieldId?.properties?.area || 0,

                "Статус":
                    task.status || "—",

                "Культура":
                    task.cropId?.name || "—",

                "Сорт":
                    task.varietyId?.name || "—",

                "Екіпаж":
                    "—",

                "Працівник":
                    "—",

                "Транспорт":
                    "—",

                "Техніка":
                    "—",

                "Ширина":
                    "—",

                "Оброблено (га)":
                    Number(task.processedArea || 0)
                        .toFixed(2),

                "Примітка":
                    task.note || "",
            });
        }
    });

    const worksheet =
        XLSX.utils.json_to_sheet(rows);

    worksheet["!cols"] = [
        { wch: 10 },
        { wch: 14 },
        { wch: 28 },
        { wch: 30 },
        { wch: 16 },
        { wch: 14 },
        { wch: 20 },
        { wch: 20 },
        { wch: 10 },
        { wch: 28 },
        { wch: 28 },
        { wch: 35 },
        { wch: 12 },
        { wch: 18 },
        { wch: 50 },
    ];

    const workbook =
        XLSX.utils.book_new();

    XLSX.utils.book_append_sheet(
        workbook,
        worksheet,
        "Tasks"
    );

    const formattedFrom =
        dayjs(fromDate)
            .format("DD.MM.YYYY");

    const formattedTo =
        dayjs(toDate)
            .format("DD.MM.YYYY");

    const fileName =
        fromDate === toDate
            ? `tasks_${formattedFrom}.xlsx`
            : `tasks_${formattedFrom}-${formattedTo}.xlsx`;

    XLSX.writeFile(
        workbook,
        fileName
    );
};