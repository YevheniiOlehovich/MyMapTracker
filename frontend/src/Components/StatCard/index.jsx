import { Box, Paper } from "@mui/material";

export default function StatCard({
    title,
    count = 0,
    area = 0,
    color,
    width = 90,
}) {
    return (
        <Paper
            variant="outlined"
            sx={{
                width,
                py: 0.8,
                px: 1,
                textAlign: "center",
                borderRadius: 2,
                transition: "0.2s",

                ...(color && {
                    borderTop: "3px solid",
                    borderColor: color,
                }),

                "&:hover": {
                    boxShadow: 2,
                },
            }}
        >
            <Box
                sx={{
                    fontSize: 11,
                    color: "text.secondary",
                    lineHeight: 1,
                    minHeight: 22,
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                }}
            >
                {title}
            </Box>

            <Box
                sx={{
                    fontSize: 18,
                    fontWeight: 700,
                    lineHeight: 1.2,
                    mt: 0.5,
                }}
            >
                {count}
            </Box>

            <Box
                sx={{
                    fontSize: 11,
                    color: "text.secondary",
                }}
            >
                {area.toFixed(1)} га
            </Box>
        </Paper>
    );
}