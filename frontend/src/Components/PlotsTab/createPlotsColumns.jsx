import { Box, IconButton } from "@mui/material";
import EditOutlinedIcon from "@mui/icons-material/EditOutlined";
import DeleteOutlineIcon from "@mui/icons-material/DeleteOutline";

export const createPlotsColumns = ({
    columnHelper,
    onEdit,
    onDelete,
}) => [
    {
        id: "rowNumber",
        header: "#",
        accessorFn: (row, index) => index + 1,
        cell: (info) => info.getValue(),
        size: 50,
    },

    columnHelper.accessor(
        (row) => row.ownershipType,
        {
            id: "ownershipType",
            header: "Статус",

            cell: (info) => {
                const value = info.getValue();

                switch (value) {
                    case "own":
                        return "Власність";

                    case "rent":
                        return "Оренда";

                    default:
                        return "—";
                }
            },
        }
    ),

    columnHelper.accessor(
        (row) => row.source || "—",
        {
            id: "source",
            header: "Організація",
        }
    ),

    columnHelper.accessor(
        (row) => row.owner?.name || "—",
        {
            id: "owner",
            header: "Власник",
        }
    ),

    columnHelper.accessor(
        (row) => row.plot?.cadnum || "—",
        {
            id: "cadnum",
            header: "Кадастровий номер",
        }
    ),

    columnHelper.accessor(
        (row) => row.plot?.plotType || "—",
        {
            id: "plotType",
            header: "Тип угідь",
        }
    ),

    columnHelper.accessor(
        (row) => row.plot?.area,
        {
            id: "area",
            header: "Площа (га)",

            cell: (info) => {
                const value = Number(info.getValue());

                return Number.isNaN(value)
                    ? "—"
                    : value.toFixed(4);
            },
        }
    ),

    columnHelper.accessor(
        (row) => row.plot?.normativeValuation,
        {
            id: "valuation",
            header: "Норм. оцінка",

            cell: (info) => {
                const value = Number(info.getValue());

                return Number.isNaN(value)
                    ? "—"
                    : value.toLocaleString("uk-UA", {
                          maximumFractionDigits: 0,
                      });
            },
        }
    ),

    columnHelper.accessor(
        (row) => row.agreement?.rentPercent,
        {
            id: "rentPercent",
            header: "Оренда (%)",

            cell: (info) =>
                info.getValue() != null
                    ? `${info.getValue()} %`
                    : "—",
        }
    ),

    columnHelper.accessor(
        (row) => row.agreement?.endDate || "—",
        {
            id: "endDate",
            header: "Закінчення договору",
        }
    ),

    columnHelper.accessor(
        (row) => row.note || "—",
        {
            id: "note",
            header: "Нотатка",
        }
    ),

    columnHelper.display({
        id: "actions",
        header: "",
        size: 110,
        minSize: 110,
        maxSize: 110,
        enableSorting: false,

        cell: ({ row }) => (
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    gap: 0.5,
                }}
            >
                <IconButton
                    size="small"
                    onClick={() => onEdit(row.original)}
                >
                    <EditOutlinedIcon
                        fontSize="small"
                        color="primary"
                    />
                </IconButton>

                <IconButton
                    size="small"
                    onClick={() => onDelete(row.original)}
                >
                    <DeleteOutlineIcon
                        fontSize="small"
                        color="error"
                    />
                </IconButton>
            </Box>
        ),
    }),
];