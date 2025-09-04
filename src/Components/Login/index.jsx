// import React, { useState } from 'react';
// import Styles from './styles';

// export default function Login({ onLogin }) {
//     const [username, setUsername] = useState('');
//     const [password, setPassword] = useState('');
//     const [error, setError] = useState('');

//     const handleLogin = async (e) => {
//         e.preventDefault();
//         try {
//             const response = await fetch('http://localhost:5000/auth/login', {
//                 method: 'POST',
//                 headers: { 'Content-Type': 'application/json' },
//                 body: JSON.stringify({ username, password }),
//             });

//             const data = await response.json();
//             if (response.ok) {
//                 sessionStorage.setItem('token', data.token); // Зберігаємо токен у sessionStorage
//                 onLogin(); // Оновлюємо стан авторизації
//             } else {
//                 setError(data.message); // Відображаємо помилку
//             }
//         } catch (error) {
//             setError('Помилка з\'єднання з сервером');
//         }
//     };

//     return (
//         <Styles.wrapper>
//             <Styles.form onSubmit={handleLogin}>
//                 <Styles.title>Авторизація</Styles.title>
//                 {error && <Styles.errorMessage>{error}</Styles.errorMessage>}
//                 <Styles.input
//                     type="text"
//                     placeholder="Ім'я користувача"
//                     value={username}
//                     onChange={(e) => setUsername(e.target.value)}
//                 />
//                 <Styles.input
//                     type="password"
//                     placeholder="Пароль"
//                     value={password}
//                     onChange={(e) => setPassword(e.target.value)}
//                 />
//                 <Styles.button type="submit">Увійти</Styles.button>
//             </Styles.form>
//         </Styles.wrapper>
//     );
// }


import React, { useState } from "react";
import {
    Box,
    Paper,
    TextField,
    Button,
    Typography,
    Alert,
} from "@mui/material";
import backgroundImage from "../../assets/field.webp";

export default function Login({ onLogin }) {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
        const response = await fetch("http://localhost:5000/auth/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ username, password }),
        });

        const data = await response.json();
        if (response.ok) {
            sessionStorage.setItem("token", data.token); // Зберігаємо токен
            onLogin(); // Оновлюємо стан
        } else {
            setError(data.message);
        }
        } catch (error) {
        setError("Помилка з'єднання з сервером");
        }
    };

    return (
        <Box
        sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            backgroundImage: `url(${backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
        }}
        >
        <Paper
            elevation={6}
            sx={{
            padding: 4,
            borderRadius: 2,
            width: 320,
            textAlign: "center",
            bgcolor: "background.paper",
            }}
            component="form"
            onSubmit={handleLogin}
        >
            <Typography variant="h5" mb={2}>
            Авторизація
            </Typography>

            {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
                {error}
            </Alert>
            )}

            <TextField
            label="Ім'я користувача"
            variant="outlined"
            fullWidth
            margin="normal"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            />

            <TextField
            label="Пароль"
            type="password"
            variant="outlined"
            fullWidth
            margin="normal"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            />

            <Button
            type="submit"
            variant="contained"
            color="primary"
            fullWidth
            sx={{ mt: 2 }}
            >
            Увійти
            </Button>
        </Paper>
        </Box>
    );
}
