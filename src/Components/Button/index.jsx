
import React from "react";
import Button from "@mui/material/Button";

export default function MyButton({ text, onClick }) {
    return (
        <Button 
            variant="contained" 
            color="primary" 
            onClick={onClick}
            sx={{
                width: 140,
                height: 40,
                fontSize: 14,
                fontFamily: "Arial, Helvetica, sans-serif",
                textTransform: "none",   // щоб не було CAPS LOCK
                textAlign: "center",
            }}
        >
        {text}
        </Button>
    );
}
