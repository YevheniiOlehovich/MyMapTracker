import React, { useState } from 'react';
import Styles from './styles';

export default function Login({ onLogin }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch('http://localhost:5000/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password }),
            });

            const data = await response.json();
            if (response.ok) {
                localStorage.setItem('token', data.token); // Зберігаємо токен
                onLogin(); // Оновлюємо стан авторизації
            } else {
                setError(data.message); // Відображаємо помилку
            }
        } catch (error) {
            setError('Помилка з\'єднання з сервером');
        }
    };

    return (
        <Styles.wrapper>
            <Styles.form onSubmit={handleLogin}>
                <Styles.title>Авторизація</Styles.title>
                {error && <Styles.errorMessage>{error}</Styles.errorMessage>}
                <Styles.input
                    type="text"
                    placeholder="Ім'я користувача"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />
                <Styles.input
                    type="password"
                    placeholder="Пароль"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />
                <Styles.button type="submit">Увійти</Styles.button>
            </Styles.form>
        </Styles.wrapper>
    );
}